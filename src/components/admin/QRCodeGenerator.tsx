import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Download, Copy } from "lucide-react";
import { Profile } from "@/types";

interface QRCodeGeneratorProps {
  profile: Profile;
}

export function QRCodeGenerator({ profile }: QRCodeGeneratorProps) {
  const profileUrl = `${window.location.origin}/${profile.slug}`;
  const [url, setUrl] = useState(profileUrl);
  const [size, setSize] = useState(512);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    canvas.width = size;
    canvas.height = size;

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
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL de votre profil</Label>
            <div className="flex gap-2">
              <Input
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder={profileUrl}
                className="flex-1"
              />
              <Button onClick={handleCopyUrl} variant="outline" size="icon">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Votre profil est accessible à: <strong className="text-primary">{profileUrl}</strong>
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="size">Taille (px)</Label>
            <Input
              id="size"
              type="number"
              min="128"
              max="1024"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
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
              size={Math.min(size, 400)}
              level="H"
              includeMargin
              fgColor="#0E2043"
              bgColor="#FFFFFF"
            />
          </div>

          <Button onClick={handleDownload} size="lg">
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
      </CardContent>
    </Card>
  );
}