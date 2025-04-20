'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Copy, Check, RefreshCw, Sparkles, Send, Plus, X, ThumbsUp, ThumbsDown } from 'lucide-react';
import { toast } from 'sonner';
import { AIContentRequest, aiService } from '@/lib/ai-service';
import { supabase } from '@/lib/supabase';

interface App {
  id: number;
  name: string;
}

export default function AIContentGenerator() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [contentType, setContentType] = useState<'social' | 'email' | 'blog' | 'ad'>('social');
  const [platform, setPlatform] = useState<'facebook' | 'instagram' | 'twitter' | 'linkedin'>('facebook');
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [tone, setTone] = useState<'professional' | 'casual' | 'enthusiastic' | 'informative'>('professional');
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('short');
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [newKeyPoint, setNewKeyPoint] = useState<string>('');
  const [audience, setAudience] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadApps();
  }, []);

  const loadApps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('id, name')
        .order('name');

      if (error) {
        console.error('Error al cargar aplicaciones:', error);
      } else if (data && data.length > 0) {
        setApps(data);
        setSelectedApp(data[0]);
      }
    } catch (error) {
      console.error('Error general al cargar aplicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddKeyPoint = () => {
    if (newKeyPoint.trim()) {
      setKeyPoints([...keyPoints, newKeyPoint.trim()]);
      setNewKeyPoint('');
    }
  };

  const handleRemoveKeyPoint = (index: number) => {
    setKeyPoints(keyPoints.filter((_, i) => i !== index));
  };

  const handleGenerateContent = async () => {
    if (!selectedApp) {
      toast.error('Por favor selecciona una aplicación');
      return;
    }
    
    setGenerating(true);
    try {
      const request: AIContentRequest = {
        type: contentType,
        platform: contentType === 'social' ? platform : undefined,
        product: selectedApp.name,
        tone,
        length,
        keyPoints: keyPoints.length > 0 ? keyPoints : undefined,
        audience: audience.trim() || undefined
      };
      
      const response = await aiService.generateContent(request);
      
      setGeneratedContent(response.content);
      setSuggestions(response.suggestions);
      
      toast.success('Contenido generado con éxito');
    } catch (error) {
      console.error('Error al generar contenido:', error);
      toast.error('Error al generar contenido');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Contenido copiado al portapapeles');
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleUseSuggestion = (suggestion: string) => {
    setGeneratedContent(suggestion);
    toast.success('Sugerencia aplicada');
  };

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'social':
        return 'Publicación para Redes Sociales';
      case 'email':
        return 'Correo Electrónico';
      case 'blog':
        return 'Artículo de Blog';
      case 'ad':
        return 'Anuncio Publicitario';
      default:
        return 'Contenido';
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Generador de Contenido con IA</h2>
        <p className="text-foreground/70">
          Crea contenido persuasivo para promocionar aplicaciones utilizando inteligencia artificial
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tipo de Contenido</CardTitle>
              <CardDescription>
                Selecciona el tipo de contenido que deseas generar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={contentType} onValueChange={(value: any) => setContentType(value)}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="blog">Blog</TabsTrigger>
                  <TabsTrigger value="ad">Anuncio</TabsTrigger>
                </TabsList>
                
                <TabsContent value="social" className="pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plataforma</Label>
                    <Select 
                      value={platform} 
                      onValueChange={(value: any) => setPlatform(value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una plataforma" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">Twitter (X)</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Detalles del Contenido</CardTitle>
              <CardDescription>
                Personaliza los parámetros para generar contenido a medida
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="app">Aplicación</Label>
                <Select 
                  value={selectedApp?.id.toString()} 
                  onValueChange={(value) => {
                    const app = apps.find(a => a.id === parseInt(value));
                    if (app) setSelectedApp(app);
                  }}
                  disabled={apps.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una aplicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {apps.map((app) => (
                      <SelectItem key={app.id} value={app.id.toString()}>
                        {app.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tone">Tono</Label>
                  <Select 
                    value={tone} 
                    onValueChange={(value: any) => setTone(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tono" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Profesional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="enthusiastic">Entusiasta</SelectItem>
                      <SelectItem value="informative">Informativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="length">Longitud</Label>
                  <Select 
                    value={length} 
                    onValueChange={(value: any) => setLength(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una longitud" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Corto</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="long">Largo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="audience">Audiencia Objetivo (opcional)</Label>
                <Input
                  id="audience"
                  placeholder="Ej: Profesionales de marketing, estudiantes universitarios, etc."
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Puntos Clave (opcional)</Label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Añade un punto clave"
                    value={newKeyPoint}
                    onChange={(e) => setNewKeyPoint(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyPoint();
                      }
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleAddKeyPoint}
                    disabled={!newKeyPoint.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {keyPoints.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {keyPoints.map((point, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        <span>{point}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleRemoveKeyPoint(index)}
                          className="h-4 w-4 p-0 ml-1"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleGenerateContent}
                disabled={generating || !selectedApp}
                className="w-full gap-2"
              >
                {generating ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generar Contenido
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>{getContentTypeLabel()}</CardTitle>
              <CardDescription>
                Contenido generado por IA basado en tus parámetros
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              {generating ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center p-4">
                    <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[90%]" />
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[85%]" />
                </div>
              ) : generatedContent ? (
                <div className="space-y-4">
                  <Textarea
                    value={generatedContent}
                    onChange={(e) => setGeneratedContent(e.target.value)}
                    className="min-h-[200px] resize-none"
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleCopyContent}
                      className="gap-1"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                  </div>
                  
                  {suggestions.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Sugerencias Alternativas:</h3>
                      <div className="space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <Card key={index} className="p-3">
                            <div className="text-sm">
                              {suggestion.length > 150 
                                ? suggestion.substring(0, 150) + '...' 
                                : suggestion
                              }
                            </div>
                            <div className="flex justify-end mt-2">
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleUseSuggestion(suggestion)}
                                className="h-7 text-xs"
                              >
                                Usar esta versión
                              </Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center text-foreground/70">
                  <Sparkles className="h-12 w-12 mb-4 text-primary/30" />
                  <h3 className="text-lg font-medium">Generador de Contenido IA</h3>
                  <p className="mt-2">
                    Configura los parámetros y haz clic en "Generar Contenido" para crear
                    textos persuasivos para promocionar tus aplicaciones.
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4">
              <div className="text-xs text-foreground/70 w-full">
                <p>
                  <strong>Nota:</strong> Este contenido es generado por IA y debe ser revisado antes de su uso.
                  Personalízalo según tus necesidades específicas para obtener mejores resultados.
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
