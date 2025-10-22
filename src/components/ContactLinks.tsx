import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const contacts = [
  {
    icon: Phone,
    label: "Téléphone",
    value: "77 415 65 65",
    href: "tel:+221774156565",
    color: "text-primary"
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@saraya.tech",
    href: "mailto:info@saraya.tech",
    color: "text-secondary"
  },
  {
    icon: MapPin,
    label: "Adresse",
    value: "Dakar, Liberté 4",
    href: "https://maps.google.com/?q=Dakar+Liberté+4",
    color: "text-primary"
  },
  {
    icon: Globe,
    label: "Site Web",
    value: "www.isaraya.tech",
    href: "https://www.isaraya.tech",
    color: "text-secondary"
  }
];

const ContactLinks = () => {
  return (
    <section className="py-8 px-4">
      <motion.div 
        className="max-w-2xl mx-auto space-y-3"
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
                <div className={`${contact.color} group-hover:scale-110 transition-transform`}>
                  <contact.icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-xs text-muted-foreground">{contact.label}</div>
                  <div className="font-semibold text-foreground">{contact.value}</div>
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