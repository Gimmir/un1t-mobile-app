import { queryClient } from '@/src/lib/query-client';
import { useMutate } from '@/src/hooks/useFetch';
import { profileApi } from '../api/profile.api';
import { UpdateProfileRequest, User } from '@/src/types/api';
import { AxiosError } from 'axios';

type UpdateProfileVariables = {
  userId: string;
  data: UpdateProfileRequest;
};

export function useUpdateProfile() {
  return useMutate<User, AxiosError, UpdateProfileVariables>(
    ({ userId, data }) => profileApi.updateProfile(userId, data),
    {
      onSuccess: (updatedUser) => {
        if (updatedUser) {
          queryClient.setQueryData(['user', 'me'], updatedUser);
        }
      },
    }
  );
}
