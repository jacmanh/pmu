import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from 'react-query';
import axios from 'axios';
import { format } from 'date-fns/format';
import { Participant, Race } from '@pmu/shared';

export const useGetRaceById = (id?: string, options?: UseQueryOptions<Race>) =>
  useQuery<Race>({
    queryKey: ['race', id],
    queryFn: async () => axios.get(`/api/race/${id}`).then((res) => res.data),
    ...options,
  });

export const useGetRaceParticipants = (id?: string) =>
  useQuery<Participant[]>({
    queryKey: ['participants', id],
    queryFn: async () =>
      axios.get(`/api/race/${id}/participants`).then((res) => res.data),
  });

export const useFetchRaceParticipants = (id?: string) => {
  const queryClient = useQueryClient();
  return useMutation<Race>({
    mutationFn: async () =>
      axios.post(`/api/race/${id}/participants`).then((res) => res.data),
    onSuccess: async () => {
      await queryClient.invalidateQueries(['participants', id]);
    },
  });
};

export const getRacesForDate = (date: Date) =>
  useQuery<Race[]>(['races', date], async () =>
    axios
      .get('/api/races/' + format(date, 'yyyy-MM-dd'))
      .then((res) => res.data)
  );
