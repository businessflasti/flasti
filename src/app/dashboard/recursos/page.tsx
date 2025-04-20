'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Image, Sparkles, Copy, Check, ExternalLink, FileText, FileImage, Film, Instagram, Facebook, Linkedin, Mail, Users, Globe, Twitter } from "lucide-react";
import Link from "next/link";
import BackButton from "@/components/ui/back-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

const ResourcesPage = () => {
  const [copiedText, setCopiedText] = useState<{[key: string]: boolean}>({});

  const apps = [
    {
      id: 1,
      name: "Flasti Imágenes",
      icon: <Image className="text-[#ec4899]" size={24} />,
      price: 5,
      description: "Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.",
      resources: [
        { id: "img-banners", name: "Banners Promocionales", type: "ZIP", category: "marketing", url: "/recursos/flasti-imagenes/banners-promocionales.zip" },
        { id: "img-social", name: "Pack Redes Sociales", type: "ZIP", category: "marketing", url: "/recursos/flasti-imagenes/pack-redes-sociales.zip" },
        { id: "img-email", name: "Plantillas Email", type: "ZIP", category: "marketing", url: "/recursos/flasti-imagenes/plantillas-email.zip" },
      ],
      marketingText: [
        {
          id: "img-desc1",
          title: "Descripción Corta",
          text: "Flasti Imágenes revoluciona la creación de contenido visual con IA avanzada. Genera imágenes profesionales en segundos para cualquier proyecto creativo.",
          category: "copy"
        },
        {
          id: "img-desc2",
          title: "Descripción Larga",
          text: "Flasti Imágenes es la herramienta definitiva para creadores de contenido, diseñadores y marketers que necesitan imágenes de alta calidad sin limitaciones. Utilizando la más avanzada inteligencia artificial, permite generar ilustraciones, fotografías y diseños personalizados en cuestión de segundos. Olvídate de las licencias restrictivas y los bancos de imágenes costosos. Con Flasti Imágenes, tu imaginación es el único límite.",
          category: "copy"
        },
        {
          id: "img-email1",
          title: "Plantilla Email 1",
          text: "Asunto: Revoluciona tu contenido visual con Flasti Imágenes\n\nHola [Nombre],\n\n¿Cansado de buscar imágenes perfectas para tus proyectos? Flasti Imágenes te permite crear exactamente lo que necesitas en segundos.\n\nCon nuestra avanzada IA, puedes generar:\n- Ilustraciones personalizadas\n- Fotografías realistas\n- Diseños únicos para redes sociales\n\nPruébalo hoy mismo: [TU ENLACE DE AFILIADO]\n\nSaludos,\n[Tu Nombre]",
          category: "email"
        },
        {
          id: "img-social1",
          title: "Post Instagram",
          text: "✨ ¡Transforma tus ideas en imágenes impresionantes con #FlastiImágenes! Crea diseños únicos con IA en segundos. Pruébalo ahora con mi enlace en bio. #InteligenciaArtificial #DiseñoDigital",
          category: "social"
        },
        {
          id: "img-social2",
          title: "Post X",
          text: "Acabo de descubrir Flasti Imágenes y es increíble 🤯 Genera cualquier imagen que imagines con IA avanzada. Perfecto para creadores de contenido y diseñadores. Pruébalo aquí: [TU ENLACE]",
          category: "social"
        },
        {
          id: "img-social3",
          title: "Post Facebook",
          text: "¡Descubrí una herramienta que está revolucionando mi forma de crear contenido visual! 🎨 Flasti Imágenes utiliza inteligencia artificial para generar imágenes profesionales en segundos. Ya no necesito pasar horas buscando la imagen perfecta o aprendiendo programas complejos de diseño. ¡Pruébalo con mi enlace y transforma tu creatividad! [TU ENLACE]",
          category: "social"
        },
        {
          id: "img-fb-group",
          title: "Texto para Grupo de Facebook",
          text: "Hola a todos 👋 ¿Alguien más está cansado de pagar por bancos de imágenes o luchar con programas de diseño complicados? Descubrí Flasti Imágenes y ha cambiado completamente mi flujo de trabajo creativo. Es una herramienta de IA que genera imágenes profesionales a partir de descripciones de texto. Perfecta para marketing, redes sociales, blogs, o cualquier proyecto visual. Si quieren probarlo, pueden usar mi enlace: [TU ENLACE] (Sí, gano una pequeña comisión, pero realmente creo que les será útil). Si tienen preguntas, ¡estoy aquí para ayudar! 😊",
          category: "social"
        }
      ]
    },
    {
      id: 2,
      name: "Flasti AI",
      icon: <Sparkles className="text-[#9333ea]" size={24} />,
      price: 7,
      description: "Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.",
      resources: [
        { id: "ai-banners", name: "Banners Promocionales", type: "ZIP", category: "marketing", url: "/recursos/flasti-ai/banners-web.zip" },
        { id: "ai-social", name: "Pack Redes Sociales", type: "ZIP", category: "marketing", url: "/recursos/flasti-ai/kit-redes-sociales.zip" },
        { id: "ai-email", name: "Plantillas Email", type: "ZIP", category: "marketing", url: "/recursos/flasti-ai/plantillas-email.zip" },
      ],
      marketingText: [
        {
          id: "ai-desc1",
          title: "Descripción Corta",
          text: "Flasti AI es tu asistente personal potenciado por inteligencia artificial. Responde preguntas, genera contenido y automatiza tareas para maximizar tu productividad.",
          category: "copy"
        },
        {
          id: "ai-desc2",
          title: "Descripción Larga",
          text: "Flasti AI representa la nueva generación de asistentes virtuales, combinando la potencia de los modelos de lenguaje más avanzados con una interfaz intuitiva y accesible. Capaz de comprender contexto, generar contenido de alta calidad y aprender de tus preferencias, Flasti AI se convierte en tu aliado perfecto para el trabajo, estudio o proyectos personales. Desde responder preguntas complejas hasta crear contenido original o automatizar tareas repetitivas, esta herramienta transformará tu forma de interactuar con la tecnología.",
          category: "copy"
        },
        {
          id: "ai-email1",
          title: "Plantilla Email 1",
          text: "Asunto: Descubre el poder de la IA con Flasti AI\n\nHola [Nombre],\n\nEn la era digital, el tiempo es nuestro recurso más valioso. Flasti AI te ayuda a optimizarlo.\n\nCon Flasti AI puedes:\n- Obtener respuestas instantáneas a tus preguntas\n- Generar contenido de calidad en segundos\n- Automatizar tareas repetitivas\n\nEmpieza a transformar tu productividad: [TU ENLACE DE AFILIADO]\n\nSaludos,\n[Tu Nombre]",
          category: "email"
        },
        {
          id: "ai-social1",
          title: "Post Instagram",
          text: "🧠 Flasti AI ha cambiado mi forma de trabajar. Contenido, respuestas y automatización en un solo lugar. ¡Mi productividad se ha multiplicado! Pruébalo con mi enlace en bio. #InteligenciaArtificial #Productividad",
          category: "social"
        },
        {
          id: "ai-social2",
          title: "Post X",
          text: "Flasti AI es el asistente que siempre quise tener 🚀 Responde preguntas, crea contenido y me ahorra horas de trabajo. Una inversión que vale cada centavo. Pruébalo: [TU ENLACE]",
          category: "social"
        },
        {
          id: "ai-social3",
          title: "Post Facebook",
          text: "¡Acabo de descubrir la herramienta que está transformando mi productividad! 🚀 Flasti AI es un asistente de inteligencia artificial que responde preguntas, genera contenido y automatiza tareas repetitivas. Desde que lo uso, he reducido a la mitad el tiempo que dedico a investigar información y redactar textos. Si valoras tu tiempo y quieres potenciar tu trabajo, te recomiendo probarlo: [TU ENLACE]",
          category: "social"
        },
        {
          id: "ai-fb-group",
          title: "Texto para Grupo de Facebook",
          text: "Hola a todos 👋 Quería compartir un descubrimiento que ha cambiado mi forma de trabajar. Para quienes, como yo, luchan con la sobrecarga de información y tareas, Flasti AI ha sido una revelación. Es un asistente de IA que no solo responde preguntas con precisión, sino que también puede generar contenido, resumir textos largos, y ayudarte con tareas creativas. Lo uso para investigación, redacción, ideas de marketing y mucho más. Si quieren ahorrar tiempo y mejorar su productividad, pueden probarlo con mi enlace: [TU ENLACE] (Sí, recibo una comisión, pero realmente creo que es una herramienta que vale la pena). ¡Feliz de responder cualquier pregunta que tengan! 💻✨",
          category: "social"
        }
      ]
    },
    {
      id: 3,
      name: "Próximamente...",
      icon: <Sparkles className="text-[#facc15] animate-[pulse_1.5s_ease-in-out_infinite]" size={24} />,
      price: 0,
      description: "Una nueva herramienta revolucionaria está en desarrollo. Mantente atento para más información.",
      resources: [
        { id: "coming-1", name: "⚡ En desarrollo", type: "...", size: "...", category: "branding" },
        { id: "coming-2", name: "🔨 Construyendo", type: "...", size: "...", category: "marketing" },
        { id: "coming-3", name: "🚀 Próximamente", type: "...", size: "...", category: "video" },
      ],
      marketingText: [
        {
          id: "coming-desc",
          title: "Próximamente",
          text: "Estamos trabajando en algo revolucionario. Mantente atento para ser el primero en conocer nuestra nueva herramienta.",
          category: "copy"
        }
      ],
      className: "relative overflow-hidden animate-[appear_2s_ease-in-out_infinite]"
    },
  ];

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText({...copiedText, [id]: true});
    toast.success("Texto copiado al portapapeles");

    setTimeout(() => {
      setCopiedText({...copiedText, [id]: false});
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <BackButton />

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Recursos Promocionales</h1>
          <p className="text-foreground/70 mt-1">
            Descarga materiales, utiliza textos promocionales y comparte en redes sociales para maximizar tus conversiones
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {apps.map((app) => (
            <Card
              key={app.id}
              className={`glass-card p-6 relative overflow-hidden ${app.className || ''}`}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#9333ea]/10">
                  {app.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{app.name}</h3>
                  <p className="text-sm text-foreground/70">${app.price} USD</p>
                </div>
              </div>

              <p className="text-foreground/80 mb-6">{app.description}</p>

              <Tabs defaultValue="files" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="files" className="flex items-center gap-2">
                    <FileImage size={16} />
                    <span>Archivos</span>
                  </TabsTrigger>
                  <TabsTrigger value="copy" className="flex items-center gap-2">
                    <FileText size={16} />
                    <span>Textos</span>
                  </TabsTrigger>
                  <TabsTrigger value="social" className="flex items-center gap-2">
                    <Globe size={16} />
                    <span>Redes Sociales</span>
                  </TabsTrigger>
                  <TabsTrigger value="email" className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>Email</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="files" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {app.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 hover:bg-foreground/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {resource.name.includes("Banners") && <Image size={20} className="text-[#ec4899]" />}
                          {(resource.name.includes("Pack") || resource.name.includes("Kit")) && <Globe size={20} className="text-[#9333ea]" />}
                          {resource.name.includes("Plantillas") && <Mail size={20} className="text-[#facc15]" />}
                          <div>
                            <p className="font-medium">{resource.name}</p>
                            <p className="text-sm text-foreground/60">{resource.type}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-[#9333ea]/10 text-[#9333ea] font-medium">Premium</span>
                          <a href={resource.url} download target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download size={18} className="text-[#ec4899] hover:text-[#9333ea] transition-colors" />
                            </Button>
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="copy" className="space-y-4">
                  {app.marketingText
                    .filter(item => item.category === "copy")
                    .map((item) => (
                      <div key={item.id} className="p-4 rounded-lg bg-foreground/5">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 flex items-center gap-1"
                            onClick={() => handleCopyText(item.id, item.text)}
                          >
                            {copiedText[item.id] ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedText[item.id] ? "Copiado" : "Copiar"}</span>
                          </Button>
                        </div>
                        <p className="text-foreground/80 whitespace-pre-line">{item.text}</p>
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  {app.marketingText
                    .filter(item => item.category === "social")
                    .map((item) => (
                      <div key={item.id} className="p-4 rounded-lg bg-foreground/5">
                        <div className="flex justify-between items-center mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.title}</h4>
                            {item.title.includes("Instagram") && <Instagram size={16} className="text-[#E1306C]" />}
                            {item.title.includes("Post X") && (
                              <div className="w-4 h-4 flex items-center justify-center bg-black rounded-sm">
                                <span className="text-white font-bold text-xs">X</span>
                              </div>
                            )}
                            {item.title.includes("Facebook") && <Facebook size={16} className="text-[#4267B2]" />}
                            {item.title.includes("LinkedIn") && <Linkedin size={16} className="text-[#0077B5]" />}
                            {item.title.includes("Grupo") && <Users size={16} className="text-[#4267B2]" />}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 flex items-center gap-1"
                            onClick={() => handleCopyText(item.id, item.text)}
                          >
                            {copiedText[item.id] ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedText[item.id] ? "Copiado" : "Copiar"}</span>
                          </Button>
                        </div>
                        <p className="text-foreground/80 whitespace-pre-line">{item.text}</p>
                      </div>
                    ))}
                </TabsContent>

                <TabsContent value="email" className="space-y-4">
                  {app.marketingText
                    .filter(item => item.category === "email")
                    .map((item) => (
                      <div key={item.id} className="p-4 rounded-lg bg-foreground/5">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-medium">{item.title}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 flex items-center gap-1"
                            onClick={() => handleCopyText(item.id, item.text)}
                          >
                            {copiedText[item.id] ? <Check size={16} /> : <Copy size={16} />}
                            <span>{copiedText[item.id] ? "Copiado" : "Copiar"}</span>
                          </Button>
                        </div>
                        <div className="bg-card p-4 rounded-md">
                          <p className="text-foreground/80 whitespace-pre-line font-mono text-sm">{item.text}</p>
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;