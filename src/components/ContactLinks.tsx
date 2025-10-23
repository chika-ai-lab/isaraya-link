import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

interface ContactLinksProps {
  profile: Profile;
}

const ContactLinks = ({ profile }: ContactLinksProps) => {
  const contacts = [
    profile.phone && {
      icon: Phone,
      label: "Téléphone",
      value: profile.phone,
      href: `tel:${profile.phone.replace(/\s/g, "")}`,
      color: "text-primary",
    },
    profile.email && {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
      color: "text-secondary",
    },
    profile.address && {
      icon: MapPin,
      label: "Adresse",
      value: profile.address,
      href:
        profile.google_maps_url ||
        `https://maps.google.com/?q=${encodeURIComponent(profile.address)}`,
      color: "text-primary",
    },
    profile.website && {
      icon: Globe,
      label: "Site Web",
      value: profile.website,
      href: profile.website.startsWith("http")
        ? profile.website
        : `https://${profile.website}`,
      color: "text-secondary",
    },
  ].filter(Boolean);

  if (contacts.length === 0) return null;
  return (
    <section className="py-8 px-4">
      <motion.div
        className="max-w-2xl mx-auto  gap-3 grid grid-cols-1 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 + index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Button
              asChild
              variant="outline"
              className="w-full h-auto py-4 px-6 justify-start gap-4 border-border/50 bg-card/50 backdrop-blur-sm hover:bg-card/70 hover:border-primary/50 transition-all group"
            >
              <a href={contact.href} target="_blank" rel="noopener noreferrer">
                <div
                  className={`${contact.color} group-hover:scale-110 transition-transform`}
                >
                  <contact.icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-muted-foreground">
                    {contact.label}
                  </div>
                  <div className="font-semibold text-foreground">
                    {contact.value}
                  </div>
                </div>
              </a>
            </Button>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ContactLinks;
