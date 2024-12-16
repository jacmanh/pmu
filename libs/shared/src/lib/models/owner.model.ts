import { ObjectId } from '@fastify/mongodb';

export type Owner = {
  _id: ObjectId;
  name: string;
  zt: {
    id: number;
    link: string;
    name: string;
  };
};
