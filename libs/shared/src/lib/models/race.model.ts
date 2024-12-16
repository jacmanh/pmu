import { ObjectId } from '@fastify/mongodb';
import { Meeting } from './meeting.model';

export type Race = {
  _id: ObjectId;
  number: number;
  meetingId: ObjectId;
  meeting: Meeting;
  name: string;
  shortName: string;
  date: Date;
  distance: number;
  nbParticipants?: number;
  surfaceType?: SurfaceType;
  type?: Discipline;
  result?: RaceResult | null;
};

export type RaceResult = {
  order: number[];
};

export enum SurfaceType {
  HERBE = 'GRASS',
  GAZON = 'GRASS',
  SABLE = 'SAND',
  FIBRE = 'FIBER',
  PSF = 'PSF',
}

export enum RaceType {
  TROT_ATTELE = 'TROT_ATTELE',
  TROT_MONTE = 'TROT_MONTE',
  PLAT = 'PLAT',
  OBSTACLE = 'OBSTACLE',
}

export enum Discipline {
  Attele = 'ATTELE',
  Monte = 'MONTE',
  Plat = 'PLAT',
  Obstacle = 'OBSTACLE',
}
