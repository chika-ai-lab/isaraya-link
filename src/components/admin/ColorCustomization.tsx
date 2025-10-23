import { useState, useEffect } from "react";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types";
import { Loader2, Palette, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface ColorCustomizationProps {
  profile: Profile;
}

// Thèmes prédéfinis DaisyUI
const DAISY_THEMES = [
  { name: 'sunset', label: '🌅 Sunset (Isaraya)', colors: { primary: '#ff5f10', secondary: '#DB924B', accent: '#FFB347', neutral: '#5C4033', base: '#FFF5E6' } },
  { name: 'light', label: 'Clair', colors: { primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe', neutral: '#3d4451', base: '#ffffff' } },
  { name: 'dark', label: 'Sombre', colors: { primary: '#661AE6', secondary: '#D926AA', accent: '#1FB2A5', neutral: '#191D24', base: '#1d232a' } },
  { name: 'cupcake', label: 'Cupcake', colors: { primary: '#65c3c8', secondary: '#ef9fbc', accent: '#eeaf3a', neutral: '#291334', base: '#faf7f5' } },
  { name: 'bumblebee', label: 'Bumblebee', colors: { primary: '#e0a82e', secondary: '#f9d72f', accent: '#181830', neutral: '#181830', base: '#ffffff' } },
  { name: 'emerald', label: 'Emerald', colors: { primary: '#66cc8a', secondary: '#377cfb', accent: '#ea5234', neutral: '#333c4d', base: '#ffffff' } },
  { name: 'corporate', label: 'Corporate', colors: { primary: '#4b6bfb', secondary: '#7b92b2', accent: '#67cba0', neutral: '#181a2a', base: '#ffffff' } },
  { name: 'synthwave', label: 'Synthwave', colors: { primary: '#e779c1', secondary: '#58c7f3', accent: '#f9c513', neutral: '#221551', base: '#1a103d' } },
  { name: 'retro', label: 'Retro', colors: { primary: '#ef9995', secondary: '#a4cbb4', accent: '#ebdc99', neutral: '#2e282a', base: '#e4d8b4' } },
  { name: 'cyberpunk', label: 'Cyberpunk', colors: { primary: '#ff7598', secondary: '#75d1f0', accent: '#fff68f', neutral: '#423105', base: '#ffee00' } },
  { name: 'valentine', label: 'Valentine', colors: { primary: '#e96d7b', secondary: '#a991f7', accent: '#88dbdd', neutral: '#af4670', base: '#f0d9dd' } },
  { name: 'halloween', label: 'Halloween', colors: { primary: '#f28c18', secondary: '#6d3a9c', accent: '#51a800', neutral: '#1b1d1d', base: '#212121' } },
  { name: 'garden', label: 'Garden', colors: { primary: '#5c7f67', secondary: '#ecf4e7', accent: '#5c7f67', neutral: '#5c7f67', base: '#e9e7e7' } },
  { name: 'forest', label: 'Forest', colors: { primary: '#1eb854', secondary: '#1db88e', accent: '#1db8ab', neutral: '#19362d', base: '#171212' } },
  { name: 'aqua', label: 'Aqua', colors: { primary: '#09ecf3', secondary: '#966fb3', accent: '#ffe999', neutral: '#3b8ac4', base: '#345da7' } },
  { name: 'lofi', label: 'Lo-Fi', colors: { primary: '#0d0d0d', secondary: '#1a1a1a', accent: '#1a1a1a', neutral: '#0d0d0d', base: '#ffffff' } },
  { name: 'pastel', label: 'Pastel', colors: { primary: '#d1c1d7', secondary: '#f6cbd1', accent: '#b4e9d6', neutral: '#70acc7', base: '#ffffff' } },
  { name: 'fantasy', label: 'Fantasy', colors: { primary: '#6e0b75', secondary: '#007ebd', accent: '#f80000', neutral: '#19182d', base: '#ffffff' } },
  { name: 'wireframe', label: 'Wireframe', colors: { primary: '#b8b8b8', secondary: '#b8b8b8', accent: '#b8b8b8', neutral: '#b8b8b8', base: '#ffffff' } },
  { name: 'black', label: 'Black', colors: { primary: '#373737', secondary: '#373737', accent: '#373737', neutral: '#000000', base: '#000000' } },
  { name: 'luxury', label: 'Luxury', colors: { primary: '#ffffff', secondary: '#152747', accent: '#513448', neutral: '#331800', base: '#09090b' } },
  { name: 'dracula', label: 'Dracula', colors: { primary: '#ff79c6', secondary: '#bd93f9', accent: '#ffb86c', neutral: '#414558', base: '#282a36' } },
  { name: 'cmyk', label: 'CMYK', colors: { primary: '#45AEEE', secondary: '#E8488A', accent: '#FFF232', neutral: '#1a1a1a', base: '#ffffff' } },
  { name: 'autumn', label: 'Autumn', colors: { primary: '#8c0327', secondary: '#d85251', accent: '#ebdc99', neutral: '#322926', base: '#f3f0ef' } },
  { name: 'business', label: 'Business', colors: { primary: '#1c4e80', secondary: '#7c909a', accent: '#ea6947', neutral: '#23282e', base: '#ffffff' } },
  { name: 'acid', label: 'Acid', colors: { primary: '#ff00f4', secondary: '#ff7400', accent: '#00e0ff', neutral: '#1e1c28', base: '#fafafa' } },
  { name: 'lemonade', label: 'Lemonade', colors: { primary: '#519903', secondary: '#e9e92e', accent: '#f9a900', neutral: '#191a3f', base: '#ffffff' } },
  { name: 'night', label: 'Night', colors: { primary: '#38bdf8', secondary: '#818CF8', accent: '#F471B5', neutral: '#1E293B', base: '#0f172a' } },
  { name: 'coffee', label: 'Coffee', colors: { primary: '#DB924B', secondary: '#263E3F', accent: '#10576D', neutral: '#120C05', base: '#20161F' } },
  { name: 'winter', label: 'Winter', colors: { primary: '#047AFF', secondary: '#463AA2', accent: '#C148AC', neutral: '#FFFFFF', base: '#ffffff' } },
  { name: 'custom', label: 'Personnalisé', colors: { primary: '#570df8', secondary: '#f000b8', accent: '#37cdbe', neutral: '#3d4451', base: '#ffffff' } },
];

export function ColorCustomization({ profile }: ColorCustomizationProps) {
  const updateProfile = useUpdateProfile();
  const [selectedTheme, setSelectedTheme] = useState<string>(profile.theme_preset || 'light');
  const [customColors, setCustomColors] = useState({
    primary: profile.custom_colors?.primary || '#570df8',
    secondary: profile.custom_colors?.secondary || '#f000b8',
    accent: profile.custom_colors?.accent || '#37cdbe',
    neutral: profile.custom_colors?.neutral || '#3d4451',
    base: profile.custom_colors?.base || '#ffffff',
  });
  const [isCustom, setIsCustom] = useState(selectedTheme === 'custom');

  useEffect(() => {
    if (profile.theme_preset) {
      setSelectedTheme(profile.theme_preset);
      setIsCustom(profile.theme_preset === 'custom');
    }
    if (profile.custom_colors) {
      setCustomColors({
        primary: profile.custom_colors.primary || '#570df8',
        secondary: profile.custom_colors.secondary || '#f000b8',
        accent: profile.custom_colors.accent || '#37cdbe',
        neutral: profile.custom_colors.neutral || '#3d4451',
        base: profile.custom_colors.base || '#ffffff',
      });
    }
  }, [profile]);

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName);
    setIsCustom(themeName === 'custom');

    if (themeName !== 'custom') {
      const theme = DAISY_THEMES.find(t => t.name === themeName);
      if (theme) {
        setCustomColors(theme.colors);
      }
    }
  };

  const handleColorChange = (colorKey: string, value: string) => {
    setCustomColors(prev => ({
      ...prev,
      [colorKey]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        updates: {
          theme_preset: selectedTheme,
          custom_colors: customColors,
        },
      });
      toast.success('Thème enregistré avec succès!');
    } catch (error) {
      console.error("Error updating theme:", error);
      toast.error('Erreur lors de la sauvegarde du thème');
    }
  };

  const handleReset = () => {
    setSelectedTheme('light');
    setIsCustom(false);
    const lightTheme = DAISY_THEMES.find(t => t.name === 'light');
    if (lightTheme) {
      setCustomColors(lightTheme.colors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Personnalisation des couleurs
        </CardTitle>
        <CardDescription>
          Choisissez un thème prédéfini ou créez votre propre palette de couleurs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Choix entre thème prédéfini et personnalisé */}
          <div className="flex gap-2 p-1 bg-muted rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsCustom(false);
                if (selectedTheme === 'custom') {
                  handleThemeSelect('light');
                }
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                !isCustom
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Thèmes prédéfinis
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                setSelectedTheme('custom');
              }}
              className={`flex-1 py-2 px-4 rounded-md transition-all ${
                isCustom
                  ? 'bg-background shadow-sm font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Couleurs personnalisées
            </button>
          </div>

          {/* Thèmes prédéfinis */}
          {!isCustom && (
            <div className="space-y-3">
              <Label>Choisissez un thème</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
                {DAISY_THEMES.filter(t => t.name !== 'custom').map((theme) => (
                  <button
                    key={theme.name}
                    type="button"
                    onClick={() => handleThemeSelect(theme.name)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium mb-2">{theme.label}</div>
                    <div className="flex gap-1 justify-center">
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.primary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.secondary }} />
                      <div className="w-6 h-6 rounded" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Palette personnalisée */}
          {isCustom && (
            <div className="space-y-4 p-4 border-2 border-primary/20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                <Label className="text-lg font-semibold">Créez votre palette de couleurs</Label>
              </div>

              <p className="text-sm text-muted-foreground">
                Personnalisez chaque couleur en cliquant sur le carré de couleur ou en saisissant un code hexadécimal.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(customColors).map(([key, value]) => (
                  <div key={key} className="space-y-2 p-3 bg-background/50 rounded-lg border">
                    <Label htmlFor={key} className="text-sm font-medium flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-border"
                        style={{ backgroundColor: value }}
                      />
                      {key === 'base' ? '🎨 Couleur de fond' :
                       key === 'neutral' ? '⚪ Neutre' :
                       key === 'accent' ? '✨ Accent' :
                       key === 'primary' ? '🔵 Principale' :
                       key === 'secondary' ? '🟣 Secondaire' : key}
                    </Label>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Input
                          type="color"
                          id={key}
                          value={value}
                          onChange={(e) => handleColorChange(key, e.target.value)}
                          className="w-16 h-10 cursor-pointer border-2"
                        />
                      </div>
                      <Input
                        type="text"
                        value={value}
                        onChange={(e) => handleColorChange(key, e.target.value)}
                        placeholder="#000000"
                        className="flex-1 font-mono text-sm"
                        pattern="^#[0-9A-Fa-f]{6}$"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-background p-4 rounded-lg border-2">
                <p className="text-sm font-medium mb-4 flex items-center gap-2">
                  👁️ Aperçu de votre palette
                </p>
                <div className="flex gap-3 flex-wrap justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg border-2 border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: customColors.primary }}
                      title={customColors.primary}
                    />
                    <div className="text-center">
                      <span className="text-xs font-medium">Principale</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{customColors.primary}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg border-2 border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: customColors.secondary }}
                      title={customColors.secondary}
                    />
                    <div className="text-center">
                      <span className="text-xs font-medium">Secondaire</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{customColors.secondary}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg border-2 border-white/20 transition-transform hover:scale-110"
                      style={{ backgroundColor: customColors.accent }}
                      title={customColors.accent}
                    />
                    <div className="text-center">
                      <span className="text-xs font-medium">Accent</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{customColors.accent}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: customColors.neutral }}
                      title={customColors.neutral}
                    />
                    <div className="text-center">
                      <span className="text-xs font-medium">Neutre</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{customColors.neutral}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="w-20 h-20 rounded-xl shadow-lg border-2 transition-transform hover:scale-110"
                      style={{ backgroundColor: customColors.base }}
                      title={customColors.base}
                    />
                    <div className="text-center">
                      <span className="text-xs font-medium">Fond</span>
                      <p className="text-[10px] text-muted-foreground font-mono">{customColors.base}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    💡 <strong>Astuce :</strong> Ces couleurs seront appliquées automatiquement à votre page publique.
                    Assurez-vous qu'elles offrent un bon contraste pour la lisibilité.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button type="submit" disabled={updateProfile.isPending} className="flex-1">
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                'Enregistrer le thème'
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
