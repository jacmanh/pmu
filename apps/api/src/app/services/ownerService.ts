import { Owner } from '@pmu/shared';
import { Collection } from 'mongodb';
import { ObjectId } from '@fastify/mongodb';

export const upsertOwners = async (
  collection: Collection<Owner>,
  owners: Omit<Owner, '_id'>[]
) => {
  const bulkOps = owners.map((owner) => ({
    updateOne: {
      filter: { name: owner.name },
      update: {
        $set: owner,
      },
      upsert: true,
    },
  }));
  const results = await collection.bulkWrite(bulkOps);

  // Map the upsertedIds to the owner names
  const upsertedIds: { [key: string]: ObjectId } = {};

  for (const [index, owner] of owners.entries()) {
    if (results.upsertedIds[index] !== undefined) {
      upsertedIds[owner.name] = results.upsertedIds[index];
    } else {
      // If it's an update, fetch the existing _id
      const existingOwner = await collection.findOne({
        name: owner.name,
      });
      if (existingOwner) {
        upsertedIds[owner.name] = existingOwner._id;
      }
    }
  }

  return upsertedIds;
};
