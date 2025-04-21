'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, DollarSign, TrendingUp, Star, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function FlastiAIPage() {
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
            <div className="relative h-64 w-full bg-[#9333ea]/10 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full bg-[#9333ea]/20 flex items-center justify-center">
                <img
                  src="/apps/active/ia-logo.png"
                  alt="Flasti AI"
                  width={120}
                  height={120}
                  className="drop-shadow-lg rounded-full"
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <div className="absolute top-4 right-4">
                <Badge variant="outline" className="bg-[#9333ea]/20 border-[#9333ea]/30 text-white">
                  TOP
                </Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-2">Flasti AI</h1>
              <p className="text-foreground/70 mb-6">
                Asistente de IA avanzado para responder preguntas, generar contenido y automatizar tareas cotidianas.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <DollarSign className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-sm text-foreground/70">Precio</span>
                  <span className="text-lg font-bold">$7.00 USD</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-card/50 rounded-lg border border-border/50">
                  <TrendingUp className="h-5 w-5 text-primary mb-1" />
                  <span className="text-sm text-foreground/70">Comisión</span>
                  <span className="text-lg font-bold">$3.50 USD</span>
                </div>
              </div>

              <a href="https://flasti.com/ai" target="_blank" rel="noopener noreferrer">
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
              <h2 className="text-xl font-bold mb-4 text-primary">Sobre Flasti AI</h2>
              <p className="text-foreground/80 mb-6">
                Flasti AI es un asistente de inteligencia artificial de última generación diseñado para ayudarte a crear contenido de alta calidad, responder preguntas complejas y automatizar tareas cotidianas. Con capacidades avanzadas de procesamiento de lenguaje natural, Flasti AI puede entender y generar texto que parece escrito por humanos.
              </p>

              <h3 className="text-lg font-semibold mb-3">Características Principales</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Generación de Contenido Avanzada</span>
                    <p className="text-sm text-foreground/70">Crea artículos, posts para redes sociales, emails y más con solo unas instrucciones.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Asistente de Investigación</span>
                    <p className="text-sm text-foreground/70">Obtén respuestas precisas a preguntas complejas con fuentes verificadas.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Automatización de Tareas</span>
                    <p className="text-sm text-foreground/70">Configura flujos de trabajo automatizados para tareas repetitivas.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                  <div>
                    <span className="font-medium">Análisis de Datos</span>
                    <p className="text-sm text-foreground/70">Interpreta y visualiza datos complejos de manera sencilla.</p>
                  </div>
                </li>
              </ul>

              <h3 className="text-lg font-semibold mb-3">Casos de Uso</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Marketing Digital</h4>
                    <p className="text-sm text-foreground/70">Genera contenido para campañas, analiza tendencias y optimiza estrategias.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Educación</h4>
                    <p className="text-sm text-foreground/70">Crea materiales didácticos, resúmenes y explicaciones personalizadas.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Desarrollo de Software</h4>
                    <p className="text-sm text-foreground/70">Asistencia en programación, depuración y documentación de código.</p>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-2">Atención al Cliente</h4>
                    <p className="text-sm text-foreground/70">Automatiza respuestas y proporciona soporte 24/7 a tus clientes.</p>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-[#9333ea]/10 rounded-lg p-6 border border-[#9333ea]/20">
                <div className="flex items-center mb-4">
                  <Users className="h-5 w-5 text-[#9333ea] mr-2" />
                  <h3 className="text-lg font-semibold">Programa de Ganancias</h3>
                </div>
                <p className="text-foreground/80 mb-4">
                  Como miembro de nuestro programa, ganas comisiones por cada venta que generes. Con una comisión del 50% sobre el precio de venta, obtienes $3.50 USD por cada cliente que adquiera Flasti AI a través de tu enlace.
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
    </div>
  );
}
