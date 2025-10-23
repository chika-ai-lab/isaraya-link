import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_text: string | null;
  is_active: boolean;
  valid_until: string | null;
  display_order: number;
}

export function PromotionsManager() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setPromotions(data || []);
    } catch (error) {
      console.error("Error loading promotions:", error);
    }
  };

  const handleAdd = () => {
    const newPromotion: Promotion = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      discount_text: null,
      is_active: true,
      valid_until: null,
      display_order: promotions.length,
    };
    setPromotions([...promotions, newPromotion]);
  };

  const handleChange = (id: string, field: keyof Promotion, value: string | boolean | number | null) => {
    setPromotions(promotions.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleSave = async (promotion: Promotion) => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("promotions")
        .select("id")
        .eq("id", promotion.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("promotions")
          .update({
            title: promotion.title,
            description: promotion.description,
            discount_text: promotion.discount_text,
            is_active: promotion.is_active,
            valid_until: promotion.valid_until,
            display_order: promotion.display_order,
          })
          .eq("id", promotion.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("promotions")
          .insert([promotion]);

        if (error) throw error;
      }

      toast({ title: "Succès", description: "Promotion enregistrée" });
      loadPromotions();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'enregistrement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
      
      toast({ title: "Succès", description: "Promotion supprimée" });
      loadPromotions();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Promotions</CardTitle>
            <CardDescription>Gérez les promotions affichées sur votre profil</CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {promotions.map((promotion) => (
          <Card key={promotion.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={promotion.title}
                    onChange={(e) => handleChange(promotion.id, "title", e.target.value)}
                    placeholder="Nom de la promotion"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Texte de réduction</Label>
                  <Input
                    value={promotion.discount_text || ""}
                    onChange={(e) => handleChange(promotion.id, "discount_text", e.target.value)}
                    placeholder="-15%"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={promotion.description}
                  onChange={(e) => handleChange(promotion.id, "description", e.target.value)}
                  placeholder="Description de la promotion"
                />
              </div>
              <div className="space-y-2">
                <Label>Valide jusqu'au</Label>
                <Input
                  type="date"
                  value={promotion.valid_until || ""}
                  onChange={(e) => handleChange(promotion.id, "valid_until", e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave(promotion)} disabled={loading}>
                  Enregistrer
                </Button>
                <Button onClick={() => handleDelete(promotion.id)} variant="destructive">
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