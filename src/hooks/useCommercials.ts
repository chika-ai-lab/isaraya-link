import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Commercial, CommercialInsert, CommercialUpdate } from '@/types';
import { toast } from 'sonner';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || 'Erreur serveur');
  }
  return res.json();
}

export const useCommercials = (profileId: string | null | undefined) => {
  return useQuery<Commercial[]>({
    queryKey: ['commercials', profileId],
    queryFn: () => apiFetch(`/api/commercials?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const useCreateCommercial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commercial: CommercialInsert) =>
      apiFetch('/api/commercials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: commercial.profile_id,
          firstName: commercial.first_name,
          lastName: commercial.last_name,
          position: commercial.position,
          phone: commercial.phone,
          email: commercial.email,
          photoUrl: commercial.photo_url,
          bio: commercial.bio,
          isActive: commercial.is_active ?? true,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['commercials', data.profile_id] });
      toast.success('Commercial créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du commercial');
    },
  });
};

export const useUpdateCommercial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: CommercialUpdate }) =>
      apiFetch(`/api/commercials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: updates.first_name,
          lastName: updates.last_name,
          position: updates.position,
          phone: updates.phone,
          email: updates.email,
          photoUrl: updates.photo_url,
          bio: updates.bio,
          isActive: updates.is_active,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['commercials', data.profile_id] });
      toast.success('Commercial mis à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du commercial');
    },
  });
};

export const useDeleteCommercial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      await apiFetch(`/api/commercials/${id}`, { method: 'DELETE' });
      return profileId;
    },
    onSuccess: (profileId) => {
      queryClient.invalidateQueries({ queryKey: ['commercials', profileId] });
      toast.success('Commercial supprimé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du commercial');
    },
  });
};
