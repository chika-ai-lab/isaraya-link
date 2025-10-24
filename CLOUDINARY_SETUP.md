# Configuration Cloudinary

Ce guide explique comment Cloudinary est configuré pour l'upload des images dans votre application.

## Configuration automatique

### Cloud Name

Le Cloud Name est déjà configuré dans le fichier `.env`:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=dw4pf6awx
```

### Upload Preset

L'application utilise le preset par défaut `ml_default` qui est **automatiquement disponible** sur tous les comptes Cloudinary.

**Aucune configuration supplémentaire n'est nécessaire !** ✅

### Organisation des fichiers

Les images sont automatiquement organisées dans des dossiers :
- `logos/` - Logos d'entreprise
- `products/` - Images de produits

## Utilisation dans l'application

### 1. Upload de logo d'entreprise

Le composant `LogoUpload` upload automatiquement sur Cloudinary :

**Emplacement**: Dashboard Admin → Profil → Logo de l'entreprise

```tsx
import { LogoUpload } from "@/components/admin/LogoUpload";

<LogoUpload
  currentLogoUrl={profile.logo_url}
  onLogoChange={(url) => {
    // L'URL Cloudinary est automatiquement retournée
    setProfile({ ...profile, logo_url: url });
  }}
  profileId={profile.id}
/>
```

**Fonctionnalités**:
- Taille max: 5 MB
- Formats: JPG, PNG, GIF
- Preview instantané
- Upload direct sur Cloudinary

### 2. Upload d'images de produits

Le formulaire de produits dans `ProductsManager` utilise déjà l'upload Cloudinary :

**Utilisation**:
1. Dashboard Admin → Produits
2. Cliquez sur "Ajouter un produit"
3. Cliquez sur "Uploader une image"
4. L'image est automatiquement uploadée sur Cloudinary
5. L'URL est enregistrée dans la base de données

**Fonctionnalités**:
- Taille max: 10 MB
- Formats: JPG, PNG, GIF
- Preview instantané
- Upload direct sur Cloudinary

### 3. Utiliser l'utilitaire directement

Pour d'autres cas d'usage personnalisés :

```tsx
import { uploadToCloudinary } from "@/lib/cloudinary";

const handleUpload = async (file: File) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: "custom-folder",
      tags: ["tag1", "tag2"]
    });

    console.log("URL:", result.secure_url);
    console.log("Public ID:", result.public_id);
  } catch (error) {
    console.error("Erreur upload:", error);
  }
};
```

## Options de transformation

Cloudinary offre des transformations d'images à la volée. Exemples:

```typescript
import { getCloudinaryUrl, CLOUDINARY_PRESETS } from "@/lib/cloudinary";

// Logo carré 400x400
const logoUrl = getCloudinaryUrl(publicId, CLOUDINARY_PRESETS.LOGO);

// Image produit 800x600
const productUrl = getCloudinaryUrl(publicId, CLOUDINARY_PRESETS.PRODUCT);

// Miniature 300x300
const thumbUrl = getCloudinaryUrl(publicId, CLOUDINARY_PRESETS.PRODUCT_THUMB);

// Transformation personnalisée
const customUrl = getCloudinaryUrl(publicId, 'w_500,h_500,c_fill,q_auto,f_auto');
```

## Composants disponibles

1. **LogoUpload** ([src/components/admin/LogoUpload.tsx](src/components/admin/LogoUpload.tsx))
   - Upload de logo avec Cloudinary
   - Taille max: 5 MB
   - Carré recommandé (400x400 px)

2. **ProductsManager** ([src/components/admin/ProductsManager.tsx](src/components/admin/ProductsManager.tsx))
   - Formulaire de produits avec upload d'images
   - Taille max: 10 MB
   - Format paysage (aspect-video)

3. **ImageUpload** ([src/components/ui/image-upload.tsx](src/components/ui/image-upload.tsx))
   - Composant générique réutilisable
   - Personnalisable (taille, format, dossier)

4. **Utilitaires** ([src/lib/cloudinary.ts](src/lib/cloudinary.ts))
   - `uploadToCloudinary()` - Upload de fichiers
   - `getCloudinaryUrl()` - Génération d'URLs avec transformations
   - `CLOUDINARY_PRESETS` - Presets de transformation

## Fonctionnalités incluses

✅ Upload automatique sur Cloudinary
✅ Preview instantané des images
✅ Validation du format et de la taille
✅ Organisation en dossiers (logos/, products/)
✅ Tags automatiques pour organisation
✅ Pas de configuration supplémentaire requise
✅ Transformations d'images à la volée

## Limites du plan gratuit Cloudinary

- **Crédits mensuels**: 25 crédits (environ 25 000 transformations)
- **Stockage**: 25 GB
- **Bande passante**: 25 GB/mois
- **Images**: Illimitées

**C'est largement suffisant pour démarrer !**

## Sécurité

- Les uploads utilisent le preset `ml_default` (unsigned)
- Validation côté client (type, taille)
- Fichiers stockés de manière sécurisée sur Cloudinary
- URLs publiques optimisées pour la performance

## Besoin d'aide?

- [Documentation Cloudinary](https://cloudinary.com/documentation)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
- [Upload API](https://cloudinary.com/documentation/upload_images)
