import { useState } from 'react';
import { usePromotions, useCreatePromotion, useUpdatePromotion, useDeletePromotion } from '@/hooks/usePromotions';
import { Promotion } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Edit, Trash2, Tag } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PromotionsManagerProps {
  profileId: string;
}

export function PromotionsManager({ profileId }: PromotionsManagerProps) {
  const { data: promotions = [], isLoading } = usePromotions(profileId);
  const createPromotion = useCreatePromotion();
  const updatePromotion = useUpdatePromotion();
  const deletePromotion = useDeletePromotion();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount_text: '',
    valid_until: '',
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount_text: '',
      valid_until: '',
      is_active: true,
    });
    setEditingPromotion(null);
  };

  const handleOpenDialog = (promotion?: Promotion) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        title: promotion.title,
        description: promotion.description,
        discount_text: promotion.discount_text || '',
        valid_until: promotion.valid_until ? new Date(promotion.valid_until).toISOString().split('T')[0] : '',
        is_active: promotion.is_active ?? true,
      });
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const promotionData = {
        ...formData,
        valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
      };

      if (editingPromotion) {
        await updatePromotion.mutateAsync({
          id: editingPromotion.id,
          updates: promotionData,
        });
      } else {
        await createPromotion.mutateAsync({
          ...promotionData,
          profile_id: profileId,
          display_order: promotions.length,
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving promotion:', error);
    }
  };

  const handleDelete = async (promotion: Promotion) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${promotion.title}"?`)) {
      await deletePromotion.mutateAsync({ id: promotion.id, profileId });
    }
  };

  const isPromotionValid = (promotion: Promotion) => {
    if (!promotion.valid_until) return true;
    return new Date(promotion.valid_until) > new Date();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Promotions</CardTitle>
              <CardDescription>
                Gérez les promotions et offres spéciales de votre entreprise
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter une promotion
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingPromotion ? 'Modifier la promotion' : 'Nouvelle promotion'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingPromotion
                        ? 'Modifiez les informations de la promotion'
                        : 'Créez une nouvelle promotion pour attirer vos clients'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        placeholder="Ex: Promo Rentrée"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discount_text">Texte de réduction</Label>
                      <Input
                        id="discount_text"
                        placeholder="Ex: -15%, Offre 2+1, etc."
                        value={formData.discount_text}
                        onChange={(e) => setFormData({ ...formData, discount_text: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="valid_until">Valide jusqu'au</Label>
                      <Input
                        id="valid_until"
                        type="date"
                        value={formData.valid_until}
                        onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">Active</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setDialogOpen(false);
                        resetForm();
                      }}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      disabled={createPromotion.isPending || updatePromotion.isPending}
                    >
                      {(createPromotion.isPending || updatePromotion.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingPromotion ? 'Mettre à jour' : 'Créer'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {promotions.length === 0 ? (
            <Alert>
              <Tag className="h-4 w-4" />
              <AlertDescription>
                Aucune promotion pour le moment. Cliquez sur "Ajouter une promotion" pour commencer.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <Card key={promotion.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg">{promotion.title}</CardTitle>
                          {promotion.discount_text && (
                            <Badge>{promotion.discount_text}</Badge>
                          )}
                          {!promotion.is_active && (
                            <Badge variant="outline">Inactive</Badge>
                          )}
                          {promotion.valid_until && !isPromotionValid(promotion) && (
                            <Badge variant="destructive">Expirée</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1">
                          {promotion.description}
                        </CardDescription>
                        {promotion.valid_until && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Valide jusqu'au: {new Date(promotion.valid_until).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(promotion)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(promotion)}
                          disabled={deletePromotion.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
