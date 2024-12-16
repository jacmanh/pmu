import { FastifyInstance } from 'fastify';
import { getRaceById, getRacesForDate } from '../services/raceServices';
import { Participant, Race } from '@pmu/shared';
import { scrapeParticipants } from '@pmu/scraper';
import { upsertDrivers } from '../services/driverService';
import { upsertTrainers } from '../services/trainerService';
import { upsertOwners } from '../services/ownerService';
import { HorseUpsert, upsertHorses } from '../services/horseService';
import {
  getParticipantsByRaceId,
  ParticipantUpsert,
  upsertParticipants,
} from '../services/participantsServices';
import { scrapeHorseHistory } from '../../../../../libs/scraper/src/lib/horseHistory';
import {
  HorseHistoryUpsert,
  upsertHorseHistory,
} from '../services/horseHistory';
import { getRaceTrackByName } from '../services/raceTrackServices';
import { parse } from 'date-fns';

async function routes(fastify: FastifyInstance) {
  type GetRacesQuery = {
    date: string;
  };

  fastify.get<{ Params: { id: string } }>(
    '/race/:id',
    async function (request) {
      const racesCollection = this.mongo.db.collection<Race>('races');
      const { id } = request.params;
      return await getRaceById(racesCollection, id);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    '/race:/:id/participants',
    async function (request) {
      const participantsCollection =
        this.mongo.db.collection<Participant>('participants');
      const { id } = request.params;
      return await getParticipantsByRaceId(participantsCollection, id);
    }
  );

  fastify.post<{ Params: { id: string } }>(
    '/race/:id/participants',
    async function (request) {
      const racesCollection = this.mongo.db.collection<Race>('races');
      const { id } = request.params;
      const race = await getRaceById(racesCollection, id);
      const participantsDatas = await scrapeParticipants(race);

      if (!participantsDatas || participantsDatas.length === 0) {
        return { error: 'No participants' };
      }

      // 1. Upsert drivers
      const drivers = participantsDatas.map(
        (participant) => participant.driver
      );
      const driverIds = await upsertDrivers(
        this.mongo.db.collection('drivers'),
        drivers
      );

      // 2. Upsert trainers
      const trainers = participantsDatas.map(
        (participant) => participant.trainer
      );
      const trainerIds = await upsertTrainers(
        this.mongo.db.collection('trainers'),
        trainers
      );

      // 3. Upsert owners
      const owners = participantsDatas.map((participant) => participant.owner);
      const ownerIds = await upsertOwners(
        this.mongo.db.collection('owners'),
        owners
      );

      // 4. Upsert horses
      const bulkHorseOps: HorseUpsert[] = participantsDatas.map(
        (participant, index) => ({
          ...participant.horse,
          driverId: driverIds[participant.driver.name],
          trainerId: trainerIds[participant.trainer.name],
          ownerId: ownerIds[participant.owner.name],
        })
      );
      const horseIds = await upsertHorses(
        this.mongo.db.collection('horses'),
        bulkHorseOps
      );

      // 5. Upsert horses history
      const bulkHorseHistoryOps: HorseHistoryUpsert[] = [];
      for (const participant of participantsDatas) {
        const horseId = horseIds[participant.horse.name];
        const histories = await scrapeHorseHistory({
          name: participant.horse.name,
          zt: participant.horse.zt,
        });
        histories.forEach((history) => {
          bulkHorseHistoryOps.push({
            horseId,
            place: parseInt(history.place, 10),
            rope: parseInt(history.rope, 10),
            weight: parseInt(history.weight, 10),
            date: parse(history.date, 'dd/MM/yyyy', new Date()),
            driverId: driverIds[participant.driver.name],
            race: history.race,
          });
        });
      }
      await upsertHorseHistory(
        this.mongo.db.collection('horseHistory'),
        bulkHorseHistoryOps
      );

      // 6. Upsert participants
      const bulkParticipantsOps: ParticipantUpsert[] = participantsDatas.map(
        (participant) => ({
          number: participant.number,
          raceId: race._id,
          horseId: horseIds[participant.horse.name],
        })
      );

      await upsertParticipants(
        this.mongo.db.collection('participants'),
        bulkParticipantsOps
      );

      return { success: true };
    }
  );

  fastify.get<{ Params: GetRacesQuery }>(
    '/races/:date',
    async function (request) {
      const racesCollection = this.mongo.db.collection<Race>('races');
      const { date } = request.params;
      return await getRacesForDate(racesCollection, new Date(date));
    }
  );
}

export default routes;
