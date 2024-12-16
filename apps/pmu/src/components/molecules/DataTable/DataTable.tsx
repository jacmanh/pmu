import { Participant, Race } from '@pmu/shared';
import classNames from 'classnames';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { evaluatePerformanceOnDistance } from './DataTable.utils';

type DataTableProps = {
  data: Participant[];
  race: Race;
  isLoading: boolean;
};

export const DataTable = ({ data, race, isLoading }: DataTableProps) => {
  return (
    <table
      className={classNames(
        'bg-white w-full border-collapse border border-slate-400',
        {
          'animate-pulse': isLoading,
        }
      )}
    >
      <thead>
        <tr className="bg-gray-50 border">
          <th className="w-12 p-2">N</th>
          <th>Horse</th>
          <th className="w-24">Sexe / Age</th>
          <th>Driver - Trainer</th>
          <th>Coeff. Distance</th>
        </tr>
      </thead>
      <tbody>
        {data.map((participant) => (
          <tr className="border">
            <td className="p-2 text-center">{participant.number}</td>
            <td className="p-2">
              <div className="flex gap-2 items-center">
                <b>{participant.horse.name}</b>
                <a
                  className="text-cyan-600"
                  href={`https://zone-turf.fr${participant.horse.zt.link}`}
                  target="_blank"
                >
                  <FaExternalLinkAlt size="12" />
                </a>
              </div>
              <div className="text-sm text-cyan-700">
                {participant.horse.performance}
              </div>
            </td>
            <td className="p-2 text-center text-sm">
              {participant.horse.sexe}
              {participant.horse.age}
            </td>
            <td className="p-2">
              <div className="flex gap-2 items-center">
                {participant.driver.name}
                <a
                  className="text-cyan-600"
                  href={`https://zone-turf.fr${participant.driver.zt.link}`}
                  target="_blank"
                >
                  <FaExternalLinkAlt size="12" />
                </a>
              </div>
              <div className="flex gap-2 items-center text-sm text-gray-400">
                {participant.trainer.name}
                <a
                  className="text-cyan-600"
                  href={`https://zone-turf.fr${participant.trainer.zt.link}`}
                  target="_blank"
                >
                  <FaExternalLinkAlt size="12" />
                </a>
              </div>
            </td>
            <td>
              {participant.horse.history
                ? evaluatePerformanceOnDistance(
                    participant.horse.history,
                    race.distance
                  )
                : '/'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
