import { useFetchProgram } from '../api/pmu.api';
import { useEffect, useState } from 'react';
import { getRacesForDate } from '../api/races.api';
import { useGetMeetingsForDate } from '../api/meetings.api';
import { Link } from 'react-router-dom';
import { MainLayout } from '../components/layouts/MainLayout';
import { Button } from '../components/atoms/Button/Button';
import { addDays, isEqual, startOfDay, subDays } from 'date-fns';
import { Icon } from '../components/atoms/Icon/Icon';
import classNames from 'classnames';
import { Tab } from '../components/molecules/Tab/Tab';
import { Card } from '../components/atoms/Card/Card';

export const Home = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date())
  );
  const [selectedMeeting, setSelectedMeeting] = useState<number | null>(null);

  const { data: meetings, isLoading: isLoadingMeetings } =
    useGetMeetingsForDate(selectedDate);
  const { data: races, isLoading: isLoadingRaces } =
    getRacesForDate(selectedDate);

  const { mutate: fetchProgram, isLoading: isLoadingProgram } =
    useFetchProgram();

  const [yesterdayDate, todayDate, tomorrowDate] = [
    startOfDay(subDays(new Date(), 1)),
    startOfDay(new Date()),
    startOfDay(addDays(new Date(), 1)),
  ];

  const handleFetchProgram = () => {
    fetchProgram(selectedDate);
  };

  useEffect(() => {
    if (meetings && meetings.length > 0) {
      setSelectedMeeting(meetings[0].number);
    }
  }, [meetings]);

  return (
    <MainLayout>
      <div className="bg-blue-950 text-white p-4">
        <Tab
          items={[
            {
              label: 'Yesterday',
              active: isEqual(selectedDate, yesterdayDate),
              onClick: () => setSelectedDate(yesterdayDate),
            },
            {
              label: 'Today',
              active: isEqual(selectedDate, todayDate),
              onClick: () => setSelectedDate(todayDate),
            },
            {
              label: 'Tomorrow',
              active: isEqual(selectedDate, tomorrowDate),
              onClick: () => setSelectedDate(tomorrowDate),
            },
          ]}
        />
      </div>

      <div className="flex justify-end p-4">
        <Button
          secondary
          onClick={handleFetchProgram}
          disabled={isLoadingProgram}
        >
          <Icon
            name="spin"
            className={classNames('text-blue-300 stroke-white', {
              'animate-spin': isLoadingProgram,
            })}
          />
        </Button>
      </div>

      <Card className="mx-4">
        {isLoadingMeetings ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-flow-col auto-cols-fr space-x-2">
            {meetings?.map((meeting) => (
              <a
                onClick={() => setSelectedMeeting(meeting.number)}
                className={classNames(
                  'flex rounded-md border p-2 cursor-pointer space-x-2 items-center',
                  {
                    'bg-gray-200': selectedMeeting === meeting.number,
                  }
                )}
              >
                <span className="block rounded-md bg-emerald-500 text-white p-2">
                  R{meeting.number}
                </span>
                <span className="text-sm">{meeting.raceTrack.name}</span>
              </a>
            ))}
          </div>
        )}
      </Card>

      <Card className="m-4">
        {isLoadingRaces ? (
          <p>Loading...</p>
        ) : (
          <ul className="rounded-md border border-gray-100">
            {races
              ?.filter((race) => race.meeting.number === selectedMeeting)
              .map((race, index) => (
                <li
                  key={race._id.toString()}
                  className={classNames(
                    'border-gray-300 hover:bg-emerald-500 transition-colors',
                    {
                      'bg-gray-100': index % 2 === 0,
                    }
                  )}
                >
                  <Link
                    to={`race/${race._id}`}
                    className="flex space-x-2 items-center p-2"
                  >
                    <span className="block rounded-md bg-gray-300 p-2">
                      C{race.number}
                    </span>
                    <span>{race.name}</span>
                  </Link>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </MainLayout>
  );
};
