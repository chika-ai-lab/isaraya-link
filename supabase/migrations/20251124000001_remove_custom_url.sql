-- Migration to remove qr_code_custom_url column (not needed anymore)
-- The slug field is now used directly to generate the profile URL

-- Remove qr_code_custom_url column
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS qr_code_custom_url;
