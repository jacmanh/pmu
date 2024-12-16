import { Meeting, Reunion } from '@pmu/shared';
import { Collection } from 'mongodb';
import { ObjectId } from '@fastify/mongodb';
import { endOfDay, startOfDay } from 'date-fns';

export const getMeetingsForDate = async (
  collection: Collection<Meeting>,
  date: Date
): Promise<Meeting[]> => {
  return await collection
    .aggregate<Meeting>([
      {
        $match: {
          date: {
            $gte: startOfDay(date),
            $lte: endOfDay(date),
          },
        },
      },
      {
        $lookup: {
          from: 'raceTracks',
          localField: 'raceTrack',
          foreignField: '_id',
          as: 'raceTrack',
        },
      },
      {
        $unwind: '$raceTrack',
      },
    ])
    .toArray();
};

export const upsertMeetings = async (
  collection: Collection<Meeting>,
  meetings: Omit<Meeting, 'raceTrack'>[]
) => {
  const bulkOps = meetings.map((meeting) => ({
    updateOne: {
      filter: { number: meeting.number, date: meeting.date },
      update: { $set: meeting },
      upsert: true,
    },
  }));

  const results = await collection.bulkWrite(bulkOps);

  // Map the upsertedIds to the meeting numbers
  const upsertedIds: { [key: number]: ObjectId } = {};

  for (const [index, meeting] of meetings.entries()) {
    if (results.upsertedIds[index] !== undefined) {
      upsertedIds[meeting.number] = results.upsertedIds[index];
    } else {
      // If it's an update, fetch the existing _id
      const existingMeeting = await collection.findOne({
        number: meeting.number,
        date: meeting.date,
      });
      if (existingMeeting) {
        upsertedIds[meeting.number] = existingMeeting._id;
      }
    }
  }

  return upsertedIds;
};

export const mapPmuMeeting = (meeting: Reunion): Omit<Meeting, 'raceTrack'> => {
  return {
    number: meeting.numExterne,
    date: new Date(meeting.dateReunion),
  };
};
