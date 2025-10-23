import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

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

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('L\'image ne doit pas dépasser 2 MB');
      return;
    }

    setUploading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('profileId', profileId);

      // Upload to local /uploads directory
      // For now, we'll use a data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setPreview(dataUrl);

        // Generate a unique filename
        const timestamp = Date.now();
        const extension = file.name.split('.').pop();
        const filename = `logo-${profileId}-${timestamp}.${extension}`;
        const uploadPath = `/uploads/${filename}`;

        // In production, you would upload to server or cloud storage
        // For now, we'll store the data URL
        onLogoChange(dataUrl);

        toast.success('Logo uploadé avec succès!');
      };
      reader.readAsDataURL(file);

    } catch (error) {
      console.error('Error uploading logo:', error);
      toast.error('Erreur lors de l\'upload du logo');
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
          Uploadez le logo de votre entreprise (format: PNG, JPG, max 2MB)
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
              Taille maximale: 2 MB<br />
              Dimensions recommandées: 400x400 px (carré)
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
