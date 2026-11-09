import { apiClient } from './api.client.ts';
import type { UploadedMediaDto } from '../types/media.types.ts';

export interface UploadedImage {
  publicId: string;
  url: string;
}

export const mediaService = {
  async uploadImage(file: File, folder = 'accommodations'): Promise<UploadedImage> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const uploaded = await apiClient.postMultipart<UploadedMediaDto>('/media/upload', formData);
    return {
      publicId: uploaded.publicId,
      url: uploaded.url,
    };
  },
};
