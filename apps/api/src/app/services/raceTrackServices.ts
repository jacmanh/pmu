import { RaceTrack, ReunionHippodrome } from '@pmu/shared';
import { Collection } from 'mongodb';
import { ObjectId } from '@fastify/mongodb';

export const getRaceTrackByName = async (
  collection: Collection,
  name: string
) => {
  return await collection.findOne({ name });
};

export const upsertRaceTracks = async (
  collection: Collection,
  raceTracks: RaceTrack[]
) => {
  const bulkOps = raceTracks.map((track) => ({
    updateOne: {
      filter: { code: track.code },
      update: { $set: track },
      upsert: true,
    },
  }));
  const results = await collection.bulkWrite(bulkOps);

  // Map the upsertedIds to the meeting numbers
  const upsertedIds: { [key: number]: ObjectId } = {};

  for (const [index, raceTrack] of raceTracks.entries()) {
    if (results.upsertedIds[index] !== undefined) {
      upsertedIds[raceTrack.code] = results.upsertedIds[index];
    } else {
      // If it's an update, fetch the existing _id
      const existingRaceTrack = await collection.findOne({
        code: raceTrack.code,
      });
      if (existingRaceTrack) {
        upsertedIds[raceTrack.code] = existingRaceTrack._id;
      }
    }
  }

  return upsertedIds;
};

export const mapPmuRaceTrack = (raceTrack: ReunionHippodrome): RaceTrack => {
  return {
    code: raceTrack.code,
    name: raceTrack.libelleCourt,
    longName: raceTrack.libelleLong,
  };
};
