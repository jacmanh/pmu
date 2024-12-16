import { ObjectId } from '@fastify/mongodb';

export type Driver = {
  _id: ObjectId;
  name: string;
  totalRaces: number;
  totalWins: number;
  winRate: number;
  totalPlaces: number;
  placeRate: number;
  zt: {
    id: number;
    link: string;
    name: string;
  };
};
