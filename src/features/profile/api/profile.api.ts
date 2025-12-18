import { api } from '@/src/lib/axios';
import { UpdateProfileRequest, User } from '@/src/types/api';

/**
 * Profile/User API endpoints
 */
export const profileApi = {
  /**
   * Get current user profile
   */
  getProfile: () => 
    api.get<User>('/profile'),

  /**
   * Update user profile by ID
   */
  updateProfile: async (userId: string, data: UpdateProfileRequest) => {
    const response = await api.put<{ data?: User } | User>(`/users/${userId}`, data);
    if (response && typeof response === 'object' && 'data' in response) {
      const payload = (response as { data?: User }).data;
      if (payload) {
        return payload;
      }
    }
    return response as User;
  },

  /**
   * Upload avatar image
   */
  uploadAvatar: (formData: FormData) => 
    api.post<{ avatarUrl: string }>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};
