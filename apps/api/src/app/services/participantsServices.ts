import { Participant } from '@pmu/shared';
import { Collection } from 'mongodb';
import { ObjectId } from '@fastify/mongodb';

export const getParticipantsByRaceId = async (
  collection: Collection<Participant>,
  raceId: string
): Promise<Participant[] | null> => {
  const matchCondition = { raceId: new ObjectId(raceId) };
  const result = await aggregateParticipants(collection, matchCondition);
  return result.length > 0 ? result : null;
};

export type ParticipantUpsert = Omit<
  Participant,
  '_id' | 'horse' | 'driver' | 'owner' | 'trainer'
>;
export const upsertParticipants = async (
  collection: Collection<Participant>,
  participants: ParticipantUpsert[]
) => {
  const bulkOps = participants.map((participant) => ({
    updateOne: {
      filter: { raceId: participant.raceId, horseId: participant.horseId },
      update: {
        $set: participant,
      },
      upsert: true,
    },
  }));

  await collection.bulkWrite(bulkOps);
};

async function aggregateParticipants(
  collection: Collection<Participant>,
  matchCondition: object
): Promise<Participant[]> {
  return await collection
    .aggregate<Participant>([
      {
        $match: matchCondition,
      },
      {
        $lookup: {
          from: 'horses',
          localField: 'horseId',
          foreignField: '_id',
          as: 'horse',
        },
      },
      {
        $unwind: '$horse',
      },
      {
        $lookup: {
          from: 'horseHistory',
          localField: 'horseId',
          foreignField: 'horseId',
          as: 'horse.history',
        },
      },
      {
        $lookup: {
          from: 'drivers',
          localField: 'horse.driverId',
          foreignField: '_id',
          as: 'driver',
        },
      },
      {
        $unwind: '$driver',
      },
      {
        $lookup: {
          from: 'trainers',
          localField: 'horse.trainerId',
          foreignField: '_id',
          as: 'trainer',
        },
      },
      {
        $unwind: '$trainer',
      },
      {
        $lookup: {
          from: 'owners',
          localField: 'horse.ownerId',
          foreignField: '_id',
          as: 'owner',
        },
      },
      {
        $unwind: '$owner',
      },
      {
        $sort: {
          number: 1,
        },
      },
      {
        $addFields: {
          'horse.history': {
            $sortArray: {
              input: '$horse.history',
              sortBy: { date: -1 },
            },
          },
        },
      },
    ])
    .toArray();
}
