'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, ChevronLeft, ChevronRight, ThumbsUp, ThumbsDown, Bookmark, Share2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Tip {
  id: number;
  content: string;
  category: string;
}

export default function DailyTips() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [currentTipIndex, setCurrentTipIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [savedTips, setSavedTips] = useState<number[]>([]);

  useEffect(() => {
    loadTips();
    
    // Cargar tips guardados del localStorage
    const saved = localStorage.getItem('savedTips');
    if (saved) {
      setSavedTips(JSON.parse(saved));
    }
    
    // Cargar el último índice visto
    const lastIndex = localStorage.getItem('lastTipIndex');
    if (lastIndex) {
      setCurrentTipIndex(parseInt(lastIndex));
    }
  }, []);

  useEffect(() => {
    // Guardar el índice actual en localStorage
    if (tips.length > 0) {
      localStorage.setItem('lastTipIndex', currentTipIndex.toString());
    }
  }, [currentTipIndex, tips]);

  const loadTips = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('daily_tips')
        .select('*')
        .order('id');

      if (error) {
        console.error('Error al cargar tips:', error);
      } else if (data) {
        // Mezclar los tips para mostrarlos en orden aleatorio
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setTips(shuffled);
      }
    } catch (error) {
      console.error('Error general al cargar tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prev) => (prev > 0 ? prev - 1 : tips.length - 1));
  };

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev < tips.length - 1 ? prev + 1 : 0));
  };

  const handleSaveTip = (tipId: number) => {
    const isSaved = savedTips.includes(tipId);
    
    let newSavedTips;
    if (isSaved) {
      newSavedTips = savedTips.filter(id => id !== tipId);
    } else {
      newSavedTips = [...savedTips, tipId];
    }
    
    setSavedTips(newSavedTips);
    localStorage.setItem('savedTips', JSON.stringify(newSavedTips));
  };

  const handleShareTip = (tip: Tip) => {
    if (navigator.share) {
      navigator.share({
        title: 'Tip de Marketing de Afiliados',
        text: tip.content,
        url: window.location.href
      }).catch(err => {
        console.error('Error al compartir:', err);
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      navigator.clipboard.writeText(tip.content);
      alert('Tip copiado al portapapeles');
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'tracking': 'Seguimiento',
      'marketing': 'Marketing',
      'social_media': 'Redes Sociales',
      'conversion': 'Conversión',
      'targeting': 'Segmentación',
      'timing': 'Timing',
      'content': 'Contenido',
      'analytics': 'Análisis',
      'consistency': 'Consistencia',
      'collaboration': 'Colaboración',
      'mobile': 'Móvil',
      'psychology': 'Psicología',
      'retargeting': 'Retargeting',
      'education': 'Educación',
      'profile_optimization': 'Optimización de Perfil',
      'discoverability': 'Descubrimiento',
      'engagement': 'Engagement',
      'research': 'Investigación',
      'email_marketing': 'Email Marketing',
      'fomo': 'FOMO'
    };
    
    return categories[category] || category;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-6 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
        <CardFooter>
          <div className="flex justify-between w-full">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </CardFooter>
      </Card>
    );
  }

  if (tips.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tips del Día</CardTitle>
          <CardDescription>
            Consejos diarios sobre marketing de afiliados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Lightbulb className="h-12 w-12 text-foreground/30 mb-4" />
            <p className="text-foreground/70">
              No hay tips disponibles en este momento. Vuelve más tarde.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentTip = tips[currentTipIndex];

  return (
    <Card className="transition-all duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#ec4899]" />
            <CardTitle>Tip del Día</CardTitle>
          </div>
          <Badge variant="outline">
            {getCategoryLabel(currentTip.category)}
          </Badge>
        </div>
        <CardDescription>
          Consejo #{currentTipIndex + 1} de {tips.length}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{currentTip.content}</p>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between w-full">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleSaveTip(currentTip.id)}
            className={savedTips.includes(currentTip.id) ? 'text-[#ec4899]' : ''}
          >
            <Bookmark className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handlePrevTip}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleNextTip}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => handleShareTip(currentTip)}
          >
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
