import { useState, useRef, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Copy, Loader2 } from "lucide-react";
import { Profile } from "@/types";
import { useUpdateProfile } from "@/hooks/useProfiles";

interface QRCodeGeneratorProps {
  profile: Profile;
}

export function QRCodeGenerator({ profile }: QRCodeGeneratorProps) {
  const profileUrl = `${window.location.origin}/${profile.slug}`;
  const updateProfile = useUpdateProfile();
  const [url, setUrl] = useState(profileUrl);
  const [qrCodeSize, setQrCodeSize] = useState(profile.qr_code_size || 512);
  const [customUrl, setCustomUrl] = useState(profile.qr_code_custom_url || "");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQrCodeSize(profile.qr_code_size || 512);
    setCustomUrl(profile.qr_code_custom_url || "");
    setUrl(profile.qr_code_custom_url || profileUrl);
  }, [profile, profileUrl]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setCustomUrl(newUrl);
    setUrl(newUrl || profileUrl);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQrCodeSize(parseInt(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await updateProfile.mutateAsync({
        id: profile.id,
        updates: {
          qr_code_size: qrCodeSize,
          qr_code_custom_url: customUrl || null,
        },
      });
      toast.success("Paramètres du QR Code enregistrés avec succès!");
    } catch (error) {
      console.error("Error updating QR Code settings:", error);
      toast.error("Erreur lors de l'enregistrement des paramètres");
    }
  };

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = qrCodeSize;
    canvas.height = qrCodeSize;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) {
          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = `${profile.slug}-qrcode.png`;
          link.href = blobUrl;
          link.click();
          URL.revokeObjectURL(blobUrl);

          toast.success("QR Code téléchargé avec succès!");
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("URL copiée dans le presse-papier!");
    } catch (error) {
      toast.error("Impossible de copier l'URL");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générateur de QR Code</CardTitle>
        <CardDescription>
          Générez un QR code pour partager votre profil {profile.company_name}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">URL de votre profil</Label>
              <div className="flex gap-2">
                <Input
                  id="url"
                  value={customUrl}
                  onChange={handleUrlChange}
                  placeholder={profileUrl}
                  className="flex-1"
                />
                <Button onClick={handleCopyUrl} type="button" variant="outline" size="icon">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                URL par défaut: <strong className="text-primary">{profileUrl}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                Laissez vide pour utiliser l'URL par défaut, ou entrez une URL personnalisée
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Taille (px)</Label>
              <Input
                id="size"
                type="number"
                min="128"
                max="1024"
                value={qrCodeSize}
                onChange={handleSizeChange}
              />
            </div>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <div
              ref={qrRef}
              className="p-8 bg-white rounded-lg border-2 border-border"
            >
              <QRCodeSVG
                value={url}
                size={Math.min(qrCodeSize, 400)}
                level="H"
                includeMargin
                fgColor="#0E2043"
                bgColor="#FFFFFF"
              />
            </div>

            <Button onClick={handleDownload} type="button" size="lg" variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Télécharger en PNG
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">
              Ce QR code peut être imprimé sur des cartes de visite, affiches, ou tout autre support marketing.
              Lorsqu'il est scanné, il redirige directement vers votre profil Isaraya.
            </p>
          </div>

          <Button type="submit" disabled={updateProfile.isPending} className="w-full">
            {updateProfile.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              "Enregistrer les modifications"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}