/**
 * MediaRepository — handles all uploads to Cloudinary.
 *
 * Uses the unsigned upload preset (configured in Cloudinary dashboard).
 * Only this file is allowed to call the Cloudinary API directly.
 *
 * Cloudinary unsigned upload docs:
 * https://cloudinary.com/documentation/upload_images#unsigned_upload
 */

import { UploadProgress } from '@/types';

const CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME ?? '';
const UPLOAD_PRESET = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? '';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;

export interface CloudinaryUploadResult {
  publicId: string;
  secureUrl: string;
  resourceType: 'image' | 'video';
  thumbnailUrl?: string;
  duration?: number;
}

export const mediaRepository = {
  /**
   * Upload a local file URI to Cloudinary.
   * Works for both images and videos.
   *
   * @param localUri - The local file URI from expo-camera or expo-image-picker
   * @param resourceType - 'image' or 'video'
   * @param onProgress - Optional progress callback (best-effort on RN)
   */
  async upload(
    localUri: string,
    resourceType: 'image' | 'video',
    onProgress?: (progress: UploadProgress) => void,
  ): Promise<CloudinaryUploadResult> {
    console.log('[MediaRepo] Starting upload:', { localUri, resourceType, CLOUD_NAME, UPLOAD_PRESET, UPLOAD_URL });

    const fileName = localUri.split('/').pop() ?? 'upload';
    const mimeType = resourceType === 'image' ? 'image/jpeg' : 'video/mp4';

    const formData = new FormData();
    formData.append('file', {
      uri: localUri,
      type: mimeType,
      name: fileName,
    } as unknown as Blob);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('resource_type', resourceType);

    console.log('[MediaRepo] FormData built, fetching to Cloudinary...');

    // Signal start as 0%
    onProgress?.({ loaded: 0, total: 1, percentage: 0 });

    const response = await fetch(UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    console.log('[MediaRepo] Response received, status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error('[MediaRepo] Upload HTTP error:', response.status, errText);
      throw new Error(`Cloudinary upload failed (${response.status}): ${errText}`);
    }

    const data = await response.json();
    console.log('[MediaRepo] Upload success, secure_url:', data.secure_url);

    // Signal complete as 100%
    onProgress?.({ loaded: 1, total: 1, percentage: 100 });

    return {
      publicId: data.public_id,
      secureUrl: data.secure_url,
      resourceType: data.resource_type as 'image' | 'video',
      thumbnailUrl: data.thumbnail_url,
      duration: data.duration,
    };
  },
};

