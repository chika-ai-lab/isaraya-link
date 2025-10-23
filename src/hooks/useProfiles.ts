import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Profile, ProfileInsert, ProfileUpdate } from '@/types';
import { toast } from 'sonner';

/**
 * Hook pour récupérer tous les profils de l'utilisateur connecté
 */
export const useProfiles = () => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
    enabled: true,
  });
};

/**
 * Hook pour récupérer un profil par son ID
 */
export const useProfile = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: async () => {
      if (!profileId) throw new Error('Profile ID is required');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour récupérer un profil public par son slug
 */
export const useProfileBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['profile', 'slug', slug],
    queryFn: async () => {
      if (!slug) throw new Error('Slug is required');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      return data as Profile;
    },
    enabled: !!slug,
  });
};

/**
 * Hook pour créer un nouveau profil
 */
export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProfileInsert) => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      // Vérifier la disponibilité du slug
      const { data: slugCheck } = await supabase
        .rpc('is_slug_available', { slug_to_check: profile.slug });

      if (!slugCheck) {
        throw new Error('Ce slug est déjà utilisé. Veuillez en choisir un autre.');
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profile,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profil créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du profil');
    },
  });
};

/**
 * Hook pour mettre à jour un profil
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProfileUpdate }) => {
      // Si on change le slug, vérifier sa disponibilité (sauf pour le profil actuel)
      if (updates.slug) {
        // Vérifier si le slug existe déjà sur un autre profil
        const { data: existingProfiles } = await supabase
          .from('profiles')
          .select('id')
          .eq('slug', updates.slug)
          .neq('id', id);

        if (existingProfiles && existingProfiles.length > 0) {
          throw new Error('Ce slug est déjà utilisé. Veuillez en choisir un autre.');
        }
      }

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Profile;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profile', data.id] });
      queryClient.invalidateQueries({ queryKey: ['profile', 'slug', data.slug] });
      toast.success('Profil mis à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du profil');
    },
  });
};

/**
 * Hook pour supprimer un profil
 */
export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profil supprimé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du profil');
    },
  });
};

/**
 * Hook pour vérifier la disponibilité d'un slug
 */
export const useCheckSlugAvailability = () => {
  return useMutation({
    mutationFn: async ({ slug, excludeId }: { slug: string; excludeId?: string }) => {
      const { data, error } = await supabase
        .rpc('is_slug_available', { slug_to_check: slug });

      if (error) throw error;
      return data as boolean;
    },
  });
};

/**
 * Hook pour générer un slug unique à partir d'un nom
 */
export const useGenerateSlug = () => {
  return useMutation({
    mutationFn: async (companyName: string) => {
      const { data, error } = await supabase
        .rpc('generate_unique_slug', { base_name: companyName });

      if (error) throw error;
      return data as string;
    },
  });
};
