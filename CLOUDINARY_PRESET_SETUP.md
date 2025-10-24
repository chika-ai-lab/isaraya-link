# Configuration du Preset Cloudinary (URGENT)

## Erreur actuelle
```
Upload preset not found
```

## Solution rapide (5 minutes)

### Étape 1 : Se connecter à Cloudinary

1. Allez sur [cloudinary.com](https://cloudinary.com)
2. Connectez-vous avec votre compte (cloud name: `dw4pf6awx`)

### Étape 2 : Créer un Upload Preset

1. Cliquez sur l'icône **⚙️ Settings** (engrenage) en haut à droite
2. Dans le menu de gauche, cliquez sur **Upload**
3. Faites défiler jusqu'à la section **Upload presets**
4. Cliquez sur **Add upload preset**

### Étape 3 : Configurer le preset

Configurez les paramètres suivants :

```
Preset name: isaraya_unsigned
Signing Mode: Unsigned ⚠️ IMPORTANT
Folder: (laisser vide, on gère via le code)
Use filename: ✓ (coché)
Unique filename: ✓ (coché)
Overwrite: ✗ (décoché)
```

**IMPORTANT** : Le mode **Unsigned** est obligatoire pour permettre les uploads depuis le navigateur !

### Étape 4 : Sauvegarder

Cliquez sur **Save** en haut à droite.

### Étape 5 : Mettre à jour le code

Une fois le preset créé, mettez à jour le fichier `.env` :

```bash
VITE_CLOUDINARY_UPLOAD_PRESET=isaraya_unsigned
```

Puis redémarrez le serveur :
```bash
npm run dev
```

## Alternative rapide (si vous voulez tester maintenant)

Si vous voulez tester immédiatement sans créer de preset, vous pouvez activer le preset par défaut dans Cloudinary :

1. Settings → Upload
2. Cherchez le preset `ml_default`
3. Éditez-le et changez **Signing Mode** à **Unsigned**
4. Sauvegardez

Mais je recommande de créer un preset dédié comme expliqué ci-dessus.

## Vérification

Pour vérifier que ça fonctionne :

1. Allez dans le dashboard admin
2. Produits → Ajouter un produit
3. Uploadez une image
4. ✅ L'image devrait s'uploader sans erreur

## Capture d'écran des paramètres

```
┌─────────────────────────────────────────┐
│ Upload preset                            │
├─────────────────────────────────────────┤
│ Preset name: isaraya_unsigned           │
│ Signing Mode: [●] Unsigned              │
│               [ ] Signed                 │
│                                          │
│ ☑ Use filename                          │
│ ☑ Unique filename                       │
│ ☐ Overwrite                             │
│                                          │
│ Folder: (empty)                         │
└─────────────────────────────────────────┘
```

## En cas de problème

Si vous avez toujours des erreurs :
1. Vérifiez que le Cloud Name est bien `dw4pf6awx`
2. Vérifiez que le preset est en mode **Unsigned**
3. Videz le cache du navigateur (Ctrl + Shift + R)
4. Redémarrez le serveur
