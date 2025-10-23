-- ============================================
-- Script pour mettre à jour le profil Isaraya
-- avec les données dummy
-- ============================================

-- 1. Mettre à jour les informations du profil
UPDATE public.profiles
SET
  company_name = 'I-Saraya',
  slogan = 'Vivez la modernité, shoppez chez I-Saraya',
  phone = '77 415 65 65',
  email = 'info@saraya.tech',
  address = 'Dakar, Liberté 4',
  google_maps_url = 'https://maps.google.com/?q=Dakar+Liberté+4',
  website = 'www.isaraya.tech',
  description = 'Isaraya est votre destination shopping moderne au cœur de Dakar.
Nous proposons une sélection pointue de produits high-tech et de services innovants
pour accompagner votre quotidien. Notre mission : rendre la technologie accessible
à tous avec un service client d''excellence et des prix compétitifs.',
  facebook = 'isaraya',
  instagram = '@isaraya',
  twitter = '@isaraya',
  linkedin = 'isaraya',
  whatsapp = '221774156565',
  is_active = true
WHERE slug = 'isaraya';

-- 2. Supprimer les anciennes données (si elles existent)
DELETE FROM public.services WHERE profile_id IN (SELECT id FROM public.profiles WHERE slug = 'isaraya');
DELETE FROM public.products WHERE profile_id IN (SELECT id FROM public.profiles WHERE slug = 'isaraya');
DELETE FROM public.promotions WHERE profile_id IN (SELECT id FROM public.profiles WHERE slug = 'isaraya');

-- 3. Insérer les services
DO $$
DECLARE
  profile_uuid UUID;
BEGIN
  -- Récupérer l'ID du profil
  SELECT id INTO profile_uuid FROM public.profiles WHERE slug = 'isaraya';

  IF profile_uuid IS NOT NULL THEN
    -- Insérer les services
    INSERT INTO public.services (profile_id, title, description, icon, is_active) VALUES
    (profile_uuid, 'Smartphones & Accessoires', 'Derniers modèles et accessoires tendance', '📱', true),
    (profile_uuid, 'Informatique', 'Ordinateurs, tablettes et périphériques', '💻', true),
    (profile_uuid, 'Audio & Gaming', 'Casques, enceintes et consoles', '🎧', true),
    (profile_uuid, 'Service Après-Vente', 'Garantie et support technique', '🛍️', true);

    -- Insérer les produits
    INSERT INTO public.products (profile_id, title, description, price, is_featured, is_active) VALUES
    (profile_uuid, 'iPhone 15 Pro', 'Dernier smartphone Apple avec puce A17 Pro', '899 000 FCFA', true, true),
    (profile_uuid, 'Samsung Galaxy S24', 'Flagship Samsung avec IA intégrée', '750 000 FCFA', false, true),
    (profile_uuid, 'MacBook Air M2', 'Ordinateur portable ultra-fin et puissant', '1 200 000 FCFA', true, true),
    (profile_uuid, 'AirPods Pro 2', 'Écouteurs sans fil avec réduction de bruit active', '185 000 FCFA', true, true);

    -- Insérer les promotions
    INSERT INTO public.promotions (profile_id, title, description, discount_text, valid_until, is_active) VALUES
    (profile_uuid, 'Offre de Bienvenue', '10% de réduction sur votre premier achat', '-10%', NOW() + INTERVAL '30 days', true),
    (profile_uuid, 'Flash Sale', 'Jusqu''à 30% sur une sélection d''articles', '-30%', NOW() + INTERVAL '7 days', true),
    (profile_uuid, 'Cadeau Mystère', 'Un cadeau offert pour tout achat de 500 000 FCFA', 'Cadeau offert', NOW() + INTERVAL '15 days', true);

    RAISE NOTICE 'Profil Isaraya mis à jour avec succès!';
  ELSE
    RAISE EXCEPTION 'Profil "isaraya" introuvable';
  END IF;
END $$;
