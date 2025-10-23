import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

interface WhatsAppButtonProps {
  profile: Profile;
}

const WhatsAppButton = ({ profile }: WhatsAppButtonProps) => {
  if (!profile.whatsapp) return null;

  const message = `Bonjour ${profile.company_name}, je souhaite obtenir plus d'informations`;
  const whatsappUrl = `https://wa.me/${profile.whatsapp.replace(/\s/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        asChild
        size="lg"
        className="rounded-full h-16 w-16 shadow-2xl bg-[#25D366] hover:bg-[#20BA5A] text-white border-none p-0"
      >
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle className="w-8 h-8" />
        </a>
      </Button>
      
      <motion.div
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
};

export default WhatsAppButton;