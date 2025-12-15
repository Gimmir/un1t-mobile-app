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
   * Update user profile
   */
  updateProfile: (data: UpdateProfileRequest) => 
    api.patch<User>('/profile', data),

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
