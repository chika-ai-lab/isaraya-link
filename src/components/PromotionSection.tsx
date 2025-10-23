import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { Promotion } from "@/types";

interface PromotionSectionProps {
  promotions: Promotion[];
}

const PromotionSection = ({ promotions }: PromotionSectionProps) => {
  if (promotions.length === 0) return null;

  return (
    <section className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Promotions du Moment
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-5 hover:bg-card/70 hover:border-secondary/50 transition-all group overflow-hidden relative">
                {promo.discount_text && (
                  <Badge className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30">
                    {promo.discount_text}
                  </Badge>
                )}

                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl text-foreground">
                    {promo.title}
                  </h3>
                </div>

                <p className="text-foreground/70 mb-3">{promo.description}</p>

                {promo.valid_until && (
                  <p className="text-xs text-muted-foreground">
                    Valide jusqu'au{" "}
                    {new Date(promo.valid_until).toLocaleDateString("fr-FR")}
                  </p>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PromotionSection;
