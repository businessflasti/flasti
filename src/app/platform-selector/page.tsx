"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Dices, ArrowRight, Sparkles, TrendingUp, Coins } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PlatformSelectorPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-[#1a1a1a] to-black">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-black relative overflow-hidden flex items-center justify-center p-4">
      {/* Efectos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 5}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
            ¡Bienvenido a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Flasti</span>!
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Elige cómo quieres generar ingresos hoy
          </p>
        </motion.div>

        {/* Selector de plataformas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Opción 1: Microtareas */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border-2 border-blue-500/30 hover:border-blue-500/60 transition-all duration-300 cursor-pointer h-full backdrop-blur-md shadow-2xl hover:shadow-blue-500/20">
              <CardContent className="p-8 flex flex-col h-full">
                {/* Icono */}
                <div className="mb-6 relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Briefcase className="w-10 h-10 text-white" />
                  </div>
                  <TrendingUp className="w-6 h-6 text-blue-400 absolute -top-2 -right-2 animate-pulse" />
                </div>

                {/* Contenido */}
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-white mb-3">
                    Microtareas
                  </h2>
                  <p className="text-gray-300 mb-6 text-lg">
                    Completa tareas simples y gana dinero real. Ideal para generar ingresos constantes y seguros.
                  </p>

                  {/* Características */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Tareas verificadas y seguras</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Pagos garantizados</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Sin riesgo de pérdida</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span>Retiros desde $5 USD</span>
                    </li>
                  </ul>
                </div>

                {/* Botón */}
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-6 text-lg rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-105"
                >
                  Ir a Microtareas
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Opción 2: Games */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="bg-gradient-to-br from-yellow-900/40 to-red-900/40 border-2 border-yellow-500/30 hover:border-yellow-500/60 transition-all duration-300 cursor-pointer h-full backdrop-blur-md shadow-2xl hover:shadow-yellow-500/20 relative overflow-hidden">
              {/* Efecto de brillo */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/10 to-transparent animate-pulse"></div>
              
              <CardContent className="p-8 flex flex-col h-full relative z-10">
                {/* Icono */}
                <div className="mb-6 relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg jackpot-display">
                    <Dices className="w-10 h-10 text-black" />
                  </div>
                  <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
                </div>

                {/* Contenido */}
                <div className="flex-grow">
                  <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-3">
                    Games 🎰
                  </h2>
                  <p className="text-gray-300 mb-6 text-lg">
                    Juega, diviértete y multiplica tus fichas. Para los que buscan emociones fuertes y grandes premios.
                  </p>

                  {/* Características */}
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Juegos emocionantes</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Multiplicadores hasta 1000x</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Bonos y promociones</span>
                    </li>
                    <li className="flex items-center gap-2 text-gray-200">
                      <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                      <span>Retiros rápidos</span>
                    </li>
                  </ul>

                  {/* Badge de nuevo */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm mb-4">
                    <Sparkles className="w-4 h-4" />
                    ¡NUEVO!
                  </div>
                </div>

                {/* Botón */}
                <Button
                  onClick={() => router.push('/games')}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-black py-6 text-lg rounded-xl shadow-lg hover:shadow-yellow-500/50 transition-all duration-300 group-hover:scale-105 uppercase"
                >
                  <Coins className="w-5 h-5 mr-2" />
                  Ir al Games
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-400 text-sm">
            Puedes cambiar entre plataformas en cualquier momento desde el menú lateral
          </p>
        </motion.div>
      </div>
    </div>
  );
}
