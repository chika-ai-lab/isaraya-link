import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export function ProductsManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  const handleAdd = () => {
    const newProduct: Product = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      price: "",
      image_url: null,
      is_featured: false,
      is_active: true,
      display_order: products.length,
    };
    setProducts([...products, newProduct]);
  };

  const handleChange = (id: string, field: keyof Product, value: string | boolean | number | null) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = async (product: Product) => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("products")
        .select("id")
        .eq("id", product.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("products")
          .update({
            title: product.title,
            description: product.description,
            price: product.price,
            image_url: product.image_url,
            is_featured: product.is_featured,
            is_active: product.is_active,
            display_order: product.display_order,
          })
          .eq("id", product.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("products")
          .insert([product]);

        if (error) throw error;
      }

      toast({ title: "Succès", description: "Produit enregistré" });
      loadProducts();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'enregistrement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
      
      toast({ title: "Succès", description: "Produit supprimé" });
      loadProducts();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Produits</CardTitle>
            <CardDescription>Gérez les produits affichés sur votre profil</CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={product.title}
                    onChange={(e) => handleChange(product.id, "title", e.target.value)}
                    placeholder="Nom du produit"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Prix</Label>
                  <Input
                    value={product.price}
                    onChange={(e) => handleChange(product.id, "price", e.target.value)}
                    placeholder="Prix"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={product.description}
                  onChange={(e) => handleChange(product.id, "description", e.target.value)}
                  placeholder="Description du produit"
                />
              </div>
              <div className="space-y-2">
                <Label>URL de l'image</Label>
                <Input
                  value={product.image_url || ""}
                  onChange={(e) => handleChange(product.id, "image_url", e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={product.is_featured}
                  onChange={(e) => handleChange(product.id, "is_featured", e.target.checked)}
                  id={`featured-${product.id}`}
                />
                <Label htmlFor={`featured-${product.id}`}>Produit phare</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave(product)} disabled={loading}>
                  Enregistrer
                </Button>
                <Button onClick={() => handleDelete(product.id)} variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}