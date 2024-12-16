import { useParams } from 'react-router-dom';
import {
  useFetchRaceParticipants,
  useGetRaceById,
  useGetRaceParticipants,
} from '../api/races.api';
import { DataTable } from '../components/molecules/DataTable/DataTable';
import { MainLayout } from '../components/layouts/MainLayout';
import { Icon } from '../components/atoms/Icon/Icon';
import classNames from 'classnames';
import { Card } from '../components/atoms/Card/Card';
import { formatDate } from 'date-fns/format';

export const Race = () => {
  const { id } = useParams<{ id: string }>();
  const { data: race, isLoading } = useGetRaceById(id, { enabled: !!id });

  const { data: participants, isLoading: isLoadingParticipants } =
    useGetRaceParticipants(id);
  const { mutate: fetchParticipants, isLoading: isFetchingParticipants } =
    useFetchRaceParticipants(id);

  const handleFetchParticipants = () => {
    fetchParticipants();
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!race) {
    return <p>Not found</p>;
  }

  return (
    <MainLayout>
      <div className="flex m-4">
        <div>
          <h2 className="text-xl font-bold">{race.name}</h2>
          {race.distance}m - {race.surfaceType} - {race.type}
          <div className="text-cyan-600">
            Départ le {formatDate(race.date, 'dd/MM/yyyy à HH:mm')}
          </div>
        </div>
        <div className="ml-auto justify-end p-4">
          <button
            onClick={handleFetchParticipants}
            disabled={isLoadingParticipants}
            className="float-right border bg-blue-500 rounded my-4 p-2"
          >
            <Icon
              name="spin"
              className={classNames('text-blue-300 stroke-white', {
                'animate-spin': isFetchingParticipants,
              })}
            />
          </button>
        </div>
      </div>

      {isLoadingParticipants && <p>Loading participants...</p>}
      {!isLoadingParticipants && !participants && (
        <div className="font-bold text-center">No participants</div>
      )}

      <Card className="mx-4">
        {participants && (
          <DataTable
            race={race}
            data={participants}
            isLoading={isLoadingParticipants || isFetchingParticipants}
          />
        )}
      </Card>
    </MainLayout>
  );
};
