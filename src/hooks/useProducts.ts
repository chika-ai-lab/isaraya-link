import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Product, ProductInsert, ProductUpdate } from '@/types';
import { toast } from 'sonner';

/**
 * Hook pour récupérer tous les produits d'un profil
 */
export const useProducts = (profileId: string | null | undefined) => {
  return useQuery({
    queryKey: ['products', profileId],
    queryFn: async () => {
      if (!profileId) {
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', profileId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour récupérer les produits publics d'un profil (actifs uniquement)
 */
export const usePublicProducts = (profileId: string | undefined) => {
  return useQuery({
    queryKey: ['products', 'public', profileId],
    queryFn: async () => {
      if (!profileId) {
        return [];
      }

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('profile_id', profileId)
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!profileId,
  });
};

/**
 * Hook pour créer un nouveau produit
 */
export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: ProductInsert) => {
      if (!product.profile_id) {
        throw new Error('Le profile_id est requis');
      }

      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products', data.profile_id] });
      toast.success('Produit créé avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la création du produit');
    },
  });
};

/**
 * Hook pour mettre à jour un produit
 */
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: ProductUpdate }) => {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as Product;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products', data.profile_id] });
      toast.success('Produit mis à jour avec succès!');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Erreur lors de la mise à jour du produit');
    },
  });
};

/**
 * Hook pour supprimer un produit
 */
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, profileId }: { id: string; profileId: string }) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
