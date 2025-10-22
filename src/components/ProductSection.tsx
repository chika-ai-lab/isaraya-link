import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const products = [
  {
    name: "iPhone 15 Pro",
    category: "Smartphones",
    price: "899 000 FCFA",
    badge: "Populaire"
  },
  {
    name: "Samsung Galaxy S24",
    category: "Smartphones",
    price: "750 000 FCFA",
    badge: "Nouveau"
  },
  {
    name: "MacBook Air M2",
    category: "Ordinateurs",
    price: "1 200 000 FCFA",
    badge: "Premium"
  },
  {
    name: "AirPods Pro 2",
    category: "Audio",
    price: "185 000 FCFA",
    badge: "Best-seller"
  }
];

const ProductSection = () => {
  return (
    <section className="py-8 px-4 bg-gradient-to-b from-background to-background/50">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
          Produits Phares
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 p-5 hover:bg-card/70 hover:border-secondary/50 transition-all group overflow-hidden relative">
                <Badge className="absolute top-3 right-3 bg-primary/20 text-primary border-primary/30">
                  {product.badge}
                </Badge>
                
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                  ))}
                </div>
                
                <h3 className="font-bold text-xl mb-1 text-foreground">
                  {product.name}
                </h3>
                <p className="text-muted-foreground text-sm mb-3">
                  {product.category}
                </p>
                <p className="text-2xl font-bold text-primary">
                  {product.price}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProductSection;