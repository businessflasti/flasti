"use client";

import MainLayout from "@/components/layout/MainLayout";
import { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import "../legal-pages-performance.css";

// Metadata se maneja en layout.tsx cuando se usa 'use client'

export default function NosotrosPage() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <Suspense fallback={<div className="container-custom py-16 md:py-24">Cargando...</div>}>
        <div 
          className="min-h-screen"
          style={{
            backgroundColor: '#F6F3F3',
            transform: 'translate3d(0, 0, 0)',
            contain: 'layout style paint',
            backfaceVisibility: 'hidden'
          }}
        >
          <div 
            className="container-custom py-16 md:py-24"
            style={{
              transform: 'translate3d(0, 0, 0)'
            }}
          >
        {/* Sección de Introducción */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: '#111827' }}>
            Sobre Nosotros
          </h1>
          <p className="text-xl max-w-3xl mx-auto" style={{ color: '#6B7280' }}>
            Flasti es una plataforma global diseñada bajo un ecosistema inteligente que simplifica procesos, mejora oportunidades y optimiza la generación de ingresos.
          </p>
        </div>

        {/* Sección de Misión y Visión */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20"
          style={{
            contain: 'layout style',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          <div 
            className="p-8 rounded-3xl transition-opacity duration-300 relative overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint'
            }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#111827' }}>Nuestra Misión</h2>
            <p className="mb-4" style={{ color: '#6B7280' }}>
              Democratizar el acceso a oportunidades y facilitar la generación de ingresos en la economía global, proporcionando herramientas innovadoras y accesibles para todos.
            </p>
              <p style={{ color: '#6B7280' }}>
                Creemos en un mundo donde cualquier persona, independientemente de su ubicación o circunstancias, pueda acceder a oportunidades económicas significativas a través de la tecnología.
              </p>
            </div>
          </div>

          <div 
            className="p-8 rounded-3xl transition-opacity duration-300 relative overflow-hidden"
            style={{
              backgroundColor: '#FFFFFF',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint'
            }}
          >
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4" style={{ color: '#111827' }}>Nuestra Visión</h2>
            <p className="mb-4" style={{ color: '#6B7280' }}>
              Ser la plataforma líder a escala internacional en la creación de oportunidades, construyendo un ecosistema donde millones de personas puedan desarrollar su potencial económico.
            </p>
              <p style={{ color: '#6B7280' }}>
                Aspiramos a transformar la forma en que las personas generan ingresos, aprovechando la tecnología para crear un futuro más equitativo y próspero para todos.
              </p>
            </div>
          </div>
        </div>

        {/* Sección de Valores */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: '#111827' }}>
            Nuestros Valores
          </h2>

          <div 
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            style={{
              contain: 'layout style',
              transform: 'translate3d(0, 0, 0)'
            }}
          >
            <div 
              className="p-6 rounded-3xl transition-opacity duration-300 relative"
              style={{
                backgroundColor: '#FFFFFF',
                transform: 'translate3d(0, 0, 0)',
                contain: 'layout style paint'
              }}
            >
              <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D50A4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Innovación</h3>
                <p style={{ color: '#6B7280' }}>
                  Buscamos constantemente nuevas formas de mejorar y transformar la experiencia digital, impulsando soluciones creativas que generen valor real.
                </p>
              </div>
            </div>

            <div 
              className="p-6 rounded-3xl transition-opacity duration-300 relative"
              style={{
                backgroundColor: '#FFFFFF',
                transform: 'translate3d(0, 0, 0)',
                contain: 'layout style paint'
              }}
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D50A4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Comunidad</h3>
                <p style={{ color: '#6B7280' }}>
                  Construimos relaciones sostenibles basadas en la confianza, la seguridad y la innovación constante, creando un ecosistema donde todos pueden prosperar.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl transition-all duration-700 relative group" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D50A4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Confianza</h3>
                <p style={{ color: '#6B7280' }}>
                  La transparencia y la integridad son fundamentales en todo lo que hacemos, garantizando un entorno seguro y confiable para todos nuestros usuarios.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl transition-all duration-700 relative group" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D50A4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Accesibilidad</h3>
                <p style={{ color: '#6B7280' }}>
                  Diseñamos nuestras soluciones para que sean accesibles a personas de todos los orígenes y niveles de habilidad, eliminando barreras para la participación.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl transition-all duration-700 relative group" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D50A4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Crecimiento</h3>
                <p style={{ color: '#6B7280' }}>
                  Fomentamos el desarrollo personal y profesional, proporcionando las herramientas y el conocimiento necesarios para que nuestros usuarios alcancen su máximo potencial.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl transition-all duration-700 relative group" style={{ backgroundColor: '#FFFFFF' }}>
              <div className="relative z-10">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: '#0D50A4' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Responsabilidad</h3>
                <p style={{ color: '#6B7280' }}>
                  Asumimos la responsabilidad de nuestras acciones y decisiones, comprometiéndonos a operar de manera ética y sostenible en beneficio de todos nuestros stakeholders.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Historia */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-10 text-center" style={{ color: '#111827' }}>
            Nuestra Historia
          </h2>

          <div 
            className="p-8 md:p-10 rounded-3xl relative overflow-hidden transition-opacity duration-300"
            style={{
              backgroundColor: '#FFFFFF',
              transform: 'translate3d(0, 0, 0)',
              contain: 'layout style paint'
            }}
          >
            <div className="relative z-10 space-y-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-24 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#0D50A4' }}>
                    2020
                  </div>
                  <div className="h-full w-0.5 mt-2 hidden md:block" style={{ background: 'linear-gradient(to bottom, #0D50A4, transparent)' }}></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Los inicios</h3>
                  <p style={{ color: '#6B7280' }}>
                    Flasti nació como una idea para democratizar el acceso a oportunidades digitales. Fundada por un grupo de emprendedores apasionados por la tecnología y la inclusión económica, la plataforma comenzó con una visión clara: crear un ecosistema donde cualquier persona pudiera generar ingresos de manera flexible y accesible.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-24 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#0D50A4' }}>
                    2021
                  </div>
                  <div className="h-full w-0.5 mt-2 hidden md:block" style={{ background: 'linear-gradient(to bottom, #0D50A4, transparent)' }}></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Crecimiento y expansión</h3>
                  <p style={{ color: '#6B7280' }}>
                    Tras un año de desarrollo y pruebas, Flasti lanzó su primera versión beta, atrayendo a cientos de usuarios en los primeros meses. La plataforma comenzó a expandirse, incorporando nuevas funcionalidades y mejorando la experiencia del usuario basándose en feedback constante.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-24 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#0D50A4' }}>
                    2022
                  </div>
                  <div className="h-full w-0.5 mt-2 hidden md:block" style={{ background: 'linear-gradient(to bottom, #0D50A4, transparent)' }}></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Innovación tecnológica</h3>
                  <p style={{ color: '#6B7280' }}>
                    Con el objetivo de mejorar constantemente, Flasti implementó tecnologías avanzadas de inteligencia artificial y aprendizaje automático para optimizar la experiencia del usuario y ampliar las oportunidades disponibles en la plataforma.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-24 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#0D50A4' }}>
                    2023
                  </div>
                  <div className="h-full w-0.5 mt-2 hidden md:block" style={{ background: 'linear-gradient(to bottom, #0D50A4, transparent)' }}></div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>Comunidad global</h3>
                  <p style={{ color: '#6B7280' }}>
                    Flasti se consolidó como una plataforma global, alcanzando a usuarios en más de 20 países y facilitando oportunidades de generación de ingresos para personas de diversos orígenes y circunstancias. La comunidad de Flasti creció hasta superar el medio millón de usuarios activos.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-24 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white" style={{ backgroundColor: '#0D50A4' }}>
                    Hoy
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: '#111827' }}>El futuro de Flasti</h3>
                  <p style={{ color: '#6B7280' }}>
                    Actualmente, Flasti continúa innovando y expandiéndose, con el objetivo de llegar a millones de personas en todo el mundo. Estamos comprometidos con nuestra misión de democratizar las oportunidades digitales y seguimos trabajando para crear un ecosistema más inclusivo, accesible y beneficioso para todos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de CTA */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: '#111827' }}>
            Únete a nuestra comunidad
          </h2>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: '#6B7280' }}>
            Sé parte de Flasti y descubre un mundo de oportunidades. Juntos, estamos construyendo el futuro de la generación de ingresos en línea.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/checkout">
              <Button size="lg" className="min-w-[200px] text-white" style={{ backgroundColor: '#0D50A4' }}>
                Comenzar ahora
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg" className="min-w-[200px] transition-opacity duration-300" style={{ backgroundColor: '#FFFFFF', color: '#111827', borderColor: '#E5E7EB' }}>
                Contáctanos
              </Button>
            </Link>
          </div>
        </div>
          </div>
        </div>
      </Suspense>
    </MainLayout>
  );
}
