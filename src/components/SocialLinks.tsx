import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const socials = [
  { icon: Facebook, name: "Facebook", href: "https://facebook.com/isaraya", color: "hover:text-[#1877F2]" },
  { icon: Instagram, name: "Instagram", href: "https://instagram.com/isaraya", color: "hover:text-[#E4405F]" },
  { icon: Twitter, name: "Twitter", href: "https://twitter.com/isaraya", color: "hover:text-[#1DA1F2]" },
  { icon: Linkedin, name: "LinkedIn", href: "https://linkedin.com/company/isaraya", color: "hover:text-[#0A66C2]" }
];

const SocialLinks = () => {
  return (
    <section className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
        className="max-w-2xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          Suivez-nous
        </h2>
        
        <div className="flex justify-center gap-4">
          {socials.map((social, index) => (
            <motion.div
              key={social.name}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.4 + index * 0.1, type: "spring" }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                size="icon"
                className={`w-14 h-14 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card/80 hover:border-primary/50 transition-all ${social.color}`}
              >
                <a 
                  href={social.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              </Button>
            </motion.div>
          ))}
        </div>
        
        <p className="text-center mt-4 text-muted-foreground text-sm">
          @isaraya
        </p>
      </motion.div>
    </section>
  );
};

export default SocialLinks;