'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  MessageSquare,
  Search,
  BookOpen,
  FileText,
  Video,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  DollarSign,
  Share2,
  Settings,
  Users,
  Shield,
  BarChart
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

// Datos de ejemplo para las guías
const guides = [
  {
    id: 'primeros-pasos',
    title: 'Primeros pasos con Flasti',
    description: 'Aprende a configurar tu cuenta y comenzar a generar ingresos',
    icon: BookOpen,
    category: 'basico',
    popular: true
  },
  {
    id: 'enlaces-afiliado',
    title: 'Cómo usar tus enlaces de afiliado',
    description: 'Maximiza tus ganancias compartiendo tus enlaces correctamente',
    icon: Share2,
    category: 'marketing',
    popular: true
  },
  {
    id: 'metodos-pago',
    title: 'Métodos de pago disponibles',
    description: 'Conoce las opciones para recibir tus ganancias',
    icon: DollarSign,
    category: 'pagos',
    popular: false
  },

  {
    id: 'optimizar-ganancias',
    title: 'Cómo optimizar tus ganancias',
    description: 'Estrategias avanzadas para aumentar tus comisiones',
    icon: BarChart,
    category: 'avanzado',
    popular: true
  },
  {
    id: 'seguridad-cuenta',
    title: 'Seguridad de tu cuenta',
    description: 'Protege tu cuenta y tus ganancias',
    icon: Shield,
    category: 'seguridad',
    popular: false
  },
  {
    id: 'redes-sociales',
    title: 'Promoción en redes sociales',
    description: 'Aprende a promocionar tus enlaces en redes sociales',
    icon: Users,
    category: 'marketing',
    popular: false
  },
  {
    id: 'configuracion-perfil',
    title: 'Configuración de tu perfil',
    description: 'Personaliza tu perfil para mejorar tu experiencia',
    icon: Settings,
    category: 'basico',
    popular: false
  },
  {
    id: 'preguntas-frecuentes',
    title: 'Preguntas frecuentes',
    description: 'Respuestas a las dudas más comunes',
    icon: HelpCircle,
    category: 'soporte',
    popular: true
  },
  {
    id: 'contactar-soporte',
    title: 'Contactar con soporte',
    description: 'Habla directamente con nuestro equipo',
    icon: MessageSquare,
    category: 'soporte',
    popular: false
  },
  {
    id: 'estrategias-marketing',
    title: 'Estrategias de marketing digital',
    description: 'Técnicas avanzadas para promocionar tus enlaces',
    icon: Lightbulb,
    category: 'avanzado',
    popular: false
  },
  {
    id: 'retiros-pagos',
    title: 'Retiros y pagos',
    description: 'Todo sobre cómo retirar tus ganancias',
    icon: DollarSign,
    category: 'pagos',
    popular: true
  }
];

// Datos para las preguntas frecuentes
const faqs = [
  {
    question: '¿Cómo empiezo a ganar dinero con Flasti?',
    answer: 'Para empezar a ganar dinero con Flasti, primero debes registrarte y acceder a tu dashboard. Allí encontrarás tus enlaces de afiliado personalizados que puedes compartir. Cada vez que alguien realiza una compra a través de tu enlace, recibes una comisión. Cuanto más compartas tus enlaces, mayores serán tus ganancias.'
  },
  {
    question: '¿Cuándo recibo mis pagos?',
    answer: 'Los pagos se procesan cada 15 días. Una vez que solicitas un retiro, recibirás tu pago en un plazo de 1-3 días hábiles, dependiendo del método de pago seleccionado. Recuerda que debes tener un saldo mínimo para solicitar un retiro.'
  },
  {
    question: '¿Qué métodos de pago están disponibles?',
    answer: 'Actualmente aceptamos PayPal y transferencias bancarias para los retiros. Puedes configurar tu método de pago preferido en la sección "Retiros" de tu dashboard. Asegúrate de proporcionar la información correcta para evitar retrasos en tus pagos.'
  },
  {
    question: '¿Necesito experiencia previa para usar Flasti?',
    answer: 'No, no necesitas experiencia previa. Flasti está diseñado para ser fácil de usar, incluso si nunca has trabajado en marketing de afiliación antes. Ofrecemos guías detalladas y soporte para ayudarte en cada paso del camino.'
  },
  {
    question: '¿Cómo puedo aumentar mis ganancias?',
    answer: 'Para aumentar tus ganancias, te recomendamos: 1) Compartir tus enlaces en múltiples plataformas, 2) Crear contenido de valor relacionado con los productos, 3) Dirigirte a audiencias específicas interesadas en los productos, 4) Ser constante en tus promociones, y 5) Analizar qué estrategias funcionan mejor para ti y optimizarlas.'
  },
  {
    question: '¿Puedo usar Flasti desde mi teléfono móvil?',
    answer: 'Sí, Flasti está completamente optimizado para dispositivos móviles. Puedes acceder a tu cuenta, compartir enlaces y monitorear tus ganancias desde cualquier smartphone o tablet con conexión a internet.'
  }
];

