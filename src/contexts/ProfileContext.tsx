import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile } from '@/types';
import { useProfiles } from '@/hooks/useProfiles';
import { useAuth } from './AuthContext';

interface ProfileContextType {
  currentProfile: Profile | null;
  profiles: Profile[];
  loading: boolean;
  setCurrentProfile: (profile: Profile | null) => void;
  refreshProfiles: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const CURRENT_PROFILE_KEY = 'isaraya_current_profile_id';

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { data: profiles = [], isLoading, refetch } = useProfiles();
  const [currentProfile, setCurrentProfileState] = useState<Profile | null>(null);

  // Charger le profil courant depuis localStorage au montage
  useEffect(() => {
    if (profiles.length > 0) {
      const savedProfileId = localStorage.getItem(CURRENT_PROFILE_KEY);

      if (savedProfileId) {
        const savedProfile = profiles.find((p) => p.id === savedProfileId);
        if (savedProfile) {
          setCurrentProfileState(savedProfile);
          return;
        }
      }

      // Si pas de profil sauvegardé ou profil introuvable, utiliser le premier
      setCurrentProfileState(profiles[0]);
    } else if (!user) {
      // Si l'utilisateur est déconnecté, réinitialiser le profil courant
      setCurrentProfileState(null);
      localStorage.removeItem(CURRENT_PROFILE_KEY);
    }
  }, [profiles, user]);

  const setCurrentProfile = (profile: Profile | null) => {
    setCurrentProfileState(profile);
    if (profile) {
      localStorage.setItem(CURRENT_PROFILE_KEY, profile.id);
    } else {
      localStorage.removeItem(CURRENT_PROFILE_KEY);
    }
  };

  const refreshProfiles = async () => {
    await refetch();
  };

  const value = {
    currentProfile,
    profiles,
    loading: isLoading,
    setCurrentProfile,
    refreshProfiles,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
