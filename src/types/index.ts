import { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

// ============================================
// Profile Types
// ============================================

export type Profile = Tables<'profiles'>;
export type ProfileInsert = TablesInsert<'profiles'>;
export type ProfileUpdate = TablesUpdate<'profiles'>;

// Profile avec statistiques
export type ProfileWithStats = Profile & {
  products_count?: number;
  services_count?: number;
  promotions_count?: number;
};

// ============================================
// Product Types
// ============================================

export type Product = Tables<'products'>;
export type ProductInsert = TablesInsert<'products'>;
export type ProductUpdate = TablesUpdate<'products'>;

// Product avec relation profile
export type ProductWithProfile = Product & {
  profile?: Profile;
};

// ============================================
// Service Types
// ============================================

export type Service = Tables<'services'>;
export type ServiceInsert = TablesInsert<'services'>;
export type ServiceUpdate = TablesUpdate<'services'>;

// Service avec relation profile
export type ServiceWithProfile = Service & {
  profile?: Profile;
};

// ============================================
// Promotion Types
// ============================================

export type Promotion = Tables<'promotions'>;
export type PromotionInsert = TablesInsert<'promotions'>;
export type PromotionUpdate = TablesUpdate<'promotions'>;

// Promotion avec relation profile
export type PromotionWithProfile = Promotion & {
  profile?: Profile;
};

// ============================================
// User Types
// ============================================

export type UserRole = Tables<'user_roles'>;

// ============================================
// Form Types (pour les formulaires)
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
