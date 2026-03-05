import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, ProductInsert, ProductUpdate } from '@/types';
import { toast } from 'sonner';

async function apiFetch(url: string, options?: RequestInit) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Erreur réseau' }));
    throw new Error(err.error || 'Erreur serveur');
  }
  return res.json();
}

export const useProducts = (profileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['products', profileId],
    queryFn: () => apiFetch(`/api/products?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const usePublicProducts = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['products', 'public', profileId],
    queryFn: () => apiFetch(`/api/products?profileId=${profileId}`),
    enabled: !!profileId,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert) =>
      apiFetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profileId: product.profile_id,
          title: product.title,
          description: product.description,
          price: product.price,
          imageUrl: product.image_url,
          isFeatured: product.is_featured,
          isActive: product.is_active,
          displayOrder: product.display_order,
        }),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products', data.profileId] });
      toast.success('Produit créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du produit');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) =>
      apiFetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products', data.profileId] });
      toast.success('Produit mis à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du produit');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      await apiFetch(`/api/products/${id}`, { method: 'DELETE' });
      return profileId;
    },
    onSuccess: (profileId) => {
      queryClient.invalidateQueries({ queryKey: ['products', profileId] });
      toast.success('Produit supprimé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la suppression du produit');
    },
  });
};
