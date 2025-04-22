'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  HelpCircle,
  ArrowLeft,
  Search,
  MessageSquare,
  DollarSign,
  Users,
  Shield,
  Clock,
  Smartphone,
  Globe,
  AlertCircle
} from "lucide-react";
import Link from 'next/link';

// Datos para las preguntas frecuentes
const allFaqs = [
  {
    id: 'general-1',
    question: '¿Qué es Flasti y cómo funciona?',
    answer: 'Flasti es una plataforma que te permite ganar dinero promocionando aplicaciones y servicios a través de enlaces de afiliado. Cuando alguien realiza una compra a través de tu enlace, recibes una comisión. El proceso es simple: te registras, obtienes tus enlaces personalizados, los compartes y ganas dinero por cada venta generada.',
    category: 'general'
  },
  {
    id: 'general-2',
    question: '¿Cómo empiezo a ganar dinero con Flasti?',
    answer: 'Para empezar a ganar dinero con Flasti, primero debes registrarte y acceder a tu dashboard. Allí encontrarás tus enlaces de afiliado personalizados que puedes compartir. Cada vez que alguien realiza una compra a través de tu enlace, recibes una comisión. Cuanto más compartas tus enlaces, mayores serán tus ganancias.',
    category: 'general'
  },
  {
    id: 'general-3',
    question: '¿Es Flasti una plataforma legítima?',
    answer: 'Sí, Flasti es una plataforma legítima de marketing de afiliación. Trabajamos con empresas reconocidas y ofrecemos un sistema transparente de comisiones. Miles de usuarios ya están generando ingresos reales a través de nuestra plataforma.',
    category: 'general'
  },
  {
    id: 'general-4',
    question: '¿Necesito experiencia previa para usar Flasti?',
    answer: 'No, no necesitas experiencia previa. Flasti está diseñado para ser fácil de usar, incluso si nunca has trabajado en marketing de afiliación antes. Ofrecemos guías detalladas y soporte para ayudarte en cada paso del camino.',
    category: 'general'
  },
  {
    id: 'pagos-1',
    question: '¿Cuándo recibo mis pagos?',
    answer: 'Los pagos se procesan cada 15 días. Una vez que solicitas un retiro, recibirás tu pago en un plazo de 1-3 días hábiles, dependiendo del método de pago seleccionado. Puedes solicitar un retiro de cualquier cantidad disponible en tu balance.',
    category: 'pagos'
  },
  {
    id: 'pagos-2',
    question: '¿Qué métodos de pago están disponibles?',
    answer: 'Actualmente aceptamos PayPal y transferencias bancarias para los retiros. Puedes configurar tu método de pago preferido en la sección "Retiros" de tu dashboard. Asegúrate de proporcionar la información correcta para evitar retrasos en tus pagos.',
    category: 'pagos'
  },
  {
    id: 'pagos-3',
    question: '¿Cuál es el monto mínimo para solicitar un retiro?',
    answer: 'No hay monto mínimo para solicitar un retiro. Puedes retirar cualquier cantidad disponible en tu balance a través de la sección "Retiros" en tu dashboard.',
    category: 'pagos'
  },
  {
    id: 'pagos-4',
    question: '¿Hay alguna comisión por los retiros?',
    answer: 'No cobramos comisiones por los retiros. Sin embargo, algunos métodos de pago como PayPal pueden aplicar sus propias comisiones. Te recomendamos revisar las políticas de comisiones de tu método de pago seleccionado.',
    category: 'pagos'
  },
  {
    id: 'comisiones-1',
    question: '¿Cómo se calculan las comisiones?',
    answer: 'Las comisiones se calculan como un porcentaje del valor de la venta. El porcentaje varía según tu nivel: Nivel 1 (50%), Nivel 2 (60%) y Nivel 3 (70%). Tu nivel aumenta automáticamente a medida que generas más ganancias.',
    category: 'comisiones'
  },
  {
    id: 'comisiones-2',
    question: '¿Cómo puedo aumentar mis comisiones?',
    answer: 'Puedes aumentar tus comisiones subiendo de nivel. El Nivel 2 (60% de comisión) se desbloquea al alcanzar $20 en ganancias, y el Nivel 3 (70% de comisión) se desbloquea al alcanzar $30 en ganancias. Además, puedes aumentar tus ganancias totales compartiendo tus enlaces en más plataformas y optimizando tus estrategias de marketing.',
    category: 'comisiones'
  },
  {
    id: 'comisiones-3',
    question: '¿Cuánto tiempo tardan en registrarse las comisiones?',
    answer: 'Las comisiones se registran en tu cuenta inmediatamente después de que se realiza una venta a través de tu enlace. Sin embargo, pueden pasar hasta 24 horas para que aparezcan en tu dashboard debido a los procesos de verificación.',
    category: 'comisiones'
  },
  {
    id: 'tecnico-1',
    question: '¿Puedo usar Flasti desde mi teléfono móvil?',
    answer: 'Sí, Flasti está completamente optimizado para dispositivos móviles. Puedes acceder a tu cuenta, compartir enlaces y monitorear tus ganancias desde cualquier smartphone o tablet con conexión a internet.',
    category: 'tecnico'
  },
  {
    id: 'tecnico-2',
    question: '¿Qué hago si olvido mi contraseña?',
    answer: 'Si olvidas tu contraseña, puedes restablecerla fácilmente haciendo clic en "¿Olvidaste tu contraseña?" en la página de inicio de sesión. Recibirás un enlace en tu correo electrónico para crear una nueva contraseña.',
    category: 'tecnico'
  },
  {
    id: 'tecnico-3',
    question: '¿Cómo puedo cambiar mi método de pago?',
    answer: 'Puedes cambiar tu método de pago en la sección "Retiros" de tu dashboard. Haz clic en "Configurar método de pago" y sigue las instrucciones para actualizar tu información.',
    category: 'tecnico'
  },
  {
    id: 'marketing-1',
    question: '¿Dónde puedo compartir mis enlaces de afiliado?',
    answer: 'Puedes compartir tus enlaces en diversas plataformas como redes sociales (Facebook, Instagram, Twitter), mensajería instantánea (WhatsApp, Telegram), email, sitios web o blogs personales, y foros o comunidades online. Lo importante es dirigirte a audiencias que puedan estar interesadas en los productos que promocionas.',
    category: 'marketing'
  },
  {
    id: 'marketing-2',
    question: '¿Cómo puedo aumentar mis ganancias?',
    answer: 'Para aumentar tus ganancias, te recomendamos: 1) Compartir tus enlaces en múltiples plataformas, 2) Crear contenido de valor relacionado con los productos, 3) Dirigirte a audiencias específicas interesadas en los productos, 4) Ser constante en tus promociones, y 5) Analizar qué estrategias funcionan mejor para ti y optimizarlas.',
    category: 'marketing'
  },
  {
    id: 'marketing-3',
    question: '¿Ofrece Flasti materiales de marketing?',
    answer: 'Sí, Flasti ofrece diversos materiales de marketing como banners, imágenes promocionales, descripciones de productos y guías de marketing. Puedes encontrar estos recursos en la sección "Recursos" de tu dashboard.',
    category: 'marketing'
  },
  {
    id: 'seguridad-1',
    question: '¿Cómo protege Flasti mis datos personales?',
    answer: 'Flasti utiliza tecnología de encriptación avanzada para proteger tus datos personales y financieros. Además, nunca compartimos tu información con terceros sin tu consentimiento. Puedes revisar nuestra política de privacidad para más detalles.',
    category: 'seguridad'
  },
  {
    id: 'seguridad-2',
    question: '¿Cómo puedo mantener mi cuenta segura?',
    answer: 'Para mantener tu cuenta segura, te recomendamos: 1) Usar una contraseña fuerte y única, 2) No compartir tus credenciales de acceso, 3) Cerrar sesión cuando uses dispositivos compartidos, y 4) Verificar regularmente la actividad de tu cuenta.',
    category: 'seguridad'
  }
];

