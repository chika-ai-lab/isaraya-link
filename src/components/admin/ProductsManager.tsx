import { useState } from "react";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/hooks/useProducts";
import { Product } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Package,
  Upload,
  X,
  Image as ImageIcon,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { toast } from "sonner";

interface ProductsManagerProps {
  profileId: string;
}

export function ProductsManager({ profileId }: ProductsManagerProps) {
  const { data: products = [], isLoading } = useProducts(profileId);
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image_url: "",
    is_featured: false,
    is_active: true,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price: "",
      image_url: "",
      is_featured: false,
      is_active: true,
    });
    setEditingProduct(null);
    setImagePreview(null);
  };

  const handleOpenDialog = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price || "",
        image_url: product.image_url || "",
        is_featured: product.is_featured || false,
        is_active: product.is_active ?? true,
      });
      setImagePreview(product.image_url || null);
    } else {
      resetForm();
    }
    setDialogOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 10 MB");
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      const result = await uploadToCloudinary(file, {
        folder: "products",
        tags: ["product", profileId],
      });

      setFormData({ ...formData, image_url: result.secure_url });
      setImagePreview(result.secure_url);
      toast.success("Image uploadée avec succès!");
    } catch (error) {
      console.error("Error uploading image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Erreur lors de l'upload";
      toast.error(errorMessage);
      setImagePreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData({ ...formData, image_url: "" });
    setImagePreview(null);
    toast.success("Image supprimée");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct.id,
          updates: formData,
        });
      } else {
        await createProduct.mutateAsync({
          ...formData,
          profile_id: profileId,
          display_order: products.length,
        });
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDelete = async (product: Product) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${product.title}"?`)) {
      await deleteProduct.mutateAsync({ id: product.id, profileId });
    }
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
              <CardTitle>Produits</CardTitle>
              <CardDescription>
                Gérez les produits de votre profil d'entreprise
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un produit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                  <DialogHeader>
                    <DialogTitle>
                      {editingProduct
                        ? "Modifier le produit"
                        : "Nouveau produit"}
                    </DialogTitle>
                    <DialogDescription>
                      {editingProduct
                        ? "Modifiez les informations du produit"
                        : "Ajoutez un nouveau produit à votre catalogue"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4 overflow-y-auto">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        required
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="price">Prix</Label>
                      <Input
                        id="price"
                        placeholder="Ex: 50 000 FCFA"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Image du produit</Label>
                      {imagePreview ? (
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-border">
                          <img
                            src={imagePreview}
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 rounded-full"
                            onClick={handleRemoveImage}
                            disabled={uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-full aspect-video rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50">
                          <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="product-image-upload"
                          disabled={uploading}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() =>
                            document
                              .getElementById("product-image-upload")
                              ?.click()
                          }
                          disabled={uploading}
                          className="w-full"
                        >
                          {uploading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Upload en cours...
                            </>
                          ) : (
                            <>
                              <Upload className="mr-2 h-4 w-4" />
                              {imagePreview
                                ? "Changer l'image"
                                : "Uploader une image"}
                            </>
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Formats acceptés: JPG, PNG, GIF. Max 10 MB
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_featured">Produit vedette</Label>
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_featured: checked })
                        }
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="is_active">Actif</Label>
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, is_active: checked })
                        }
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
                      disabled={
                        createProduct.isPending || updateProduct.isPending
                      }
                    >
                      {(createProduct.isPending || updateProduct.isPending) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {editingProduct ? "Mettre à jour" : "Créer"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <Alert>
              <Package className="h-4 w-4" />
              <AlertDescription>
                Aucun produit pour le moment. Cliquez sur "Ajouter un produit"
                pour commencer.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      {product.image_url && (
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 border-border bg-muted">
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <CardTitle className="text-lg">
                            {product.title}
                          </CardTitle>
                          {product.is_featured && (
                            <Badge variant="secondary">Vedette</Badge>
                          )}
                          {!product.is_active && (
                            <Badge variant="outline">Inactif</Badge>
                          )}
                        </div>
                        <CardDescription className="mt-1 line-clamp-2">
                          {product.description}
                        </CardDescription>
                        {product.price && (
                          <p className="text-sm font-medium mt-2">
                            {product.price}
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product)}
                          disabled={deleteProduct.isPending}
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
