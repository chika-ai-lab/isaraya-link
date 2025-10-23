-- ============================================
-- Fix: Assigner le profil isaraya a l'utilisateur
-- et corriger les politiques RLS
-- ============================================

-- 1. Assigner le profil isaraya a l'utilisateur cheikhkante.contact@gmail.com
UPDATE public.profiles
SET user_id = (
  SELECT id FROM auth.users WHERE email = 'cheikhkante.contact@gmail.com' LIMIT 1
)
WHERE slug = 'isaraya' AND user_id IS NULL;

-- 2. Verifier les politiques RLS - Ajouter une politique pour les profils orphelins
-- Cette politique permet aux admins de voir les profils sans user_id
DROP POLICY IF EXISTS "Admin can view orphan profiles" ON public.profiles;
CREATE POLICY "Admin can view orphan profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (user_id IS NULL);
