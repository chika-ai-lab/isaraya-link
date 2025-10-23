import { useEffect } from 'react';
import { Profile } from '@/types';

/**
 * Hook pour appliquer le thème personnalisé d'un profil
 * @param profile Le profil dont on veut appliquer le thème
 */
export const useProfileTheme = (profile: Profile | undefined | null) => {
  useEffect(() => {
    if (!profile) return;

    // Récupérer les couleurs personnalisées
    const colors = profile.custom_colors || {
      primary: '#570df8',
      secondary: '#f000b8',
      accent: '#37cdbe',
      neutral: '#3d4451',
      base: '#ffffff',
    };

    // Convertir hex en HSL pour les variables CSS
    const hexToHSL = (hex: string): string => {
      // Supprimer le # si présent
      hex = hex.replace('#', '');

      // Convertir en RGB
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;

      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h = 0, s = 0, l = (max + min) / 2;

      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
            break;
          case g:
            h = ((b - r) / d + 2) / 6;
            break;
          case b:
            h = ((r - g) / d + 4) / 6;
            break;
        }
      }

      h = Math.round(h * 360);
      s = Math.round(s * 100);
      l = Math.round(l * 100);

      return `${h} ${s}% ${l}%`;
    };

    // Appliquer les variables CSS au document root
    const root = document.documentElement;

    root.style.setProperty('--primary', hexToHSL(colors.primary));
    root.style.setProperty('--secondary', hexToHSL(colors.secondary));
    root.style.setProperty('--accent', hexToHSL(colors.accent));

    // Pour le background, vérifier si c'est un thème clair ou sombre
    const baseLuminance = parseInt(hexToHSL(colors.base).split(' ')[2]);
    const isDark = baseLuminance < 50;

    if (isDark) {
      root.style.setProperty('--background', hexToHSL(colors.base));
      root.style.setProperty('--foreground', hexToHSL('#ffffff'));
      root.style.setProperty('--card', hexToHSL(colors.neutral));
      root.style.setProperty('--card-foreground', hexToHSL('#ffffff'));
    } else {
      root.style.setProperty('--background', hexToHSL(colors.base));
      root.style.setProperty('--foreground', hexToHSL('#000000'));
      root.style.setProperty('--card', hexToHSL('#ffffff'));
      root.style.setProperty('--card-foreground', hexToHSL('#000000'));
    }

    // Cleanup - restaurer les couleurs par défaut quand le composant est démonté
    return () => {
      root.style.removeProperty('--primary');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--card');
      root.style.removeProperty('--card-foreground');
    };
  }, [profile]);
};
