import { useState, useEffect } from 'react';
import { useCreateProfile, useGenerateSlug, useCheckSlugAvailability } from '@/hooks/useProfiles';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check, X } from 'lucide-react';

interface CreateProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateProfileDialog = ({ open, onOpenChange }: CreateProfileDialogProps) => {
  const [companyName, setCompanyName] = useState('');
  const [slug, setSlug] = useState('');
  const [slogan, setSlogan] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [slugCheckResult, setSlugCheckResult] = useState<boolean | null>(null);

  const createProfile = useCreateProfile();
  const generateSlug = useGenerateSlug();
  const checkSlug = useCheckSlugAvailability();

  // Auto-générer le slug quand le nom de l'entreprise change
  useEffect(() => {
    if (companyName && !slugManuallyEdited) {
      const timeoutId = setTimeout(async () => {
        try {
          const generatedSlug = await generateSlug.mutateAsync(companyName);
          setSlug(generatedSlug);
        } catch (error) {
          console.error('Error generating slug:', error);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [companyName, slugManuallyEdited]);

  // Vérifier la disponibilité du slug
  useEffect(() => {
    if (slug && slug.length >= 3) {
      const timeoutId = setTimeout(async () => {
        try {
          const isAvailable = await checkSlug.mutateAsync({ slug });
          setSlugCheckResult(isAvailable);
        } catch (error) {
          console.error('Error checking slug:', error);
          setSlugCheckResult(null);
        }
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSlugCheckResult(null);
    }
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Vérifier une dernière fois le slug avant la soumission
    if (!slug || slug.length < 3) {
      return;
    }

    // Si le slug n'a pas été vérifié ou n'est pas disponible, bloquer
    if (slugCheckResult === false) {
      return;
    }

    try {
      // Si on n'a pas encore de résultat, vérifier maintenant
      if (slugCheckResult === null) {
        const isAvailable = await checkSlug.mutateAsync({ slug });
        if (!isAvailable) {
          setSlugCheckResult(false);
          return;
        }
      }

      await createProfile.mutateAsync({
        company_name: companyName,
        slug,
        slogan: slogan || '',
        email: email || '',
        phone: phone || '',
        is_active: true,
      });

      // Reset form
      setCompanyName('');
      setSlug('');
      setSlogan('');
      setEmail('');
      setPhone('');
      setSlugManuallyEdited(false);
      setSlugCheckResult(null);
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    // Nettoyer le slug (lowercase, alphanumerique + tirets)
    const cleanedSlug = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    setSlug(cleanedSlug);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Créer un nouveau profil</DialogTitle>
          <DialogDescription>
            Créez un profil d'entreprise pour partager vos informations en ligne
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Nom de l'entreprise <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Ma Super Entreprise"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">
                URL personnalisée <span className="text-destructive">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">isaraya.link/</span>
                <div className="flex-1 relative">
                  <Input
                    id="slug"
                    placeholder="mon-entreprise"
                    value={slug}
                    onChange={(e) => handleSlugChange(e.target.value)}
                    required
                  />
                  {checkSlug.isPending && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                  {!checkSlug.isPending && slugCheckResult === true && (
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                  {!checkSlug.isPending && slugCheckResult === false && (
                    <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
                  )}
                </div>
              </div>
              {slugCheckResult === false && (
                <p className="text-sm text-destructive">
                  Ce slug est déjà utilisé. Veuillez en choisir un autre.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Votre profil sera accessible à l'adresse: isaraya.link/{slug || 'mon-entreprise'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="slogan">Slogan</Label>
              <Input
                id="slogan"
                placeholder="Votre slogan d'entreprise"
                value={slogan}
                onChange={(e) => setSlogan(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="77 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={
                !companyName ||
                !slug ||
                slug.length < 3 ||
                slugCheckResult === false ||
                createProfile.isPending ||
                checkSlug.isPending
              }
            >
              {createProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : checkSlug.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Vérification...
                </>
              ) : (
                'Créer le profil'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
