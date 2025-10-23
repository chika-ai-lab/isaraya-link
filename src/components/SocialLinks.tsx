import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

interface SocialLinksProps {
  profile: Profile;
}

// TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const SocialLinks = ({ profile }: SocialLinksProps) => {
  const socials = [
    profile.facebook && {
      icon: Facebook,
      name: "Facebook",
      href: profile.facebook.startsWith('http') ? profile.facebook : `https://facebook.com/${profile.facebook.replace('@', '')}`,
    },
    profile.instagram && {
      icon: Instagram,
      name: "Instagram",
      href: profile.instagram.startsWith('http') ? profile.instagram : `https://instagram.com/${profile.instagram.replace('@', '')}`,
    },
    profile.twitter && {
      icon: Twitter,
      name: "Twitter",
      href: profile.twitter.startsWith('http') ? profile.twitter : `https://twitter.com/${profile.twitter.replace('@', '')}`,
    },
    profile.tiktok && {
      icon: TikTokIcon,
      name: "TikTok",
      href: profile.tiktok.startsWith('http') ? profile.tiktok : `https://tiktok.com/@${profile.tiktok.replace('@', '')}`,
    },
    profile.youtube && {
      icon: Youtube,
      name: "YouTube",
      href: profile.youtube.startsWith('http') ? profile.youtube : `https://youtube.com/@${profile.youtube.replace('@', '')}`,
    },
    profile.linkedin && {
      icon: Linkedin,
      name: "LinkedIn",
      href: profile.linkedin.startsWith('http') ? profile.linkedin : `https://linkedin.com/company/${profile.linkedin.replace('@', '')}`,
    }
  ].filter(Boolean);

  if (socials.length === 0) return null;
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
                className="w-14 h-14 rounded-full bg-primary/10 backdrop-blur-sm border-2 border-primary/30 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all text-primary"
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
        
        {profile.company_name && (
          <p className="text-center mt-4 text-muted-foreground text-sm">
            @{profile.company_name.toLowerCase().replace(/\s+/g, '')}
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default SocialLinks;