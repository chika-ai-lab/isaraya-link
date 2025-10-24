import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { uploadToCloudinary } from "@/lib/cloudinary";

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoChange: (logoUrl: string) => void;
  profileId: string;
}

export function LogoUpload({ currentLogoUrl, onLogoChange, profileId }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 5 MB');
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
      const result = await uploadToCloudinary(file, {
        folder: 'logos',
        tags: ['logo', profileId],
      });

      // Update with Cloudinary URL
      setPreview(result.secure_url);
      onLogoChange(result.secure_url);

      toast.success('Logo uploadé avec succès!');
    } catch (error) {
      console.error('Error uploading logo:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de l\'upload du logo';
      toast.error(errorMessage);
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setPreview(null);
    onLogoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    toast.success('Logo supprimé');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Logo de l'entreprise</CardTitle>
        <CardDescription>
          Uploadez le logo de votre entreprise (format: PNG, JPG, max 5MB)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Preview */}
          {preview ? (
            <div className="relative w-40 h-40 mx-auto">
              <img
                src={preview}
                alt="Logo preview"
                className="w-full h-full object-contain rounded-lg border-2 border-border"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                onClick={handleRemoveLogo}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="w-40 h-40 mx-auto border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Upload Button */}
          <div className="flex justify-center">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
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
                  {preview ? 'Changer le logo' : 'Uploader un logo'}
                </>
              )}
            </Button>
          </div>

          {/* Info */}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              Formats acceptés: JPG, PNG, GIF<br />
              Taille maximale: 5 MB<br />
              Dimensions recommandées: 400x400 px (carré)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
