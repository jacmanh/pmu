import { FastifyInstance } from 'fastify';
import { scrapePrograms } from '@pmu/scraper';
import {
  mapPmuRaceTrack,
  upsertRaceTracks,
} from '../services/raceTrackServices';
import { mapPmuRace, upsertRaces } from '../services/raceServices';
import { mapPmuMeeting, upsertMeetings } from '../services/meetingServices';

async function routes(fastify: FastifyInstance) {
  type GetProgramsQuery = {
    date: string;
  };

  fastify.post<{ Body: GetProgramsQuery }>(
    '/pmu/fetchProgram',
    async function (request, reply) {
      try {
        const { date } = request.body;
        const program = await scrapePrograms(new Date(date));
        const { reunions } = program.programme;

        // 1. Upsert race tracks and get track IDs
        const raceTrackIds = await processRaceTracks(
          reunions,
          this.mongo.db.collection('raceTracks')
        );

        // 2. Upsert meetings and get meeting IDs
        const meetingIds = await processMeetings(
          reunions,
          raceTrackIds,
          this.mongo.db.collection('meetings')
        );

        // 3. Upsert races linked to their meetings
        await processRaces(
          reunions,
          meetingIds,
          this.mongo.db.collection('races')
        );

        reply.send(program);
      } catch (err) {
        reply.code(500).send({ error: 'Error processing program data' });
      }
    }
  );
}

// Process and upsert race tracks
async function processRaceTracks(reunions: any[], raceTracksCollection: any) {
  const raceTracks = reunions.map((reunion) =>
    mapPmuRaceTrack(reunion.hippodrome)
  );
  return await upsertRaceTracks(raceTracksCollection, raceTracks);
}

// Process and upsert meetings, linking race tracks
async function processMeetings(
  reunions: any[],
  raceTrackIds: { [key: string]: any },
  meetingsCollection: any
) {
  const meetings = reunions.map((reunion) => {
    const meeting = mapPmuMeeting(reunion);
    const raceTrackId = raceTrackIds[reunion.hippodrome.code]; // Link raceTrack
    return { ...meeting, raceTrack: raceTrackId };
  });
  return await upsertMeetings(meetingsCollection, meetings);
}

// Process and upsert races, linking meetings
async function processRaces(
  reunions: any[],
  meetingIds: { [key: string]: any },
  racesCollection: any
) {
  const bulkRaceOps = reunions.flatMap((reunion) => {
    const meetingId = meetingIds[reunion.numExterne]; // Get meetingId
    return reunion.courses.map(
      (course) => mapPmuRace(course, meetingId) // Include meeting reference
    );
  });
  await upsertRaces(racesCollection, bulkRaceOps);
}

export default routes;
