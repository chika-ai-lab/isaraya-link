import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary, UploadOptions } from "@/lib/cloudinary";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageChange: (imageUrl: string, publicId?: string) => void;
  title?: string;
  description?: string;
  folder?: string;
  maxSizeMB?: number;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  showPreview?: boolean;
}

export function ImageUpload({
  currentImageUrl,
  onImageChange,
  title = "Image",
  description = "Uploadez une image (format: PNG, JPG, max 10MB)",
  folder = "general",
  maxSizeMB = 10,
  aspectRatio = "auto",
  showPreview = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "landscape":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return "";
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Validate file size
    const maxSize = maxSizeMB * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`L'image ne doit pas dépasser ${maxSizeMB} MB`);
      return;
    }

    setUploading(true);

    try {
      // Create local preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Cloudinary
      const uploadOptions: UploadOptions = {
        folder: folder,
        tags: [folder],
      };

      const result = await uploadToCloudinary(file, uploadOptions);

      // Update with Cloudinary URL
      setPreview(result.secure_url);
      setPublicId(result.public_id);
      onImageChange(result.secure_url, result.public_id);

      toast.success('Image uploadée avec succès!');
    } catch (error) {
      console.error('Error uploading image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload';
      toast.error(errorMessage);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setPublicId(null);
    onImageChange('', undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Image supprimée');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Preview */}
          {showPreview && (
            <>
              {preview ? (
                <div className={`relative w-full max-w-md mx-auto ${getAspectRatioClass()}`}>
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg border-2 border-border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className={`w-full max-w-md mx-auto border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50 ${getAspectRatioClass() || 'min-h-[200px]'}`}>
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
            </>
          )}

          {/* Upload Button */}
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  {preview ? 'Changer l\'image' : 'Uploader une image'}
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Formats acceptés: JPG, PNG, GIF, WebP<br />
              Taille maximale: {maxSizeMB} MB<br />
              {aspectRatio === "square" && "Dimensions recommandées: Format carré (ex: 400x400 px)"}
              {aspectRatio === "landscape" && "Dimensions recommandées: Format paysage (ex: 1200x600 px)"}
              {aspectRatio === "portrait" && "Dimensions recommandées: Format portrait (ex: 600x800 px)"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
