'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Trash2, Plus, Upload } from 'lucide-react';
import Image from 'next/image';

interface Story {
  id: string;
  avatar_url: string;
  media_url: string;
  media_type: 'image' | 'video';
  duration: number;
  order: number;
  created_at: string;
}

export default function StoriesAdminPage() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(5);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [mediaPreview, setMediaPreview] = useState<string>('');
  const [detectedDuration, setDetectedDuration] = useState<number | null>(null);

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('order', { ascending: true });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error loading stories:', error);
      toast.error('Error al cargar historias');
    } finally {
      setLoading(false);
    }
  };

  const uploadFile = async (file: File, bucket: string) => {
    // Verificar tamaño del archivo (máximo 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      throw new Error(`El archivo es muy grande. Máximo 50MB. Tamaño actual: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    }

    const fileExt = file.name.split('.').pop();
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const fileName = `${timestamp}-${random}.${fileExt}`;
    const filePath = `${fileName}`;

    console.log(`Subiendo archivo: ${fileName} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false // No sobrescribir, siempre crear nuevo
      });

    if (uploadError) {
      console.error('Error de upload:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    console.log('Archivo subido exitosamente:', data.publicUrl);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!avatarFile || !mediaFile) {
      toast.error('Debes seleccionar avatar y video/imagen');
      return;
    }

    setUploading(true);
    try {
      console.log('Subiendo avatar...');
      const avatarUrl = await uploadFile(avatarFile, 'stories-avatars');
      console.log('Avatar subido:', avatarUrl);
      
      console.log('Subiendo media...');
      const mediaUrl = await uploadFile(mediaFile, 'stories-media');
      console.log('Media subido:', mediaUrl);
      
      const mediaType = mediaFile.type.startsWith('video') ? 'video' : 'image';

      console.log('Insertando en base de datos...');
      const { data, error } = await supabase.from('stories').insert({
        avatar_url: avatarUrl,
        media_url: mediaUrl,
        media_type: mediaType,
        duration: duration * 1000,
        order: stories.length
      }).select();

      if (error) {
        console.error('Error de inserción:', error);
        throw error;
      }

      console.log('Historia insertada:', data);
      toast.success('Historia agregada exitosamente');
      
      // Limpiar formulario
      setAvatarFile(null);
      setMediaFile(null);
      setAvatarPreview('');
      setMediaPreview('');
      setDuration(5);
      setDetectedDuration(null);
      
      // Recargar historias
      await loadStories();
    } catch (error: any) {
      console.error('Error completo:', error);
      toast.error(`Error: ${error.message || 'Error al agregar historia'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta historia?')) return;

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Delete error:', error);
        throw error;
      }
      
      toast.success('Historia eliminada exitosamente');
      await loadStories();
    } catch (error: any) {
      console.error('Error completo:', error);
      toast.error(`Error al eliminar: ${error.message || 'Desconocido'}`);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const url = URL.createObjectURL(file);
      setMediaPreview(url);

      // Detectar duración automáticamente si es video
      if (file.type.startsWith('video')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () => {
          const videoDuration = Math.ceil(video.duration);
          setDetectedDuration(videoDuration);
          setDuration(videoDuration);
          URL.revokeObjectURL(video.src);
        };
        video.src = url;
      } else {
        // Para imágenes, usar duración por defecto
        setDetectedDuration(null);
        setDuration(5);
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-3 md:p-8">
      <div className="max-w-7xl mx-auto">


        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6">
          {/* Formulario - Columna izquierda */}
          <div className="lg:col-span-1">
            <div className="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-white/5 sticky top-4">
          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-5">
            {/* Avatar */}
            <div>
              <label className="block text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className="flex items-center justify-center w-full h-28 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-green-500/50 hover:bg-white/5 transition-all group"
              >
                {avatarPreview ? (
                  <div className="relative">
                    <Image src={avatarPreview} alt="Preview" width={64} height={64} className="w-16 h-16 rounded-full object-cover ring-2 ring-green-500" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                      <Upload className="w-6 h-6 text-white/40 group-hover:text-green-500 transition-colors" />
                    </div>
                    <span className="text-white/40 text-xs">Imagen circular</span>
                  </div>
                )}
              </label>
            </div>

            {/* Media */}
            <div>
              <label className="block text-white/70 text-xs font-medium mb-2 uppercase tracking-wide">Video/Imagen</label>
              <input
                type="file"
                accept="video/*,image/*"
                onChange={handleMediaChange}
                className="hidden"
                id="media-upload"
              />
              <label
                htmlFor="media-upload"
                className="flex items-center justify-center w-full h-40 border border-dashed border-white/10 rounded-xl cursor-pointer hover:border-green-500/50 hover:bg-white/5 transition-all group"
              >
                {mediaPreview ? (
                  <div className="relative h-full w-full p-2">
                    {mediaFile?.type.startsWith('video') ? (
                      <video src={mediaPreview} className="h-full w-full object-contain rounded-lg" />
                    ) : (
                      <Image src={mediaPreview} alt="Preview" width={100} height={160} className="h-full w-full object-contain rounded-lg" />
                    )}
                    <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 rounded-full text-white text-xs font-semibold">
                      {mediaFile?.type.startsWith('video') ? '🎥' : '🖼️'}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-green-500/10 transition-colors">
                      <Upload className="w-6 h-6 text-white/40 group-hover:text-green-500 transition-colors" />
                    </div>
                    <span className="text-white/40 text-xs">Formato vertical 9:16</span>
                  </div>
                )}
              </label>
            </div>

            <button
              type="submit"
              disabled={uploading || !avatarFile || !mediaFile}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Agregar Historia
                </>
              )}
            </button>
          </form>
        </div>
      </div>

          {/* Lista de historias - Columna derecha */}
          <div className="lg:col-span-2">
            <div className="bg-[#1a1a1a] rounded-2xl p-4 md:p-6 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  Historias Activas
                </h2>
                <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-sm font-semibold">
                  {stories.length}
                </span>
              </div>

              {stories.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
                    <svg className="w-8 h-8 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white/40 text-sm">No hay historias aún</p>
                  <p className="text-white/20 text-xs mt-1">Agrega tu primera historia usando el formulario</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {stories.map((story) => (
                    <div key={story.id} className="group bg-[#0a0a0a] rounded-xl overflow-hidden border border-white/5 hover:border-green-500/30 transition-all">
                      {/* Preview */}
                      <div className="relative aspect-[9/16] bg-black">
                        {story.media_type === 'video' ? (
                          <video 
                            src={story.media_url} 
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                              e.currentTarget.pause();
                              e.currentTarget.currentTime = 0;
                            }}
                          />
                        ) : (
                          <Image 
                            src={story.media_url} 
                            alt="Media" 
                            fill
                            className="object-cover" 
                          />
                        )}
                        
                        {/* Overlay con info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 mb-2">
                              <Image
                                src={story.avatar_url}
                                alt="Avatar"
                                width={32}
                                height={32}
                                className="w-8 h-8 rounded-full object-cover ring-2 ring-white/20"
                              />
                              <div className="flex-1">
                                <p className="text-white text-xs font-medium flex items-center gap-1">
                                  {story.media_type === 'video' ? (
                                    <>
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                      </svg>
                                      Video
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                                      </svg>
                                      Imagen
                                    </>
                                  )}
                                </p>
                                <p className="text-white/60 text-xs">{story.duration / 1000}s</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Badge tipo */}
                        <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-white text-xs font-semibold flex items-center gap-1">
                          {story.media_type === 'video' ? (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>

                        {/* Botón eliminar */}
                        <button
                          onClick={() => handleDelete(story.id)}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500/90 hover:bg-red-600 backdrop-blur-sm rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
