// ============================================
// Profile Types
// ============================================

export interface Profile {
  id: string;
  user_id: string | null;
  slug: string;
  company_name: string;
  slogan: string;
  logo_url: string | null;
  phone: string;
  email: string;
  address: string;
  google_maps_url: string | null;
  website: string;
  description: string;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  whatsapp: string | null;
  tiktok: string | null;
  youtube: string | null;
  custom_colors: any | null;
  theme_preset: string | null;
  qr_code_size: number;
  is_active: boolean;
  created_at: string;
}

export type ProfileInsert = Partial<Omit<Profile, 'id' | 'created_at'>> & {
  slug: string;
  company_name: string;
};
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;

export type ProfileWithStats = Profile & {
  products_count?: number;
  services_count?: number;
  promotions_count?: number;
};

// ============================================
// Product Types
// ============================================

export interface Product {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  price: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export type ProductInsert = Partial<Omit<Product, 'id' | 'created_at'>> & {
  profile_id: string;
  title: string;
};
export type ProductUpdate = Partial<Omit<Product, 'id' | 'created_at'>>;

export type ProductWithProfile = Product & { profile?: Profile };

// ============================================
// Service Types
// ============================================

export interface Service {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
}

export type ServiceInsert = Partial<Omit<Service, 'id' | 'created_at'>> & {
  profile_id: string;
  title: string;
};
export type ServiceUpdate = Partial<Omit<Service, 'id' | 'created_at'>>;

export type ServiceWithProfile = Service & { profile?: Profile };

// ============================================
// Promotion Types
// ============================================

export interface Promotion {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  discount_text: string | null;
  is_active: boolean;
  valid_until: string | null;
  display_order: number;
  created_at: string;
}

export type PromotionInsert = Partial<Omit<Promotion, 'id' | 'created_at'>> & {
  profile_id: string;
  title: string;
};
export type PromotionUpdate = Partial<Omit<Promotion, 'id' | 'created_at'>>;

export type PromotionWithProfile = Promotion & { profile?: Profile };

// ============================================
// Commercial Types
// ============================================

export interface Commercial {
  id: string;
  profile_id: string;
  first_name: string;
  last_name: string;
  position: string;
  phone: string | null;
  email: string | null;
  photo_url: string | null;
  bio: string | null;
  is_active: boolean;
  created_at: string;
}

export type CommercialInsert = Partial<Omit<Commercial, 'id' | 'created_at'>> & {
  profile_id: string;
  first_name: string;
  last_name: string;
};
export type CommercialUpdate = Partial<Omit<Commercial, 'id' | 'created_at'>>;

export interface CommercialFormData {
  first_name: string;
  last_name: string;
  position?: string;
  phone?: string;
  email?: string;
  photo_url?: string;
  bio?: string;
  is_active?: boolean;
}

// ============================================
// User Types
// ============================================

export interface UserRole {
  id: string;
  user_id: string;
  role: string;
}

// ============================================
// Form Types
// ============================================

export interface CustomColors {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  base: string;
}

export interface ProfileFormData {
  slug: string;
  company_name: string;
  slogan?: string;
  logo_url?: string;
  phone?: string;
  email?: string;
  address?: string;
  google_maps_url?: string;
  website?: string;
  description?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  tiktok?: string;
  youtube?: string;
  linkedin?: string;
  whatsapp?: string;
  theme_preset?: string;
  custom_colors?: CustomColors;
  is_active?: boolean;
}

export interface ProductFormData {
  title: string;
  description: string;
  price?: string;
  image_url?: string;
  is_featured?: boolean;
  is_active?: boolean;
  display_order?: number;
}

export interface ServiceFormData {
  title: string;
  description: string;
  icon: string;
  is_active?: boolean;
  display_order?: number;
}

export interface PromotionFormData {
  title: string;
  description: string;
  discount_text?: string;
  is_active?: boolean;
  valid_until?: string;
  display_order?: number;
}

// ============================================
// Context Types
// ============================================

export interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export interface ProfileContextType {
  currentProfile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  setCurrentProfile: (profile: Profile | null) => void;
  refreshProfiles: () => Promise<void>;
}

// ============================================
// Utility Types
// ============================================

export interface SlugValidationResult {
  isValid: boolean;
  isAvailable: boolean;
  suggestedSlug?: string;
  error?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}
