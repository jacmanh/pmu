import { ObjectId } from '@fastify/mongodb';
import { Horse } from '@pmu/shared';

export type HorseHistory = {
  horse: Horse;
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
