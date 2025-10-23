import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Promotion, PromotionInsert, PromotionUpdate } from '@/types';
import { toast } from 'sonner';

/**
 * Hook pour récupérer toutes les promotions d'un profil
 */
export const usePromotions = (profileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['promotions', profileId],
    queryFn: async () => {
      if (!profileId) {
        return [];
      }

      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Promotion[];
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour récupérer les promotions publiques d'un profil (actives uniquement)
 */
export const usePublicPromotions = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['promotions', 'public', profileId],
    queryFn: async () => {
      if (!profileId) {
        return [];
      }

      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Promotion[];
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour créer une nouvelle promotion
 */
export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: PromotionInsert) => {
      if (!promotion.profile_id) {
        throw new Error('Le profile_id est requis');
      }

      const { data, error } = await supabase
        .from('promotions')
        .insert(promotion)
        .select()
        .single();

      if (error) throw error;
      return data as Promotion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promotions', data.profile_id] });
      toast.success('Promotion créée avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création de la promotion');
    },
  });
};

/**
 * Hook pour mettre à jour une promotion
 */
export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PromotionUpdate }) => {
      const { data, error } = await supabase
        .from('promotions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Promotion;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promotions', data.profile_id] });
      toast.success('Promotion mise à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la promotion');
    },
  });
};

/**
 * Hook pour supprimer une promotion
 */
export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      const { error } = await supabase
        .from('promotions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return profileId;
    },
    onSuccess: (profileId) => {
      queryClient.invalidateQueries({ queryKey: ['promotions', profileId] });
      toast.success('Promotion supprimée avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression de la promotion');
    },
  });
};
