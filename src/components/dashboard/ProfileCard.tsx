import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Profile } from '@/types';
import { useDeleteProfile } from '@/hooks/useProfiles';
import { useProfile } from '@/contexts/ProfileContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { MoreVertical, Eye, Edit, QrCode, Trash2, ExternalLink } from 'lucide-react';

interface ProfileCardProps {
  profile: Profile;
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const navigate = useNavigate();
  const deleteProfile = useDeleteProfile();
  const { setCurrentProfile } = useProfile();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const profileUrl = `/${profile.slug}`;
  const fullUrl = `${window.location.origin}${profileUrl}`;

  const handleView = () => {
    navigate(profileUrl);
  };

  const handleEdit = () => {
    setCurrentProfile(profile);
    navigate(`/dashboard/profile/${profile.id}`);
  };

  const handleDelete = async () => {
    await deleteProfile.mutateAsync(profile.id);
    setDeleteDialogOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(fullUrl);
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="line-clamp-1">{profile.company_name}</CardTitle>
              {profile.slogan && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {profile.slogan}
                </p>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleView}>
                  <Eye className="mr-2 h-4 w-4" />
                  Voir le profil public
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Copier le lien
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setDeleteDialogOpen(true)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Supprimer
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">URL:</span>
              <code className="px-2 py-1 bg-muted rounded text-xs">/{profile.slug}</code>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={profile.is_active ? 'default' : 'secondary'}>
                {profile.is_active ? 'Actif' : 'Inactif'}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant="outline" className="flex-1" onClick={handleView}>
            <Eye className="mr-2 h-4 w-4" />
            Voir
          </Button>
          <Button className="flex-1" onClick={handleEdit}>
            <Edit className="mr-2 h-4 w-4" />
            Gérer
          </Button>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cela supprimera définitivement le profil "
              {profile.company_name}" et toutes ses données (produits, services, promotions).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
