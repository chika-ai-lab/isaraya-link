import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Promotion, PromotionInsert, PromotionUpdate } from '@/types';
import { toast } from 'sonner';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || 'Erreur serveur');
  }
  return res.json();
}

export const usePromotions = (profileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['promotions', profileId],
    queryFn: () => apiFetch(`/api/promotions?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const usePublicPromotions = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['promotions', 'public', profileId],
    queryFn: () => apiFetch(`/api/promotions?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const useCreatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promotion: PromotionInsert) =>
      apiFetch('/api/promotions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: promotion.profile_id,
          title: promotion.title,
          description: promotion.description,
          discountText: promotion.discount_text,
          isActive: promotion.is_active,
          validUntil: promotion.valid_until,
          displayOrder: promotion.display_order,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promotions', data.profileId] });
      toast.success('Promotion créée avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création de la promotion');
    },
  });
};

export const useUpdatePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PromotionUpdate }) =>
      apiFetch(`/api/promotions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['promotions', data.profileId] });
      toast.success('Promotion mise à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour de la promotion');
    },
  });
};

export const useDeletePromotion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      await apiFetch(`/api/promotions/${id}`, { method: 'DELETE' });
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
