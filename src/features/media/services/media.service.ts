import { mediaRepository, CloudinaryUploadResult } from '../repositories/media.repository';
import { MediaError } from '@/utils/error.utils';
import {
  MAX_VIDEO_DURATION_SECONDS,
} from '@/utils/validation.utils';
import { UploadProgress } from '@/types';

export const mediaService = {
  /**
   * Upload an image file.
   * File-existence validation removed — expo-file-system/legacy getInfoAsync
   * was hanging silently on iOS in Expo Go (SDK 54).
   */
  async uploadImage(
    localUri: string,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<CloudinaryUploadResult> {
    console.log('[MediaService] uploadImage called, uri:', localUri);
    if (!localUri) {
      throw new MediaError('FILE_NOT_FOUND', 'Could not find the selected image. Please try again.');
    }
    return mediaRepository.upload(localUri, 'image', onProgress);
  },

  /**
   * Validate and upload a video file.
   * @param durationSeconds - The video duration reported by the camera/picker
   */
  async uploadVideo(
    localUri: string,
    durationSeconds: number,
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<CloudinaryUploadResult> {
    console.log('[MediaService] uploadVideo called, uri:', localUri, 'duration:', durationSeconds);
    if (!localUri) {
      throw new MediaError('FILE_NOT_FOUND', 'Could not find the recorded video. Please try again.');
    }
    if (durationSeconds > MAX_VIDEO_DURATION_SECONDS) {
      throw new MediaError(
        'VIDEO_TOO_LONG',
        `Video must be ${MAX_VIDEO_DURATION_SECONDS} seconds or shorter.`,
      );
    }

    return mediaRepository.upload(localUri, 'video', onProgress);
  },
};

