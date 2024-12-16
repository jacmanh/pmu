import { FastifyInstance } from 'fastify';
import { Meeting, Race } from '@pmu/shared';
import { getMeetingsForDate } from '../services/meetingServices';

async function routes(fastify: FastifyInstance) {
  type GetRacesQuery = {
    date: string;
  };

  fastify.get<{ Params: GetRacesQuery }>(
    '/meetings/:date',
    async function (request) {
      const meetingsCollection = this.mongo.db.collection<Meeting>('meetings');
      const { date } = request.params;
      return await getMeetingsForDate(meetingsCollection, new Date(date));
    }
  );
}

export default routes;
