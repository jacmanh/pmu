import { ObjectId } from '@fastify/mongodb';
import { Driver, Horse, Owner, Trainer } from '@pmu/shared';

export type Participant = {
  _id: ObjectId;
  raceId: ObjectId;
  number: number;
  horseId: ObjectId;
  horse: Horse;
  driver: Driver;
  trainer: Trainer;
  owner: Owner;
};
