import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

// Helper function to normalize URLs - add https:// if missing
const normalizeUrl = (url: string): string => {
  if (!url) return "";
  const trimmed = url.trim();
  if (!trimmed) return "";

  // If it already has a protocol, return as is
  if (trimmed.match(/^https?:\/\//i)) {
    return trimmed;
  }

  // Add https:// prefix
  return `https://${trimmed}`;
};

const companySchema = z.object({
  company_name: z.string().min(1, "Le nom est requis").max(100),
  slogan: z.string().max(200),
  phone: z.string().max(20),
  email: z.string().email("Email invalide").max(100),
  address: z.string().max(200),
  google_maps_url: z.string().max(500),
  website: z.string().max(100),
  description: z.string().max(1000),
  facebook: z.string().max(100),
  instagram: z.string().max(100),
  twitter: z.string().max(100),
  tiktok: z.string().max(100),
  youtube: z.string().max(100),
  linkedin: z.string().max(100),
  whatsapp: z.string().max(20),
});

type CompanyInfo = z.infer<typeof companySchema>;

export function CompanyInfoForm() {
  const [loading, setLoading] = useState(false);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CompanyInfo>({
    company_name: "",
    slogan: "",
    phone: "",
    email: "",
    address: "",
    google_maps_url: "",
    website: "",
    description: "",
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: "",
    youtube: "",
    linkedin: "",
    whatsapp: "",
  });

  useEffect(() => {
    loadCompanyInfo();
  }, []);

  const loadCompanyInfo = async () => {
    try {
      const { data, error } = await supabase
        .from("company_info")
        .select("*")
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setCompanyId(data.id);
        setFormData({
          company_name: data.company_name || "",
          slogan: data.slogan || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          google_maps_url: data.google_maps_url || "",
          website: data.website || "",
          description: data.description || "",
          facebook: data.facebook || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          tiktok: data.tiktok || "",
          youtube: data.youtube || "",
          linkedin: data.linkedin || "",
          whatsapp: data.whatsapp || "",
        });
      }
    } catch (error) {
      console.error("Error loading company info:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les informations",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Normalize URLs before validation
      const normalizedData = {
        ...formData,
        website: normalizeUrl(formData.website),
        google_maps_url: normalizeUrl(formData.google_maps_url),
      };

      const validatedData = companySchema.parse(normalizedData);

      const { error } = await supabase
        .from("company_info")
        .update(validatedData)
        .eq("id", companyId);

      if (error) throw error;

      // Update form with normalized URLs
      setFormData(normalizedData);

      toast({
        title: "Succès",
        description: "Les informations ont été mises à jour",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Erreur de validation",
          description: error.errors[0].message,
          variant: "destructive",
        });
      } else if (error instanceof Error) {
        toast({
          title: "Erreur",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanyInfo, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations de l'entreprise</CardTitle>
        <CardDescription>Modifiez les informations affichées sur votre profil public</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Nom de l'entreprise</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => handleChange("company_name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input
                id="slogan"
                value={formData.slogan}
                onChange={(e) => handleChange("slogan", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => handleChange("whatsapp", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="google_maps_url">Lien Google Maps</Label>
            <Input
              id="google_maps_url"
              type="url"
              value={formData.google_maps_url}
              onChange={(e) => handleChange("google_maps_url", e.target.value)}
              placeholder="https://goo.gl/maps/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.facebook}
                onChange={(e) => handleChange("facebook", e.target.value)}
                placeholder="@isaraya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                value={formData.instagram}
                onChange={(e) => handleChange("instagram", e.target.value)}
                placeholder="@isaraya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.twitter}
                onChange={(e) => handleChange("twitter", e.target.value)}
                placeholder="@isaraya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tiktok">TikTok</Label>
              <Input
                id="tiktok"
                value={formData.tiktok}
                onChange={(e) => handleChange("tiktok", e.target.value)}
                placeholder="@isaraya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                value={formData.youtube}
                onChange={(e) => handleChange("youtube", e.target.value)}
                placeholder="@isaraya"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.linkedin}
                onChange={(e) => handleChange("linkedin", e.target.value)}
                placeholder="@isaraya"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}