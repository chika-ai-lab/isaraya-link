import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Product } from "@/types";

interface ProductSectionProps {
  products: Product[];
}

const ProductSection = ({ products }: ProductSectionProps) => {
  if (products.length === 0) return null;

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
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden hover:bg-card/70 hover:border-secondary/50 transition-all group h-full">
                {product.image_url && (
                  <div className="aspect-square bg-muted overflow-hidden">
                    <img
                      src={product.image_url}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-5">
                  {product.is_featured && (
                    <Badge className="mb-2 bg-primary/20 text-primary border-primary/30">
                      Vedette
                    </Badge>
                  )}

                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3 h-3 fill-primary text-primary"
                      />
                    ))}
                  </div>

                  <h3 className="font-bold text-xl mb-1 text-foreground">
                    {product.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  {product.price && (
                    <p className="text-2xl font-bold text-primary">
                      {product.price}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ProductSection;