export default function CentroAyudaPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGuides, setFilteredGuides] = useState(guides);
  const [activeCategory, setActiveCategory] = useState('todos');
  const [popularGuides, setPopularGuides] = useState<typeof guides>([]);

  // Filtrar guías basado en la búsqueda y categoría
  useEffect(() => {
    let filtered = guides;

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(guide =>
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (activeCategory !== 'todos') {
      filtered = filtered.filter(guide => guide.category === activeCategory);
    }

    setFilteredGuides(filtered);

    // Establecer guías populares
    setPopularGuides(guides.filter(guide => guide.popular));
  }, [searchTerm, activeCategory]);

  // Manejar clic en "Contactar con soporte"
  const handleContactSupport = () => {
    // Abrir el chat
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Centro de Ayuda</h1>
        <p className="text-foreground/70 mt-1">
          Encuentra respuestas, tutoriales y soporte para todas tus preguntas
        </p>
      </div>

      {/* Hero section */}
      <Card className="p-8 mb-10 bg-card/30 backdrop-blur-sm border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gradient">
              ¿Cómo podemos ayudarte hoy?
            </h2>
            <p className="text-foreground/80 mb-6">
              Nuestro Centro de Ayuda está diseñado para brindarte toda la información que necesitas para tener éxito con Flasti. Explora nuestras guías o busca respuestas específicas.
            </p>

            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
              <Input
                placeholder="Buscar en el centro de ayuda..."
                className="pl-10 py-6 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative w-64 h-64">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl"></div>
              <div className="relative w-full h-full flex items-center justify-center">
                <HelpCircle size={100} className="text-primary/80" />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Guías populares */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Guías populares</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularGuides.map((guide) => (
            <Card key={guide.id} className="p-6 hover:border-primary/20 transition-colors cursor-pointer">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <guide.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium mb-1">{guide.title}</h3>
                  <p className="text-sm text-foreground/70 mb-3">{guide.description}</p>
                  <Link href={`/dashboard/centro-ayuda/${guide.id}`} className="text-primary text-sm flex items-center">
                    Leer más <ChevronRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Pestañas de categorías */}
      <Tabs defaultValue="todos" className="mb-12" onValueChange={setActiveCategory}>
        <h2 className="text-2xl font-bold mb-6">Todas las guías</h2>
        <TabsList className="mb-6">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="basico">Conceptos básicos</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="pagos">Pagos</TabsTrigger>
          <TabsTrigger value="avanzado">Avanzado</TabsTrigger>
          <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
          <TabsTrigger value="soporte">Soporte</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="p-6 hover:border-primary/20 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <guide.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{guide.title}</h3>
                    <p className="text-sm text-foreground/70 mb-3">{guide.description}</p>
                    <Link href={`/dashboard/centro-ayuda/${guide.id}`} className="text-primary text-sm flex items-center">
                      Leer más <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}

            {filteredGuides.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <HelpCircle size={48} className="text-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                <p className="text-foreground/60 text-center max-w-md mb-4">
                  No hemos encontrado guías que coincidan con tu búsqueda. Intenta con otros términos o contacta con soporte.
                </p>
                <Button onClick={handleContactSupport}>
                  Contactar con soporte
                  <MessageSquare size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Las demás pestañas mostrarán el mismo contenido pero filtrado automáticamente por la lógica de useEffect */}
        <TabsContent value="basico" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map((guide) => (
              <Card key={guide.id} className="p-6 hover:border-primary/20 transition-colors cursor-pointer">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <guide.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium mb-1">{guide.title}</h3>
                    <p className="text-sm text-foreground/70 mb-3">{guide.description}</p>
                    <Link href={`/dashboard/centro-ayuda/${guide.id}`} className="text-primary text-sm flex items-center">
                      Leer más <ChevronRight size={14} className="ml-1" />
                    </Link>
                  </div>
                </div>
              </Card>
            ))}

            {filteredGuides.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12">
                <HelpCircle size={48} className="text-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                <p className="text-foreground/60 text-center max-w-md mb-4">
                  No hemos encontrado guías que coincidan con tu búsqueda. Intenta con otros términos o contacta con soporte.
                </p>
                <Button onClick={handleContactSupport}>
                  Contactar con soporte
                  <MessageSquare size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Contenido similar para las demás categorías */}
        <TabsContent value="marketing" className="mt-0">
          {/* Contenido similar */}
        </TabsContent>
        <TabsContent value="pagos" className="mt-0">
          {/* Contenido similar */}
        </TabsContent>
        <TabsContent value="avanzado" className="mt-0">
          {/* Contenido similar */}
        </TabsContent>
        <TabsContent value="seguridad" className="mt-0">
          {/* Contenido similar */}
        </TabsContent>
        <TabsContent value="soporte" className="mt-0">
          {/* Contenido similar */}
        </TabsContent>
      </Tabs>

      {/* Preguntas frecuentes */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Preguntas frecuentes</h2>
        <p className="text-foreground/70 mb-4">
          Todo lo que necesitas saber
        </p>
        <Card className="p-6 bg-card/30 backdrop-blur-sm border border-white/5">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-foreground/80">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Card>
      </div>

      {/* Sección de soporte en vivo */}
      <Card className="p-6 bg-card/30 backdrop-blur-sm border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>

        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">¿No encuentras lo que buscas?</h2>
            <p className="text-foreground/70">
              Nuestro equipo de soporte está disponible para ayudarte con cualquier pregunta
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-[#9333ea] to-[#ec4899] hover:opacity-90 transition-opacity"
            onClick={handleContactSupport}
          >
            Hablar con soporte
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
