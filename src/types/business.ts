export interface BusinessLogo {
  url: string;
  publicId: string;
}

export interface BusinessCover {
  url: string;
  publicId: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  logoUrl: string | null;
  logoPublicId: string | null;
  coverUrl: string | null;
  coverPublicId: string | null;
  categoryId: string | null;
  status: 'draft' | 'pending_review' | 'published' | 'rejected' | 'suspended';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
