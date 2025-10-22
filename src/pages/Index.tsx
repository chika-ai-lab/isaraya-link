import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ProfileHeader from "@/components/ProfileHeader";
import ContactLinks from "@/components/ContactLinks";
import SocialLinks from "@/components/SocialLinks";
import AboutSection from "@/components/AboutSection";
import ServiceSection from "@/components/ServiceSection";
import ProductSection from "@/components/ProductSection";
import PromotionSection from "@/components/PromotionSection";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useCompanyInfo, useServices, useProducts, usePromotions } from "@/hooks/useCompanyInfo";

const Index = () => {
  const { data: companyInfo } = useCompanyInfo();
  const { data: services } = useServices();
  const { data: products } = useProducts();
  const { data: promotions } = usePromotions();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95 font-['Inter',sans-serif]">
      <div className="fixed top-4 right-4 z-50">
        <Link to="/auth">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <main className="relative max-w-6xl mx-auto pb-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -z-10" />
        
        <ProfileHeader />
        <ContactLinks />
        <SocialLinks />
        <AboutSection />
        <ServiceSection />
        <ProductSection />
        <PromotionSection />
      </main>
      
      <WhatsAppButton />
      
      <footer className="text-center py-8 text-muted-foreground text-sm border-t border-border/30">
        <p>© 2025 Isaraya. Tous droits réservés.</p>
        <p className="mt-2">Dakar, Sénégal - 77 415 65 65</p>
      </footer>
    </div>
  );
};

export default Index;