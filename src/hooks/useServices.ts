import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service, ServiceInsert, ServiceUpdate } from '@/types';
import { toast } from 'sonner';

/**
 * Hook pour récupérer tous les services d'un profil
 */
export const useServices = (profileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['services', profileId],
    queryFn: async () => {
      if (!profileId) {
        return [];
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour récupérer les services publics d'un profil (actifs uniquement)
 */
export const usePublicServices = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['services', 'public', profileId],
    queryFn: async () => {
      if (!profileId) {
        return [];
      }

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Service[];
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour créer un nouveau service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: ServiceInsert) => {
      if (!service.profile_id) {
        throw new Error('Le profile_id est requis');
      }

      const { data, error } = await supabase
        .from('services')
        .insert(service)
        .select()
        .single();

      if (error) throw error;
      return data as Service;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services', data.profile_id] });
      toast.success('Service créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du service');
    },
  });
};

/**
 * Hook pour mettre à jour un service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ServiceUpdate }) => {
      const { data, error } = await supabase
        .from('services')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Service;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services', data.profile_id] });
      toast.success('Service mis à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du service');
    },
  });
};

/**
 * Hook pour supprimer un service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return profileId;
    },
    onSuccess: (profileId) => {
      queryClient.invalidateQueries({ queryKey: ['services', profileId] });
      toast.success('Service supprimé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du service');
    },
  });
};
