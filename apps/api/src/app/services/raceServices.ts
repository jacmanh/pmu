import { Collection } from 'mongodb';
import { CourseElement, Race } from '@pmu/shared';
import { endOfDay, startOfDay } from 'date-fns';
import { ObjectId } from '@fastify/mongodb';

export const getRaceById = async (
  collection: Collection<Race>,
  id: string
): Promise<Race | null> => {
  const matchCondition = { _id: new ObjectId(id) };

  const result = await aggregateRaces(collection, matchCondition);

  return result.length > 0 ? result[0] : null;
};

export const getRacesForDate = async (
  collection: Collection<Race>,
  date: Date
): Promise<Race[]> => {
  const matchCondition = {
    date: {
      $gte: startOfDay(date),
      $lte: endOfDay(date),
    },
  };

  return await aggregateRaces(collection, matchCondition);
};

export const upsertRaces = async (
  collection: Collection<Race>,
  races: Omit<Race, 'meeting'>[]
) => {
  const bulkOps = races.map((race) => ({
    updateOne: {
      filter: { date: race.date },
      update: {
        $set: {
          ...race,
          meetingId: race.meetingId,
        },
      },
      upsert: true,
    },
  }));
  await collection.bulkWrite(bulkOps);
};

export const mapPmuRace = (
  race: CourseElement,
  meetingId: ObjectId
): Omit<Race, '_id' | 'meeting'> => {
  return {
    number: race.numOrdre,
    meetingId: meetingId,
    name: race.libelle,
    shortName: race.libelleCourt,
    date: new Date(race.heureDepart),
    distance: race.distance,
    nbParticipants: race.nombreDeclaresPartants,
    surfaceType: race.typePiste,
    type: race.specialite,
  };
};

async function aggregateRaces(
  collection: Collection<Race>,
  matchCondition: object
): Promise<Race[]> {
  return await collection
    .aggregate<Race>([
      {
        $match: matchCondition, // Pass dynamic conditions like { _id: ... } or { date: ... }
      },
      {
        $lookup: {
          from: 'meetings',
          localField: 'meetingId',
          foreignField: '_id',
          as: 'meeting',
        },
      },
      {
        $unwind: '$meeting', // Flatten the meeting array
      },
      {
        $lookup: {
          from: 'raceTracks',
          localField: 'meeting.raceTrack',
          foreignField: '_id',
          as: 'meeting.raceTrack',
        },
      },
      {
        $unwind: '$meeting.raceTrack', // Flatten the raceTrack array
      },
      {
        $project: {
          'meeting.raceTrack._id': 0, // Optionally exclude _id from raceTrack
        },
      },
    ])
    .toArray();
}
