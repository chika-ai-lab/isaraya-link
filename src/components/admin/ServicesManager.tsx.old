import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Plus } from "lucide-react";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const handleAdd = () => {
    const newService: Service = {
      id: crypto.randomUUID(),
      title: "",
      description: "",
      icon: "Smartphone",
      is_active: true,
      display_order: services.length,
    };
    setServices([...services, newService]);
  };

  const handleChange = (id: string, field: keyof Service, value: string | boolean | number) => {
    setServices(services.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = async (service: Service) => {
    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from("services")
        .select("id")
        .eq("id", service.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("services")
          .update({
            title: service.title,
            description: service.description,
            icon: service.icon,
            is_active: service.is_active,
            display_order: service.display_order,
          })
          .eq("id", service.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("services")
          .insert([service]);

        if (error) throw error;
      }

      toast({ title: "Succès", description: "Service enregistré" });
      loadServices();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de l'enregistrement", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;
      
      toast({ title: "Succès", description: "Service supprimé" });
      loadServices();
    } catch (error) {
      toast({ title: "Erreur", description: "Échec de la suppression", variant: "destructive" });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Services</CardTitle>
            <CardDescription>Gérez les services affichés sur votre profil</CardDescription>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Titre</Label>
                  <Input
                    value={service.title}
                    onChange={(e) => handleChange(service.id, "title", e.target.value)}
                    placeholder="Nom du service"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Icône (Lucide)</Label>
                  <Input
                    value={service.icon}
                    onChange={(e) => handleChange(service.id, "icon", e.target.value)}
                    placeholder="Smartphone"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => handleChange(service.id, "description", e.target.value)}
                  placeholder="Description du service"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleSave(service)} disabled={loading}>
                  Enregistrer
                </Button>
                <Button onClick={() => handleDelete(service.id)} variant="destructive">
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