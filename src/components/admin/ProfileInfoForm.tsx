import { useState, useEffect } from "react";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Profile } from "@/types";
import { Loader2 } from "lucide-react";

interface ProfileInfoFormProps {
  profile: Profile;
}

export function ProfileInfoForm({ profile }: ProfileInfoFormProps) {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    company_name: profile.company_name || "",
    slogan: profile.slogan || "",
    description: profile.description || "",
    logo_url: profile.logo_url || "",
  });

  useEffect(() => {
    setFormData({
      company_name: profile.company_name || "",
      slogan: profile.slogan || "",
      description: profile.description || "",
      logo_url: profile.logo_url || "",
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
      console.error("Error updating profile:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations générales</CardTitle>
        <CardDescription>
          Modifiez les informations principales de votre profil d'entreprise
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company_name">
              Nom de l'entreprise <span className="text-destructive">*</span>
            </Label>
            <Input
              id="company_name"
              value={formData.company_name}
              onChange={(e) => handleChange("company_name", e.target.value)}
              required
              placeholder="Ma Super Entreprise"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slogan">Slogan</Label>
            <Input
              id="slogan"
              value={formData.slogan}
              onChange={(e) => handleChange("slogan", e.target.value)}
              placeholder="Votre slogan accrocheur"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo (URL de l'image)</Label>
            <Input
              id="logo_url"
              type="url"
              value={formData.logo_url}
              onChange={(e) => handleChange("logo_url", e.target.value)}
              placeholder="https://exemple.com/logo.png"
            />
            {formData.logo_url && (
              <div className="mt-2">
                <img
                  src={formData.logo_url}
                  alt="Aperçu du logo"
                  className="w-24 h-24 object-cover rounded-lg border"
                  onError={(e) => {
                    e.currentTarget.src = "";
                    toast.error("Impossible de charger l'image");
                  }}
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Entrez l'URL d'une image hébergée en ligne
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={5}
              placeholder="Décrivez votre entreprise, vos valeurs, votre histoire..."
            />
            <p className="text-xs text-muted-foreground">
              {formData.description.length} / 1000 caractères
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
