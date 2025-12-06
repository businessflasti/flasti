'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Save, Code, Eye, Monitor, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

interface EmailTemplate {
  id: string;
  template_key: string;
  subject: string;
  html_content: string;
  description: string;
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<string>('recovery_1');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('mobile');

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('template_key');

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Error al cargar plantillas');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (templateKey: string) => {
    setSaving(true);
    try {
      const template = templates.find(t => t.template_key === templateKey);
      if (!template) return;

      const { error } = await supabase
        .from('email_templates')
        .update({
          subject: template.subject,
          html_content: template.html_content,
          description: template.description,
          updated_at: new Date().toISOString()
        })
        .eq('template_key', templateKey);

      if (error) throw error;
      toast.success('Plantilla guardada exitosamente');
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar plantilla');
    } finally {
      setSaving(false);
    }
  };

  const updateTemplate = (templateKey: string, field: keyof EmailTemplate, value: string) => {
    setTemplates(prev => prev.map(t => 
      t.template_key === templateKey ? { ...t, [field]: value } : t
    ));
  };

  const getTemplate = (templateKey: string) => {
    return templates.find(t => t.template_key === templateKey);
  };

  const getPreviewHtml = (templateKey: string) => {
    const template = getTemplate(templateKey);
    if (!template) return '';
    
    let html = template.html_content;
    html = html.replace(/\{\{user_name\}\}/g, 'Juan Pérez');
    html = html.replace(/\{\{user_email\}\}/g, 'usuario@ejemplo.com');
    return html;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando plantillas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-[1800px] mx-auto">
        <Tabs value={activeTemplate} onValueChange={setActiveTemplate}>
          <TabsList className="bg-[#121212] border border-white/10">
            <TabsTrigger value="recovery_1" className="data-[state=active]:bg-blue-500/20">
              <Mail className="w-4 h-4 mr-2" />
              Correo 1
            </TabsTrigger>
            <TabsTrigger value="recovery_2" className="data-[state=active]:bg-orange-500/20">
              <Mail className="w-4 h-4 mr-2" />
              Correo 2
            </TabsTrigger>
            <TabsTrigger value="welcome" className="data-[state=active]:bg-green-500/20">
              <Mail className="w-4 h-4 mr-2" />
              Bienvenida
            </TabsTrigger>
          </TabsList>

          {['recovery_1', 'recovery_2', 'welcome'].map(templateKey => {
            const template = getTemplate(templateKey);
            if (!template) return null;

            return (
              <TabsContent key={templateKey} value={templateKey} className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Editor */}
                  <Card className="bg-[#121212] border-0">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Code className="w-5 h-5" />
                          Editor
                        </span>
                        <Button
                          size="sm"
                          onClick={() => handleSave(templateKey)}
                          disabled={saving}
                          className="bg-green-500/20 text-green-400 hover:bg-green-500/30"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Asunto del correo
                        </label>
                        <Input
                          value={template.subject}
                          onChange={(e) => updateTemplate(templateKey, 'subject', e.target.value)}
                          className="bg-[#0a0a0a] border-white/10 text-white"
                          placeholder="Asunto del correo"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Contenido HTML
                        </label>
                        <Textarea
                          value={template.html_content}
                          onChange={(e) => updateTemplate(templateKey, 'html_content', e.target.value)}
                          className="bg-[#0a0a0a] border-white/10 text-white font-mono text-xs min-h-[500px]"
                          placeholder="Código HTML del correo"
                        />
                      </div>

                      <div className="bg-blue-500/10 border border-0 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-400 mb-2">Variables disponibles:</h4>
                        <ul className="text-xs text-blue-300 space-y-1">
                          <li><code className="bg-blue-500/20 px-2 py-1 rounded">{'{{user_name}}'}</code> - Nombre del usuario</li>
                          <li><code className="bg-blue-500/20 px-2 py-1 rounded">{'{{user_email}}'}</code> - Email del usuario</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Vista Previa */}
                  <Card className="bg-[#121212] border-0">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <Eye className="w-5 h-5" />
                          Vista Previa
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => setPreviewDevice('desktop')}
                            className={`${
                              previewDevice === 'desktop'
                                ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                          >
                            <Monitor className="w-4 h-4 mr-2" />
                            Desktop
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => setPreviewDevice('mobile')}
                            className={`${
                              previewDevice === 'mobile'
                                ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                            }`}
                          >
                            <Smartphone className="w-4 h-4 mr-2" />
                            Móvil
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-center items-start bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6 min-h-[600px]">
                        {previewDevice === 'desktop' ? (
                          <div className="bg-white rounded-lg overflow-hidden shadow-2xl w-full max-w-[800px]">
                            <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                              <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              </div>
                              <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-xs text-gray-400">
                                📧 Vista previa del correo
                              </div>
                            </div>
                            <iframe
                              srcDoc={getPreviewHtml(templateKey)}
                              className="w-full h-[550px] border-0"
                              title="Vista previa desktop del correo"
                            />
                          </div>
                        ) : (
                          <div className="relative">
                            {/* Marco del móvil */}
                            <div className="relative bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl"></div>
                              <div className="bg-white rounded-[2.5rem] overflow-hidden w-[375px] h-[667px]">
                                {/* Barra superior del móvil */}
                                <div className="bg-gray-100 px-4 py-2 flex items-center justify-between border-b">
                                  <span className="text-xs font-medium text-gray-600">9:41</span>
                                  <span className="text-xs font-medium text-gray-600">📧 Gmail</span>
                                  <div className="flex gap-1">
                                    <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                                    <div className="w-4 h-3 bg-gray-400 rounded-sm"></div>
                                  </div>
                                </div>
                                <div className="w-full h-[calc(100%-40px)] overflow-auto">
                                  <iframe
                                    srcDoc={`
                                      <html>
                                        <head>
                                          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
                                          <style>
                                            body {
                                              margin: 0;
                                              padding: 0;
                                              width: 100%;
                                              overflow-x: hidden;
                                            }
                                            * {
                                              max-width: 100% !important;
                                            }
                                            table {
                                              width: 100% !important;
                                            }
                                            img {
                                              max-width: 100% !important;
                                              height: auto !important;
                                            }
                                          </style>
                                        </head>
                                        <body>
                                          ${getPreviewHtml(templateKey).replace(/<html>|<\/html>|<head>.*?<\/head>|<body>|<\/body>/gi, '')}
                                        </body>
                                      </html>
                                    `}
                                    className="w-full h-full border-0"
                                    title="Vista previa móvil del correo"
                                    style={{ minHeight: '600px' }}
                                  />
                                </div>
                              </div>
                            </div>
                            {/* Botón home del móvil */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-gray-700 rounded-full"></div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                          {previewDevice === 'desktop' 
                            ? '💻 Vista en navegador de escritorio (800px)' 
                            : '📱 Vista en iPhone (375px x 667px)'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
