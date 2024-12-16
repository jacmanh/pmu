import { Trainer } from '@pmu/shared';
import { Collection } from 'mongodb';
import { ObjectId } from '@fastify/mongodb';

export const upsertTrainers = async (
  collection: Collection<Trainer>,
  trainers: Omit<Trainer, '_id'>[]
) => {
  const bulkOps = trainers.map((trainer) => ({
    updateOne: {
      filter: { name: trainer.name },
      update: {
        $set: {
          ...trainer,
        },
      },
      upsert: true,
    },
  }));
  const results = await collection.bulkWrite(bulkOps);

  // Map the upsertedIds to the trainer names
  const upsertedIds: { [key: string]: ObjectId } = {};

  for (const [index, trainer] of trainers.entries()) {
    if (results.upsertedIds[index] !== undefined) {
      upsertedIds[trainer.name] = results.upsertedIds[index];
    } else {
      // If it's an update, fetch the existing _id
      const existingTrainer = await collection.findOne({
        name: trainer.name,
      });
      if (existingTrainer) {
        upsertedIds[trainer.name] = existingTrainer._id;
      }
    }
  }

  return upsertedIds;
};
