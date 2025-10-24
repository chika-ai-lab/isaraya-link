import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Profile } from "@/types";

interface AboutSectionProps {
  profile: Profile;
}

const AboutSection = ({ profile }: AboutSectionProps) => {
  if (!profile.description) return null;

  return (
    <section className="py-6 sm:py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-4 sm:p-6 hover:bg-card/70 transition-colors">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">
            À propos de {profile.company_name}
          </h2>
          <p className="text-sm sm:text-base text-foreground/80 leading-relaxed whitespace-pre-wrap">
            {profile.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Innovation
            </span>
            <span className="px-3 py-1 bg-secondary/20 text-secondary rounded-full text-sm font-medium">
              Qualité
            </span>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Service Client
            </span>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default AboutSection;