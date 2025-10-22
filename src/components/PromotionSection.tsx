import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Zap, Gift } from "lucide-react";

const promotions = [
  {
    icon: Sparkles,
    title: "Offre de Bienvenue",
    description: "10% de réduction sur votre premier achat",
    code: "WELCOME10",
    color: "text-primary"
  },
  {
    icon: Zap,
    title: "Flash Sale",
    description: "Jusqu'à 30% sur une sélection d'articles",
    code: "FLASH30",
    color: "text-secondary"
  },
  {
    icon: Gift,
    title: "Cadeau Mystère",
    description: "Un cadeau offert pour tout achat de 500 000 FCFA",
    code: "GIFT500",
    color: "text-primary"
  }
];

const PromotionSection = () => {
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
        
        <div className="space-y-4">
          {promotions.map((promo, index) => (
            <motion.div
              key={promo.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5 }}
            >
              <Card className="bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-sm border-border/50 p-6 hover:border-primary/50 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`p-4 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors ${promo.color}`}>
                    <promo.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1 text-foreground">
                      {promo.title}
                    </h3>
                    <p className="text-foreground/70 mb-2">
                      {promo.description}
                    </p>
                    <Badge variant="outline" className="border-primary text-primary font-mono">
                      Code: {promo.code}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default PromotionSection;