import { useState, useEffect } from "react";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types";
import { Loader2, Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialLinksFormProps {
  profile: Profile;
}

export function SocialLinksForm({ profile }: SocialLinksFormProps) {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    facebook: profile.facebook || "",
    instagram: profile.instagram || "",
    twitter: profile.twitter || "",
    tiktok: profile.tiktok || "",
    youtube: profile.youtube || "",
    linkedin: profile.linkedin || "",
  });

  useEffect(() => {
    setFormData({
      facebook: profile.facebook || "",
      instagram: profile.instagram || "",
      twitter: profile.twitter || "",
      tiktok: profile.tiktok || "",
      youtube: profile.youtube || "",
      linkedin: profile.linkedin || "",
    });
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        updates: formData,
      });
    } catch (error) {
      console.error("Error updating social links:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réseaux sociaux</CardTitle>
        <CardDescription>
          Ajoutez vos liens vers les réseaux sociaux (nom d'utilisateur ou URL complète)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook" className="flex items-center gap-2">
                <Facebook className="w-4 h-4 text-[#1877F2]" />
                Facebook
              </Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                placeholder="@votre-page ou https://facebook.com/votre-page"
              />
              <p className="text-xs text-muted-foreground">
                Exemple: @isaraya ou https://www.facebook.com/isaraya
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-[#E4405F]" />
                Instagram
              </Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                placeholder="@votre-compte ou https://instagram.com/votre-compte"
              />
              <p className="text-xs text-muted-foreground">
                Exemple: @isaraya ou https://www.instagram.com/isaraya
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                Twitter / X
              </Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                placeholder="@votre-compte ou https://twitter.com/votre-compte"
              />
              <p className="text-xs text-muted-foreground">
                Exemple: @isaraya ou https://twitter.com/isaraya
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tiktok" className="flex items-center gap-2">
                <TikTokIcon className="w-4 h-4" />
                TikTok
              </Label>
              <Input
                id="tiktok"
                value={formData.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
                placeholder="@votre-compte ou https://tiktok.com/@votre-compte"
              />
              <p className="text-xs text-muted-foreground">
                Exemple: @isaraya ou https://www.tiktok.com/@isaraya
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube" className="flex items-center gap-2">
                <Youtube className="w-4 h-4 text-[#FF0000]" />
                YouTube
              </Label>
              <Input
                id="youtube"
                value={formData.youtube}
                onChange={(e) => handleChange("youtube", e.target.value)}
                placeholder="@votre-chaine ou https://youtube.com/@votre-chaine"
              />
              <p className="text-xs text-muted-foreground">
                Exemple: @isaraya ou https://www.youtube.com/@isaraya
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                LinkedIn
              </Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="nom-entreprise ou https://linkedin.com/company/..."
              />
              <p className="text-xs text-muted-foreground">
                Exemple: isaraya ou https://www.linkedin.com/company/isaraya
              </p>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>💡 Astuce :</strong> Vous pouvez entrer soit le nom d'utilisateur (ex: @isaraya)
              soit l'URL complète de votre profil. Le système accepte les deux formats.
            </p>
          </div>

          <Button type="submit" disabled={updateProfile.isPending} className="w-full">
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
