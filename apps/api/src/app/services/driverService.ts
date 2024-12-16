import { Collection } from 'mongodb';
import { Driver } from '@pmu/shared';
import { ObjectId } from '@fastify/mongodb';

export const upsertDrivers = async (
  collection: Collection<Driver>,
  drivers: Omit<Driver, '_id'>[]
) => {
  const bulkOps = drivers.map((driver) => ({
    updateOne: {
      filter: { name: driver.name },
      update: {
        $set: driver,
      },
      upsert: true,
    },
  }));
  const results = await collection.bulkWrite(bulkOps);

  // Map the upsertedIds to the driver names
  const upsertedIds: { [key: string]: ObjectId } = {};

  for (const [index, driver] of drivers.entries()) {
    if (results.upsertedIds[index] !== undefined) {
      upsertedIds[driver.name] = results.upsertedIds[index];
    } else {
      // If it's an update, fetch the existing _id
      const existingDriver = await collection.findOne({
        name: driver.name,
      });
      if (existingDriver) {
        upsertedIds[driver.name] = existingDriver._id;
      }
    }
  }

  return upsertedIds;
};