// Categorías de preguntas frecuentes
const faqCategories = [
  { id: 'all', name: 'Todas las preguntas', icon: HelpCircle },
  { id: 'general', name: 'General', icon: Globe },
  { id: 'pagos', name: 'Pagos', icon: DollarSign },
  { id: 'comisiones', name: 'Comisiones', icon: Users },
  { id: 'tecnico', name: 'Técnico', icon: Smartphone },
  { id: 'marketing', name: 'Marketing', icon: Users },
  { id: 'seguridad', name: 'Seguridad', icon: Shield }
];

export default function PreguntasFrecuentesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [filteredFaqs, setFilteredFaqs] = useState(allFaqs);

  // Manejar clic en "Contactar con soporte"
  const handleContactSupport = () => {
    // Abrir el chat
    if (window.Tawk_API && window.Tawk_API.maximize) {
      window.Tawk_API.maximize();
    }
  };

  // Filtrar FAQs basado en la búsqueda y categoría
  const handleSearch = (term: string) => {
    setSearchTerm(term);

    let filtered = allFaqs;

    // Filtrar por término de búsqueda
    if (term) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(term.toLowerCase()) ||
        faq.answer.toLowerCase().includes(term.toLowerCase())
      );
    }

    // Filtrar por categoría
    if (activeCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === activeCategory);
    }

    setFilteredFaqs(filtered);
  };

  // Cambiar categoría
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);

    let filtered = allFaqs;

    // Mantener filtro de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro de categoría
    if (category !== 'all') {
      filtered = filtered.filter(faq => faq.category === category);
    }

    setFilteredFaqs(filtered);
  };

  return (
    <div className="container mx-auto p-6 max-w-5xl mt-20">
      {/* Navegación */}
      <div className="mb-6">
        <Link href="/dashboard/centro-ayuda" className="text-primary flex items-center hover:underline">
          <ArrowLeft size={16} className="mr-2" />
          Volver al Centro de Ayuda
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Preguntas frecuentes</h1>
        <p className="text-foreground/70">
          Todo lo que necesitas saber
        </p>
      </div>

      {/* Buscador */}
      <Card className="p-6 mb-8 bg-card/30 backdrop-blur-sm border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50" size={18} />
          <Input
            placeholder="Buscar en preguntas frecuentes..."
            className="pl-10 py-6 text-lg"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </Card>

      {/* Categorías y FAQs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar de categorías */}
        <div className="md:col-span-1">
          <Card className="p-4 bg-card/30 backdrop-blur-sm border border-white/5">
            <h3 className="font-semibold mb-4 px-2">Categorías</h3>
            <div className="space-y-1">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`w-full flex items-center px-2 py-2 rounded-md transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-card/50 text-foreground/80'
                  }`}
                >
                  <category.icon size={16} className="mr-2" />
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Lista de FAQs */}
        <div className="md:col-span-3">
          <Card className="p-6 bg-card/30 backdrop-blur-sm border border-white/5">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq) => (
                  <AccordionItem key={faq.id} value={faq.id}>
                    <AccordionTrigger className="text-left font-medium">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-foreground/80">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="flex flex-col items-center justify-center py-12">
                <AlertCircle size={48} className="text-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">No se encontraron resultados</h3>
                <p className="text-foreground/60 text-center max-w-md mb-6">
                  No hemos encontrado preguntas que coincidan con tu búsqueda. Intenta con otros términos o contacta con soporte para obtener ayuda personalizada.
                </p>
                <Button onClick={handleContactSupport}>
                  Contactar con soporte
                  <MessageSquare size={16} className="ml-2" />
                </Button>
              </div>
            )}
          </Card>

          {/* Soporte */}
          <Card className="p-6 mt-6 bg-card/30 backdrop-blur-sm border border-white/5 relative overflow-hidden">
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
                <MessageSquare size={16} className="ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
