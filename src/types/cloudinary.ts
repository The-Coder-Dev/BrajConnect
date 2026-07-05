export interface GalleryImage {
  imageUrl: string;
  publicId: string;
  altText?: string;
  sortOrder: number;
}

export interface UploadedImage {
  url: string;
  publicId: string;
}

export interface CloudinaryResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  original_filename: string;
}
