import { Horse } from '@pmu/shared';
import { Collection } from 'mongodb';
import { ObjectId } from '@fastify/mongodb';

export type HorseUpsert = Omit<
  Horse,
  '_id' | 'driver' | 'owner' | 'trainer' | 'history'
>;

export const upsertHorses = async (
  collection: Collection<Horse>,
  horses: HorseUpsert[]
) => {
  const bulkOps = horses.map((horse) => ({
    updateOne: {
      filter: { name: horse.name },
      update: {
        $set: {
          ...horse,
        },
      },
      upsert: true,
    },
  }));

  const results = await collection.bulkWrite(bulkOps);

  // Map the upsertedIds to the horse names
  const upsertedIds: { [key: string]: ObjectId } = {};

  for (const [index, horse] of horses.entries()) {
    if (results.upsertedIds[index] !== undefined) {
      upsertedIds[horse.name] = results.upsertedIds[index];
    } else {
      // If it's an update, fetch the existing _id
      const existingHorse = await collection.findOne({
        name: horse.name,
      });
      if (existingHorse) {
        upsertedIds[horse.name] = existingHorse._id;
      }
    }
  }

  return upsertedIds;
};
