import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Smartphone, Laptop, Headphones, ShoppingBag } from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Smartphones & Accessoires",
    description: "Derniers modèles et accessoires tendance"
  },
  {
    icon: Laptop,
    title: "Informatique",
    description: "Ordinateurs, tablettes et périphériques"
  },
  {
    icon: Headphones,
    title: "Audio & Gaming",
    description: "Casques, enceintes et consoles"
  },
  {
    icon: ShoppingBag,
    title: "Service Après-Vente",
    description: "Garantie et support technique"
  }
];

const ServiceSection = () => {
  return (
    <section className="py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Nos Services
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-6 h-full hover:bg-card/70 hover:border-primary/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/20 rounded-lg group-hover:bg-primary/30 transition-colors">
                    <service.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">
                      {service.title}
                    </h3>
                    <p className="text-foreground/70 text-sm">
                      {service.description}
                    </p>
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

export default ServiceSection;