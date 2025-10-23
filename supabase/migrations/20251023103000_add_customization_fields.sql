-- ============================================
-- Ajouter les champs de personnalisation
-- (couleurs, theme, logo)
-- ============================================

-- Ajouter les colonnes de personnalisation a la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'light';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_colors JSONB;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Ajouter un commentaire pour expliquer la structure de custom_colors
COMMENT ON COLUMN public.profiles.custom_colors IS 'Structure JSON: {"primary": "#color", "secondary": "#color", "accent": "#color", "neutral": "#color", "base": "#color"}';

-- Ajouter les memes colonnes a company_info pour compatibilite
ALTER TABLE public.company_info ADD COLUMN IF NOT EXISTS theme_preset TEXT DEFAULT 'light';
ALTER TABLE public.company_info ADD COLUMN IF NOT EXISTS custom_colors JSONB;
ALTER TABLE public.company_info ADD COLUMN IF NOT EXISTS logo_url TEXT;
