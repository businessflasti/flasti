import { supabase } from '@/lib/supabase';

export interface TutorialVideo {
  id: string;
  slider_video_url: string;
  player_video_url: string;
  title: string;
  description: string;
  is_clickable: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export class TutorialVideoService {
  /**
   * Obtiene el video tutorial activo
   */
  static async getActiveVideo(): Promise<TutorialVideo | null> {
    const { data, error } = await supabase
      .from('tutorial_video')
      .select('*')
      .eq('is_active', true)
      .single();

    if (error) {
      console.error('Error al obtener video tutorial:', error);
      return null;
    }

    return data;
  }

  /**
   * Obtiene todos los videos
   */
  static async getAllVideos(): Promise<TutorialVideo[]> {
    const { data, error } = await supabase
      .from('tutorial_video')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener videos:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Actualiza el video tutorial
   */
  static async updateVideo(
    id: string,
    updates: Partial<TutorialVideo>
  ): Promise<boolean> {
    console.log('🔄 Actualizando video:', id);
    console.log('📝 Datos a actualizar:', updates);

    // Agregar updated_at manualmente
    const updatesWithTimestamp = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('tutorial_video')
      .update(updatesWithTimestamp)
      .eq('id', id)
      .select();

    if (error) {
      console.error('❌ Error al actualizar video:', error);
      console.error('Código de error:', error.code);
      console.error('Mensaje:', error.message);
      console.error('Detalles:', error.details);
      return false;
    }

    console.log('✅ Video actualizado correctamente:', data);
    return true;
  }

  /**
   * Crea un nuevo video
   */
  static async createVideo(
    video: Omit<TutorialVideo, 'id' | 'created_at' | 'updated_at'>
  ): Promise<TutorialVideo | null> {
    const { data, error } = await supabase
      .from('tutorial_video')
      .insert(video)
      .select()
      .single();

    if (error) {
      console.error('Error al crear video:', error);
      return null;
    }

    return data;
  }

  /**
   * Elimina un video
   */
  static async deleteVideo(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('tutorial_video')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar video:', error);
      return false;
    }

    return true;
  }

  /**
   * Activa un video y desactiva los demás
   */
  static async setActiveVideo(id: string): Promise<boolean> {
    try {
      // Desactivar todos
      await supabase
        .from('tutorial_video')
        .update({ is_active: false })
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Actualizar todos

      // Activar el seleccionado
      const { error } = await supabase
        .from('tutorial_video')
        .update({ is_active: true })
        .eq('id', id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error al activar video:', error);
      return false;
    }
  }

  /**
   * Sube un video a Supabase Storage
   */
  static async uploadVideo(file: File): Promise<string | null> {
    try {
      console.log('📤 Subiendo video:', file.name, 'Tamaño:', (file.size / 1024 / 1024).toFixed(2), 'MB');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `tutorial-videos/${fileName}`;

      console.log('📁 Ruta del archivo:', filePath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Error al subir:', uploadError);
        throw uploadError;
      }

      console.log('✅ Video subido:', uploadData);

      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      console.log('🔗 URL pública:', data.publicUrl);

      return data.publicUrl;
    } catch (error: any) {
      console.error('❌ Error al subir video:', error);
      console.error('Detalles:', error.message || error);
      return null;
    }
  }
}
