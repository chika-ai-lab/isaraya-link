"use client";
import { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { Loader2, Plus, Pencil, Trash2, Download, QrCode, Phone, Mail, User } from "lucide-react";
import { Commercial, CommercialFormData } from "@/types";
import {
  useCommercials,
  useCreateCommercial,
  useUpdateCommercial,
  useDeleteCommercial,
} from "@/hooks/useCommercials";

interface CommercialsManagerProps {
  profileId: string;
  profileSlug: string;
}

const emptyForm: CommercialFormData = {
  first_name: "",
  last_name: "",
  position: "",
  phone: "",
  email: "",
  photo_url: "",
  bio: "",
  is_active: true,
};

function CommercialQRDialog({
  commercial,
  profileSlug,
  onClose,
}: {
  commercial: Commercial;
  profileSlug: string;
  onClose: () => void;
}) {
  const qrRef = useRef<HTMLDivElement>(null);
  const qrUrl = `${window.location.origin}/${profileSlug}?c=${commercial.id}`;
  const fullName = `${commercial.first_name} ${commercial.last_name}`;

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    canvas.width = 512;
    canvas.height = 512;
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `qrcode-${commercial.first_name}-${commercial.last_name}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>QR Code — {fullName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 py-2">
          <div ref={qrRef} className="p-6 bg-white rounded-xl border-2 border-border">
            <QRCodeSVG value={qrUrl} size={220} level="H" includeMargin fgColor="#0E2043" bgColor="#FFFFFF" />
          </div>
          <p className="text-xs text-muted-foreground text-center break-all">{qrUrl}</p>
          <Button onClick={handleDownload} variant="outline" className="w-full gap-2">
            <Download className="h-4 w-4" />
            Télécharger en PNG
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CommercialFormDialog({
  profileId,
  initial,
  onClose,
}: {
  profileId: string;
  initial?: Commercial;
  onClose: () => void;
}) {
  const [form, setForm] = useState<CommercialFormData>(
    initial
      ? {
          first_name: initial.first_name,
          last_name: initial.last_name,
          position: initial.position ?? "",
          phone: initial.phone ?? "",
          email: initial.email ?? "",
          photo_url: initial.photo_url ?? "",
          bio: initial.bio ?? "",
          is_active: initial.is_active,
        }
      : emptyForm
  );

  const create = useCreateCommercial();
  const update = useUpdateCommercial();
  const isPending = create.isPending || update.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) return;

    if (initial) {
      await update.mutateAsync({ id: initial.id, updates: form });
    } else {
      await create.mutateAsync({ ...form, profile_id: profileId });
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Modifier le commercial" : "Ajouter un commercial"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="first_name">Prénom *</Label>
              <Input
                id="first_name"
                value={form.first_name}
                onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="last_name">Nom *</Label>
              <Input
                id="last_name"
                value={form.last_name}
                onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="position">Poste / Fonction</Label>
            <Input
              id="position"
              value={form.position}
              onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
              placeholder="Ex: Responsable commercial"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio / Description</Label>
            <Textarea
              id="bio"
              rows={3}
              value={form.bio ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Courte présentation du commercial..."
            />
          </div>

          <ImageUpload
            title="Photo du commercial"
            description="Photo de profil (PNG, JPG, max 5MB)"
            folder="commercials"
            maxSizeMB={5}
            aspectRatio="square"
            currentImageUrl={form.photo_url ?? undefined}
            onImageChange={(url) => setForm((f) => ({ ...f, photo_url: url }))}
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {initial ? "Enregistrer" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CommercialsManager({ profileId, profileSlug }: CommercialsManagerProps) {
  const { data: commercials = [], isLoading } = useCommercials(profileId);
  const deleteCommercial = useDeleteCommercial();

  const [formTarget, setFormTarget] = useState<Commercial | null | "new">(null);
  const [qrTarget, setQrTarget] = useState<Commercial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Commercial | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Commerciaux</CardTitle>
              <CardDescription>
                Gérez vos commerciaux et générez leurs QR codes personnalisés.
              </CardDescription>
            </div>
            <Button onClick={() => setFormTarget("new")} className="gap-2">
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {commercials.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <User className="h-10 w-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Aucun commercial ajouté pour l'instant.</p>
              <Button variant="outline" className="mt-4 gap-2" onClick={() => setFormTarget("new")}>
                <Plus className="h-4 w-4" />
                Ajouter le premier commercial
              </Button>
            </div>
          ) : (
            <div className="grid gap-3">
              {commercials.map((c) => {
                const fullName = `${c.first_name} ${c.last_name}`;
                const initials = `${c.first_name?.[0] ?? ""}${c.last_name?.[0] ?? ""}`.toUpperCase();
                const qrUrl = `${window.location.origin}/${profileSlug}?c=${c.id}`;
                return (
                  <div
                    key={c.id}
                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
                  >
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarImage src={c.photo_url ?? undefined} alt={fullName} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold truncate">{fullName}</p>
                        {!c.is_active && <Badge variant="secondary">Inactif</Badge>}
                      </div>
                      {c.position && (
                        <p className="text-sm text-muted-foreground truncate">{c.position}</p>
                      )}
                      <p className="text-xs text-muted-foreground/60 truncate mt-0.5 font-mono">
                        {qrUrl}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
                        {c.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" /> {c.phone}
                          </span>
                        )}
                        {c.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {c.email}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setQrTarget(c)}
                        title="Générer QR code"
                      >
                        <QrCode className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFormTarget(c)}
                        title="Modifier"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteTarget(c)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form dialog */}
      {formTarget !== null && (
        <CommercialFormDialog
          profileId={profileId}
          initial={formTarget === "new" ? undefined : formTarget}
          onClose={() => setFormTarget(null)}
        />
      )}

      {/* QR dialog */}
      {qrTarget && (
        <CommercialQRDialog
          commercial={qrTarget}
          profileSlug={profileSlug}
          onClose={() => setQrTarget(null)}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <AlertDialog open onOpenChange={() => setDeleteTarget(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Supprimer ce commercial ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le commercial{" "}
                <strong>
                  {deleteTarget.first_name} {deleteTarget.last_name}
                </strong>{" "}
                sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive hover:bg-destructive/90"
                onClick={() => {
                  deleteCommercial.mutate({ id: deleteTarget.id, profileId });
                  setDeleteTarget(null);
                }}
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
