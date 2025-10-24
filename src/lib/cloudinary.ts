/**
 * Cloudinary Upload Utility
 * Handles image uploads to Cloudinary for products, profiles, and other assets
 */

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dw4pf6awx';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'isaraya_unsigned';

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
}

export interface UploadOptions {
  folder?: string;
  transformation?: string;
  tags?: string[];
}

/**
 * Upload an image to Cloudinary
 * @param file - The file to upload
 * @param options - Upload options (folder, transformation, tags)
 * @returns Promise with Cloudinary response
 */
export async function uploadToCloudinary(
  file: File,
  options: UploadOptions = {}
): Promise<CloudinaryUploadResponse> {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error(
      'Cloudinary configuration is missing. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env file'
    );
  }

  // Validate file
  if (!file.type.startsWith('image/')) {
    throw new Error('Le fichier doit être une image');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('L\'image ne doit pas dépasser 10 MB');
  }

  // Create form data
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  // Add optional parameters
  if (options.folder) {
    formData.append('folder', options.folder);
  }

  if (options.tags && options.tags.length > 0) {
    formData.append('tags', options.tags.join(','));
  }

  if (options.transformation) {
    formData.append('transformation', options.transformation);
  }

  // Upload to Cloudinary
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  try {
    const response = await fetch(cloudinaryUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Erreur lors de l\'upload');
    }

    const data: CloudinaryUploadResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

/**
 * Delete an image from Cloudinary by public_id
 * Note: This requires backend implementation with Cloudinary Admin API
 * @param publicId - The public_id of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This would typically be implemented on the backend
  // as it requires the Cloudinary API secret
  console.warn('Delete operation should be implemented on the backend');
  throw new Error('Delete operation not available on client side');
}

/**
 * Get Cloudinary image URL with transformations
 * @param publicId - The public_id of the image
 * @param transformations - Cloudinary transformation string (e.g., 'w_400,h_400,c_fill')
 * @returns Transformed image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: string
): string {
  if (!CLOUDINARY_CLOUD_NAME) {
    throw new Error('VITE_CLOUDINARY_CLOUD_NAME is not configured');
  }

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload`;

  if (transformations) {
    return `${baseUrl}/${transformations}/${publicId}`;
  }

  return `${baseUrl}/${publicId}`;
}

/**
 * Common transformation presets
 */
export const CLOUDINARY_PRESETS = {
  LOGO: 'w_400,h_400,c_fill,g_center',
  PRODUCT: 'w_800,h_600,c_fill,q_auto',
  PRODUCT_THUMB: 'w_300,h_300,c_fill,q_auto',
  BANNER: 'w_1200,h_400,c_fill,q_auto',
  AVATAR: 'w_200,h_200,c_fill,g_face',
};
