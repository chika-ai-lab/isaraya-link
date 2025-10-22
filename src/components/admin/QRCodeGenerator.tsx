import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Download } from "lucide-react";

export function QRCodeGenerator() {
  const [url, setUrl] = useState(window.location.origin);
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
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.download = "isaraya-qrcode.png";
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          
          toast({
            title: "Succès",
            description: "QR Code téléchargé",
          });
        }
      });
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Générateur de QR Code</CardTitle>
        <CardDescription>
          Générez un QR code pour votre profil Isaraya
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL du profil</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={window.location.origin}
            />
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