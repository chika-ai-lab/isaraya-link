import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Profile, ProfileInsert, ProfileUpdate } from '@/types';
import { toast } from 'sonner';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || 'Erreur serveur');
  }
  return res.json();
}

export const useProfiles = (enabled = true) => {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: () => apiFetch('/api/profiles'),
    enabled,
  });
};

export const useProfile = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['profile', profileId],
    queryFn: () => apiFetch(`/api/profiles/${profileId}`),
    enabled: !!profileId,
  });
};

export const useProfileBySlug = (slug: string | undefined) => {
  return useQuery({
    queryKey: ['profile', 'slug', slug],
    queryFn: () => apiFetch(`/api/slug/${slug}`),
    enabled: !!slug,
  });
};

export const useCreateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: ProfileInsert) =>
      apiFetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: profile.slug,
          companyName: profile.company_name,
          slogan: profile.slogan,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
          website: profile.website,
          description: profile.description,
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profil créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du profil');
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProfileUpdate }) =>
      apiFetch(`/api/profiles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }),
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

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (profileId: string) =>
      apiFetch(`/api/profiles/${profileId}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      toast.success('Profil supprimé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du profil');
    },
  });
};

export const useCheckSlugAvailability = () => {
  return useMutation({
    mutationFn: async ({ slug }: { slug: string; excludeId?: string }) => {
      const res = await fetch(`/api/slug/${slug}`);
      return !res.ok; // true = disponible (404 = slug non utilisé)
    },
  });
};

export const useGenerateSlug = () => {
  return useMutation({
    mutationFn: async (companyName: string) => {
      return companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    },
  });
};
