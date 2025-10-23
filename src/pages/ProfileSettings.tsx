import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useProfile as useProfileById } from "@/hooks/useProfiles";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileSwitcher } from "@/components/profile/ProfileSwitcher";
import { ProfileInfoForm } from "@/components/admin/ProfileInfoForm";
import { ContactInfoForm } from "@/components/admin/ContactInfoForm";
import { SocialLinksForm } from "@/components/admin/SocialLinksForm";
import { ServicesManager } from "@/components/admin/ServicesManager";
import { ProductsManager } from "@/components/admin/ProductsManager";
import { PromotionsManager } from "@/components/admin/PromotionsManager";
import { QRCodeGenerator } from "@/components/admin/QRCodeGenerator";
import { LogoUpload } from "@/components/admin/LogoUpload";
import { ColorCustomization } from "@/components/admin/ColorCustomization";
import { LogOut, AlertCircle, Plus, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const { signOut } = useAuth();
  const { profiles, loading: profilesLoading, setCurrentProfile } = useProfile();
  const { data: profile, isLoading: profileLoading } = useProfileById(profileId);
  const updateProfile = useUpdateProfile();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleLogoChange = async (logoUrl: string) => {
    if (!profile) return;
    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        updates: { logo_url: logoUrl },
      });
    } catch (error) {
      console.error("Error updating logo:", error);
    }
  };

  // Définir le profil actuel quand il est chargé
  if (profile && !profilesLoading) {
    setCurrentProfile(profile);
  }

  if (profilesLoading || profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Chargement...</p>
      </div>
    );
  }

  // Si le profil n'existe pas ou n'appartient pas à l'utilisateur
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
        <div className="container mx-auto p-6 max-w-4xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profil introuvable</AlertTitle>
            <AlertDescription>
              Ce profil n'existe pas ou vous n'avez pas les permissions pour y accéder.
            </AlertDescription>
          </Alert>
          <Button onClick={handleBackToDashboard} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Button variant="ghost" size="sm" onClick={handleBackToDashboard}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Mes profils
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Paramètres du profil</h1>
            <p className="text-muted-foreground">
              Gérez le contenu de {profile.company_name}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ProfileSwitcher />
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="appearance">Apparence</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Réseaux</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="qrcode">QR Code</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileInfoForm profile={profile} />
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <LogoUpload
              currentLogoUrl={profile.logo_url || undefined}
              onLogoChange={handleLogoChange}
              profileId={profile.id}
            />
            <ColorCustomization profile={profile} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactInfoForm profile={profile} />
          </TabsContent>

          <TabsContent value="social" className="space-y-4">
            <SocialLinksForm profile={profile} />
          </TabsContent>

          <TabsContent value="products">
            <ProductsManager profileId={profile.id} />
          </TabsContent>

          <TabsContent value="services">
            <ServicesManager profileId={profile.id} />
          </TabsContent>

          <TabsContent value="promotions">
            <PromotionsManager profileId={profile.id} />
          </TabsContent>

          <TabsContent value="qrcode">
            <QRCodeGenerator profile={profile} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}