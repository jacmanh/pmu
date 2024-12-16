import { useMutation, useQuery } from 'react-query';
import axios from 'axios';

export const useGetPmu = () =>
  useQuery('pmu', async () =>
    axios.get('/api/pmu/program').then((res) => res.data)
  );

export const useFetchProgram = () =>
  useMutation(async (date: Date) => {
    await axios.post('/api/pmu/fetchProgram', { date });
  });
