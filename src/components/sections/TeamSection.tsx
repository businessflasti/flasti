"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import ProfileCard from "@/components/ui/profile-card";
import { DollarSign, GraduationCap, Home, Clock } from "lucide-react";
import { motion } from "motion/react";

const TeamSection = React.memo(() => {
  useLanguage();

  const teamMembers = [
    {
      name: "Gana dinero",
      role: "Genera ingresos todos los días completando microtareas",
      buttonText1: "Rentable",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="w-full h-full rounded-full bg-[#0D1117]/90 backdrop-blur-xl flex items-center justify-center relative z-10 transition-transform duration-300 border border-white/10">
            <DollarSign className="w-10 h-10 text-yellow-400" />
          </div>
        </div>
      ),
      imageUrl: "/images/principal/ben1min.jpg"
    },
    {
      name: "Sin experiencia",
      role: "Empieza sin ningún tipo de experiencia o estudios previos",
      buttonText1: "Accesible",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-500"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="w-full h-full rounded-full bg-[#0D1117]/90 backdrop-blur-xl flex items-center justify-center relative z-10 transition-transform duration-300 border border-white/10">
            <GraduationCap className="w-10 h-10 text-blue-400" />
          </div>
        </div>
      ),
      imageUrl: "/images/principal/ben2min.jpg"
    },
    {
      name: "Desde casa",
      role: "Usa tu celular o computadora, sin descargas ni instalaciones",
      buttonText1: "Cómodo",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="w-full h-full rounded-full bg-[#0D1117]/90 backdrop-blur-xl flex items-center justify-center relative z-10 transition-transform duration-300 border border-white/10">
            <Home className="w-10 h-10 text-green-400" />
          </div>
        </div>
      ),
      imageUrl: "/images/principal/ben3min.jpg"
    },
    {
      name: "Sin horarios",
      role: "Trabaja a cualquier hora y en cualquier lugar, sin horarios",
      buttonText1: "Flexible",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative group">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-400 via-violet-500 to-fuchsia-500"
            initial={{ backgroundPosition: "0% 50%" }}
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: "200% 200%" }}
          />
          <div className="w-full h-full rounded-full bg-[#0D1117]/90 backdrop-blur-xl flex items-center justify-center relative z-10 transition-transform duration-300 border border-white/10">
            <Clock className="w-10 h-10 text-purple-400" />
          </div>
        </div>
      ),
      imageUrl: "/images/principal/ben4min.jpg"
    }
  ];

  return (
    <div className="py-24 relative overflow-hidden bg-[#0A0A0A]">

      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white via-[#6E40FF] to-[#2DE2E6] bg-clip-text text-transparent animate-gradient-flow">
            Únete a nuestra comunidad
          </h2>
          <p className="mx-auto text-lg md:text-xl md:max-w-screen-md lg:max-w-full text-center text-white/70">
            Miles de personas en todo el mundo ya están ganando dinero con nuestra plataforma
          </p>
        </div>

        {/* Grid de tarjetas optimizado */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto"
          style={{
            contain: 'layout style',
            transform: 'translate3d(0, 0, 0)'
          }}
        >
          {teamMembers.map((member, index) => (
            <motion.div 
              key={index} 
              className="flex justify-center"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1,
                ease: "easeOut"
              }}
              style={{
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden'
              }}
            >
              <ProfileCard
                name={member.name}
                role={member.role}
                buttonText1={member.buttonText1}
                icon={member.icon}
                imageUrl={member.imageUrl}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-github {
          0%, 100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.05);
          }
        }

        @keyframes gradient-flow {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-pulse-github {
          animation: pulse-github 10s ease-in-out infinite;
        }

        .animate-gradient-flow {
          background-size: 200% auto;
          animation: gradient-flow 5s linear infinite;
        }
      `}</style>
    </div>
  );
});

TeamSection.displayName = 'TeamSection';

export default TeamSection;
