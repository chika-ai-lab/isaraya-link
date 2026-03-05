"use client";
import { useProfile } from '@/contexts/ProfileContext';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';

export const ProfileSwitcher = () => {
  const { currentProfile, profiles, setCurrentProfile } = useProfile();
  const router = useRouter();

  if (profiles.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
        <Building2 className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Aucun profil</span>
        <Button size="sm" variant="outline" onClick={() => router.push('/dashboard')}>
          <Plus className="h-4 w-4 mr-1" />
          Créer un profil
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-muted-foreground" />
      <Select
        value={currentProfile?.id || ''}
        onValueChange={(value) => {
          const profile = profiles.find((p) => p.id === value);
          if (profile) {
            setCurrentProfile(profile);
            router.push(`/dashboard/profile/${value}`);
          }
        }}
      >
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="Sélectionner un profil" />
        </SelectTrigger>
        <SelectContent>
          {profiles.map((profile) => (
            <SelectItem key={profile.id} value={profile.id}>
              <div className="flex flex-col">
                <span className="font-medium">{profile.company_name}</span>
                <span className="text-xs text-muted-foreground">/{profile.slug}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="outline" onClick={() => router.push('/dashboard')} title="Voir tous mes profils">
        Mes profils
      </Button>
    </div>
  );
};
