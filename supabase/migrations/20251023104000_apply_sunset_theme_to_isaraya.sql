-- ============================================
-- Appliquer le theme Sunset au profil isaraya
-- ============================================

-- Mettre a jour le profil isaraya avec le theme sunset
UPDATE public.profiles
SET
  theme_preset = 'sunset',
  custom_colors = jsonb_build_object(
    'primary', '#ff5f10',
    'secondary', '#DB924B',
    'accent', '#FFB347',
    'neutral', '#5C4033',
    'base', '#FFF5E6'
  )
WHERE slug = 'isaraya';
