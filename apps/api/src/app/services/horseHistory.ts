import { ObjectId } from '@fastify/mongodb';
import { Collection } from 'mongodb';
import { HorseHistory } from '@pmu/shared';

export type HorseHistoryUpsert = {
  horseId: ObjectId;
  race: {
    name: string;
    distance: number;
  };
  place: number;
  rope: number;
  weight: number;
  driverId: ObjectId;
  date: Date;
};

export const upsertHorseHistory = async (
  collection: Collection<HorseHistory>,
  horseHistory: HorseHistoryUpsert[]
) => {
  const bulkOps = horseHistory.map((history) => ({
    updateOne: {
      filter: {
        horseId: history.horseId,
        date: history.date,
        'race.name': history.race.name,
      },
      update: {
        $set: history,
      },
      upsert: true,
    },
  }));
  await collection.bulkWrite(bulkOps);
};
