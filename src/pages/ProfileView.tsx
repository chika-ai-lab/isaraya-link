import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, Loader2 } from "lucide-react";
import { useProfileBySlug } from "@/hooks/useProfiles";
import { usePublicProducts } from "@/hooks/useProducts";
import { usePublicServices } from "@/hooks/useServices";
import { usePublicPromotions } from "@/hooks/usePromotions";
import { useProfileTheme } from "@/hooks/useProfileTheme";
import ProfileHeader from "@/components/ProfileHeader";
import ContactLinks from "@/components/ContactLinks";
import SocialLinks from "@/components/SocialLinks";
import AboutSection from "@/components/AboutSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import PromotionSection from "@/components/PromotionSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import NotFound from "./NotFound";

const ProfileView = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: profile, isLoading, error } = useProfileBySlug(slug);
  const { data: products = [] } = usePublicProducts(profile?.id);
  const { data: services = [] } = usePublicServices(profile?.id);
  const { data: promotions = [] } = usePublicPromotions(profile?.id);

  // Appliquer le thème personnalisé du profil
  useProfileTheme(profile);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background via-background to-background/95">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 font-['Inter',sans-serif]">
      <div className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50">
        <Link to="/auth">
          <Button variant="outline" size="icon" className="h-9 w-9 sm:h-10 sm:w-10">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <main className="relative max-w-6xl mx-auto pb-20 sm:pb-24">
        <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

        <ProfileHeader profile={profile} />
        <ContactLinks profile={profile} />
        <SocialLinks profile={profile} />
        <AboutSection profile={profile} />
        <ServiceSection services={services} />
        <ProductSection products={products} />
        <PromotionSection promotions={promotions} />
      </main>

      <WhatsAppButton profile={profile} />

      <footer className="text-center py-6 sm:py-8 px-4 text-muted-foreground text-xs sm:text-sm border-t border-border/30">
        <p>© 2025 {profile.company_name}. Tous droits réservés.</p>
        {(profile.address || profile.phone) && (
          <p className="mt-2 break-words">
            {profile.address && profile.address}
            {profile.address && profile.phone && ' - '}
            {profile.phone && profile.phone}
          </p>
        )}
      </footer>
    </div>
  );
};

export default ProfileView;
