import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CompanyInfo {
  id: string;
  company_name: string;
  slogan: string;
  phone: string;
  email: string;
  address: string;
  google_maps_url: string | null;
  website: string;
  description: string;
  facebook: string | null;
  instagram: string | null;
  twitter: string | null;
  linkedin: string | null;
  whatsapp: string | null;
}

export function useCompanyInfo() {
  return useQuery({
    queryKey: ["company-info"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_info")
        .select("*")
        .maybeSingle();

      if (error) throw error;
      return data as CompanyInfo;
    },
  });
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  is_active: boolean;
  display_order: number;
}

export function useServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as Service[];
    },
  });
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: string | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  display_order: number;
}

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as Product[];
    },
  });
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount_text: string | null;
  is_active: boolean;
  valid_until: string | null;
  display_order: number;
}

export function usePromotions() {
  return useQuery({
    queryKey: ["promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*")
        .eq("is_active", true)
        .order("display_order");

      if (error) throw error;
      return data as Promotion[];
    },
  });
}