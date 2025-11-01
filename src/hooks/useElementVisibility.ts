import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ElementVisibility {
  id: string;
  page_name: string;
  element_key: string;
  element_name: string;
  is_visible: boolean;
  display_order: number;
}

export function useElementVisibility(pageName: string | string[]) {
  const [elements, setElements] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchVisibility();

    // Suscribirse a cambios en tiempo real para todas las páginas especificadas
    const pages = Array.isArray(pageName) ? pageName : [pageName];
    
    const channels = pages.map(page => {
      return supabase
        .channel(`element_visibility_${page}`)
        .on('postgres_changes', {
          event: '*',
          schema: 'public',
          table: 'element_visibility',
          filter: `page_name=eq.${page}`
        }, () => {
          fetchVisibility();
        })
        .subscribe();
    });

    return () => {
      channels.forEach(channel => supabase.removeChannel(channel));
    };
  }, [pageName]);

  const fetchVisibility = async () => {
    try {
      const pages = Array.isArray(pageName) ? pageName : [pageName];
      
      console.log('🔄 Fetching visibility for pages:', pages);
      
      const { data, error } = await supabase
        .from('element_visibility')
        .select('*')
        .in('page_name', pages)
        .order('display_order', { ascending: true });

      if (error) {
        console.error('❌ Error fetching visibility:', error);
        throw error;
      }

      console.log('✅ Visibility data received:', data);

      const visibilityMap: Record<string, boolean> = {};
      data?.forEach((item: ElementVisibility) => {
        visibilityMap[item.element_key] = item.is_visible;
        console.log(`  - ${item.element_key}: ${item.is_visible}`);
      });

      console.log('📊 Final visibility map:', visibilityMap);
      setElements(visibilityMap);
    } catch (error) {
      console.error('❌ Error fetching element visibility:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isVisible = (elementKey: string): boolean => {
    return elements[elementKey] !== false; // Por defecto visible si no existe
  };

  return { isVisible, isLoading, elements };
}
