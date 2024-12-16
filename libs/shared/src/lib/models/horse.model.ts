import { ObjectId } from '@fastify/mongodb';
import { Owner } from './owner.model';
import { Driver } from './driver.model';
import { Trainer } from './trainer.model';
import { HorseHistory } from './horseHistory.model';

export type Horse = {
  _id: ObjectId;
  name: string;
  age: number;
  sexe: 'M' | 'F';
  performance: string;
  // History
  history: HorseHistory[];
  // Owner
  ownerId: ObjectId;
  owner: Owner;
  // Driver
  driverId: ObjectId;
  driver: Driver;
  // Trainer
  trainerId: ObjectId;
  trainer: Trainer;
  zt: {
    id: number;
    link: string;
    name: string;
  };
};
