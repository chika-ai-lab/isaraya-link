import { useState, useEffect } from "react";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Profile } from "@/types";
import { Loader2 } from "lucide-react";

interface ContactInfoFormProps {
  profile: Profile;
}

export function ContactInfoForm({ profile }: ContactInfoFormProps) {
  const updateProfile = useUpdateProfile();
  const [formData, setFormData] = useState({
    phone: profile.phone || "",
    email: profile.email || "",
    address: profile.address || "",
    google_maps_url: profile.google_maps_url || "",
    website: profile.website || "",
    whatsapp: profile.whatsapp || "",
  });

  useEffect(() => {
    setFormData({
      phone: profile.phone || "",
      email: profile.email || "",
      address: profile.address || "",
      google_maps_url: profile.google_maps_url || "",
      website: profile.website || "",
      whatsapp: profile.whatsapp || "",
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
      console.error("Error updating contact info:", error);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de contact</CardTitle>
        <CardDescription>
          Gérez vos coordonnées et informations de contact
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="77 123 45 67"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contact@exemple.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="www.exemple.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
                placeholder="77 123 45 67"
              />
              <p className="text-xs text-muted-foreground">
                Format: 77 123 45 67 (sans indicatif pays)
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
              placeholder="Dakar, Liberté 4, Rue 15"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_maps_url">Lien Google Maps</Label>
            <Input
              id="google_maps_url"
              type="url"
              value={formData.google_maps_url}
              onChange={(e) => handleChange("google_maps_url", e.target.value)}
              placeholder="https://maps.app.goo.gl/..."
            />
            <p className="text-xs text-muted-foreground">
              Ouvrez Google Maps, recherchez votre adresse et copiez le lien de partage
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
