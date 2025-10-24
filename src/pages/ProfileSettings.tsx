import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/contexts/ProfileContext";
import { useProfile as useProfileById } from "@/hooks/useProfiles";
import { useUpdateProfile } from "@/hooks/useProfiles";
import { Button } from "@/components/ui/button";
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
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { defaultSidebarItems } from "@/components/dashboard/Sidebar";
import { LogOut, AlertCircle, ArrowLeft } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Profile } from "@/types";

function ProfileSettingsContent({ profile }: { profile: Profile }) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const updateProfile = useUpdateProfile();
  const [activeTab, setActiveTab] = useState("profile");
  const { setOpenMobile } = useSidebar();

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setOpenMobile(false); // Close mobile sidebar when item is clicked
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar>
        <SidebarHeader className="p-6 border-b bg-black">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez votre profil
          </p>
        </SidebarHeader>
        <SidebarContent className="px-3 py-4 bg-black">
          <SidebarMenu className="space-y-1">
            {defaultSidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.value;

              return (
                <SidebarMenuItem key={item.value}>
                  <SidebarMenuButton
                    onClick={() => handleTabChange(item.value)}
                    isActive={isActive}
                    className={cn(
                      "w-full justify-start gap-3 h-11",
                      isActive && "bg-orange-600/10 text-orange-500 shadow-md"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t bg-black">
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Isaraya Link
            </p>
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content */}
      <SidebarInset className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <SidebarTrigger className="md:hidden" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackToDashboard}
                  className="text-sm"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Mes profils</span>
                  <span className="sm:hidden">Retour</span>
                </Button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold truncate">
                Paramètres du profil
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base truncate">
                Gérez le contenu de {profile.company_name}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 w-full lg:w-auto">
              <ProfileSwitcher />
              <Button
                onClick={handleLogout}
                variant="outline"
                className="text-sm flex-1 sm:flex-none"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Déconnexion</span>
                <span className="sm:hidden">Logout</span>
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4 sm:space-y-6">
            {activeTab === "profile" && (
              <div className="space-y-4">
                <ProfileInfoForm profile={profile} />
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-4">
                <LogoUpload
                  currentLogoUrl={profile.logo_url || undefined}
                  onLogoChange={handleLogoChange}
                  profileId={profile.id}
                />
                <ColorCustomization profile={profile} />
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-4">
                <ContactInfoForm profile={profile} />
              </div>
            )}

            {activeTab === "social" && (
              <div className="space-y-4">
                <SocialLinksForm profile={profile} />
              </div>
            )}

            {activeTab === "products" && (
              <ProductsManager profileId={profile.id} />
            )}

            {activeTab === "services" && (
              <ServicesManager profileId={profile.id} />
            )}

            {activeTab === "promotions" && (
              <PromotionsManager profileId={profile.id} />
            )}

            {activeTab === "qrcode" && <QRCodeGenerator profile={profile} />}
          </div>
        </div>
      </SidebarInset>
    </>
  );
}

export default function ProfileSettings() {
  const navigate = useNavigate();
  const { profileId } = useParams<{ profileId: string }>();
  const { signOut } = useAuth();
  const {
    profiles,
    loading: profilesLoading,
    setCurrentProfile,
  } = useProfile();
  const { data: profile, isLoading: profileLoading } =
    useProfileById(profileId);
  const updateProfile = useUpdateProfile();

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Définir le profil actuel quand il est chargé
  useEffect(() => {
    if (profile && !profilesLoading) {
      setCurrentProfile(profile);
    }
  }, [profile, profilesLoading, setCurrentProfile]);

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
              Ce profil n'existe pas ou vous n'avez pas les permissions pour y
              accéder.
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
    <SidebarProvider>
      <ProfileSettingsContent profile={profile} />
    </SidebarProvider>
  );
}
