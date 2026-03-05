import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Service, ServiceInsert, ServiceUpdate } from '@/types';
import { toast } from 'sonner';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || 'Erreur serveur');
  }
  return res.json();
}

export const useServices = (profileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['services', profileId],
    queryFn: () => apiFetch(`/api/services?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const usePublicServices = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['services', 'public', profileId],
    queryFn: () => apiFetch(`/api/services?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const useCreateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: ServiceInsert) =>
      apiFetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: service.profile_id,
          title: service.title,
          description: service.description,
          icon: service.icon,
          isActive: service.is_active,
          displayOrder: service.display_order,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services', data.profileId] });
      toast.success('Service créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du service');
    },
  });
};

export const useUpdateService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ServiceUpdate }) =>
      apiFetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['services', data.profileId] });
      toast.success('Service mis à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du service');
    },
  });
};

export const useDeleteService = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      await apiFetch(`/api/services/${id}`, { method: 'DELETE' });
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
