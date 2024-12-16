import { ObjectId } from '@fastify/mongodb';

export type Trainer = {
  _id: ObjectId;
  name: string;
  zt: {
    id: number;
    link: string;
    name: string;
  };
};
