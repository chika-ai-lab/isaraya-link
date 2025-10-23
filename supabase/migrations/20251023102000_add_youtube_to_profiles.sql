-- ============================================
-- Ajouter le champ YouTube aux profils
-- ============================================

-- Ajouter la colonne youtube a la table profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS youtube TEXT;

-- Ajouter la colonne youtube a la table company_info (pour compatibilite)
ALTER TABLE public.company_info ADD COLUMN IF NOT EXISTS youtube TEXT;
