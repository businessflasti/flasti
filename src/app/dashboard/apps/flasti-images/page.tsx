'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, DollarSign, TrendingUp, Star, Users, Clock, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FlastiImagesPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors">
          <ArrowLeft size={16} className="mr-2" />
          <span>Volver a Inicio</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna izquierda - Imagen y detalles básicos */}
        <div className="lg:col-span-1">
          <Card className="overflow-hidden border-border/50 h-full">
            <div className="relative h-64 w-full bg-[#ec4899]/10 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[#ec4899]/20 flex items-center justify-center">
                <img
                  src="/apps/active/images-logo.png"
                  alt="Flasti Images"
                  width={120}
                  height={120}
                  className="drop-shadow-lg rounded-full"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-[#ec4899]/20 border-[#ec4899]/30 text-white">
                  NEW
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">Flasti Images</h1>
              <p className="text-foreground/70 mb-6">
                Genera imágenes impresionantes con inteligencia artificial. Ideal para marketing, diseño y contenido creativo.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <DollarSign className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-sm text-foreground/70">Precio</span>
                  <span className="text-lg font-bold">$5.00 USD</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <TrendingUp className="h-5 w-5 text-primary mb-1" />
                  <span className="text-sm text-foreground/70">Comisión</span>
                  <span className="text-lg font-bold">$2.50 USD</span>
                </div>
              </div>

              <a href="https://flasti.com/images" target="_blank" rel="noopener noreferrer">
                <Button className="w-full mb-3" size="lg">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Ver App en Vivo
                </Button>
              </a>
              <Link href="/dashboard/aplicaciones" passHref>
                <Button variant="secondary" className="w-full" size="lg">
                  Ver Mi Enlace
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Descripción detallada y características */}
        <div className="lg:col-span-2">
          <Card className="border-border/50 h-full">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-primary">Sobre Flasti Images</h2>
              <p className="text-foreground/80 mb-6">
                Flasti Images es una herramienta de generación de imágenes impulsada por inteligencia artificial que te permite crear ilustraciones, fotografías y diseños de alta calidad a partir de descripciones textuales. Con tecnología de vanguardia, Flasti Images transforma tus ideas en imágenes visualmente impactantes en cuestión de segundos.
              </p>

              <h3 className="text-lg font-semibold mb-3">Características Principales</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Generación de Imágenes con IA</span>
                    <p className="text-sm text-foreground/70">Crea imágenes únicas y personalizadas a partir de descripciones textuales detalladas.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Múltiples Estilos Artísticos</span>
                    <p className="text-sm text-foreground/70">Elige entre una amplia variedad de estilos: fotorrealista, pintura, 3D, anime, y muchos más.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Edición y Personalización</span>
                    <p className="text-sm text-foreground/70">Modifica y ajusta las imágenes generadas según tus necesidades específicas.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Alta Resolución</span>
                    <p className="text-sm text-foreground/70">Obtén imágenes en alta definición listas para usar en tus proyectos profesionales.</p>
                  </div>
                </li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">Casos de Uso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Redes Sociales</h4>
                    <p className="text-sm text-foreground/70">Crea contenido visual atractivo para tus publicaciones en redes sociales.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Diseño Gráfico</h4>
                    <p className="text-sm text-foreground/70">Genera ilustraciones y elementos gráficos para tus proyectos de diseño.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Marketing Digital</h4>
                    <p className="text-sm text-foreground/70">Crea banners, anuncios y material promocional de manera rápida y efectiva.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Desarrollo Web</h4>
                    <p className="text-sm text-foreground/70">Genera imágenes personalizadas para sitios web y aplicaciones.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-[#ec4899]/10 rounded-lg p-6 border border-[#ec4899]/20">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-[#ec4899] mr-2" />
                  <h3 className="text-lg font-semibold">Programa de Ganancias</h3>
                </div>
                <p className="text-foreground/80 mb-4">
                  Como miembro de nuestro programa, ganas comisiones por cada venta que generes. Con una comisión del 50% sobre el precio de venta, obtienes $2.50 USD por cada cliente que adquiera Flasti Images a través de tu enlace.
                </p>
                <div className="flex items-center text-sm text-foreground/70">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Pago de comisiones: Inmediato</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Galería de ejemplos */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-6">Ejemplos de Imágenes Generadas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 bg-[#1a1a22]/80">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/examples/flasti-images/floating-city-purple.jpg"
                alt="Ciudad flotante"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-foreground/70 text-center">
                "Un paisaje futurista con edificios flotantes y cielo púrpura"
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 bg-[#1a1a22]/80">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/examples/flasti-images/cat-beach-sunglasses.jpg"
                alt="Gato en playa"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-foreground/70 text-center">
                "Un gato con gafas de sol en una playa tropical"
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 bg-[#1a1a22]/80">
            <div className="relative h-64 w-full overflow-hidden">
              <Image
                src="/examples/flasti-images/enchanted-forest-mushrooms.jpg"
                alt="Bosque encantado"
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardContent className="p-4">
              <p className="text-sm text-foreground/70 text-center">
                "Un bosque encantado con hadas y hongos brillantes"
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
