import { format } from 'date-fns/format';
import { Meeting } from '@pmu/shared';
import { useQuery } from 'react-query';
import axios from 'axios';

export const useGetMeetingsForDate = (date: Date) =>
  useQuery<Meeting[]>(['meetings', date], async () =>
    axios
      .get('/api/meetings/' + format(date, 'yyyy-MM-dd'))
      .then((res) => res.data)
  );
