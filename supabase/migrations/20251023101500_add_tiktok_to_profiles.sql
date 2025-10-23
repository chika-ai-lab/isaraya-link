-- ============================================
-- Ajouter le champ TikTok aux profils
-- ============================================

-- Ajouter la colonne tiktok a la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tiktok TEXT;

-- Ajouter la colonne tiktok a la table company_info (pour compatibilite)
ALTER TABLE public.company_info ADD COLUMN IF NOT EXISTS tiktok TEXT;
