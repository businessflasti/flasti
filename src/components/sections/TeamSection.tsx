"use client";

import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { GridBackground } from "@/components/ui/grid-background";
import ProfileCard from "@/components/ui/profile-card";
import { DollarSign, GraduationCap, Home, Clock } from "lucide-react";
import { motion } from "motion/react";

const TeamSection = React.memo(() => {
  useLanguage(); // Mantener la referencia al contexto pero sin desestructurar t

  const teamMembers = [
    {
      name: "Gana dinero",
      role: "Genera ingresos todos los días completando microtrabajos",
      buttonText1: "Rentable",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(144deg,#D35400,#3C66CD_50%,#D35400)]"
            initial={{ backgroundPosition: "0 50%" }}
            animate={{ backgroundPosition: ["0 50%", "100% 50%", "0 50%"] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            style={{ backgroundSize: "400% 400%" }}
          />
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative z-10">
            <DollarSign className="w-10 h-10" style={{ color: '#101010' }} />
          </div>
        </div>
      ),
      imageUrl: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben1min.jpg"
    },
    {
      name: "Sin experiencia",
      role: "Empieza sin ningún tipo de experiencia o estudios previos",
      buttonText1: "Accesible",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(144deg,#D35400,#3C66CD_50%,#D35400)]"
            initial={{ backgroundPosition: "0 50%" }}
            animate={{ backgroundPosition: ["0 50%", "100% 50%", "0 50%"] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            style={{ backgroundSize: "400% 400%" }}
          />
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative z-10">
            <GraduationCap className="w-10 h-10" style={{ color: '#101010' }} />
          </div>
        </div>
      ),
      imageUrl: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben2min.jpg"
    },
    {
      name: "Desde casa",
      role: "Usa tu celular o computadora, sin descargas ni instalaciones",
      buttonText1: "Cómodo",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(144deg,#D35400,#3C66CD_50%,#D35400)]"
            initial={{ backgroundPosition: "0 50%" }}
            animate={{ backgroundPosition: ["0 50%", "100% 50%", "0 50%"] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            style={{ backgroundSize: "400% 400%" }}
          />
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative z-10">
            <Home className="w-10 h-10" style={{ color: '#101010' }} />
          </div>
        </div>
      ),
      imageUrl: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben3min.jpg"
    },
    {
      name: "Sin horarios",
      role: "Trabaja a cualquier hora y en cualquier lugar, sin horarios",
      buttonText1: "Flexible",
      icon: (
        <div className="w-20 h-20 rounded-full overflow-hidden p-[12px] relative">
          <motion.div 
            className="absolute inset-0 bg-[linear-gradient(144deg,#D35400,#3C66CD_50%,#D35400)]"
            initial={{ backgroundPosition: "0 50%" }}
            animate={{ backgroundPosition: ["0 50%", "100% 50%", "0 50%"] }}
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
            style={{ backgroundSize: "400% 400%" }}
          />
          <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative z-10">
            <Clock className="w-10 h-10" style={{ color: '#101010' }} />
          </div>
        </div>
      ),
      imageUrl: "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben4min.jpg"
    }
  ];

  return (
    <GridBackground 
      className="py-24 relative overflow-hidden"
      gridColor="#262626"
      gridSize="40px"
      backgroundColor="#101010"
      maskEnabled={true}
    >
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white dark:text-white light:text-black">
            Ganancia colectiva
          </h2>
          <TextGenerateEffect 
            words="Miles de personas en todo el mundo ya están ganando dinero con nuestra plataforma"
            className="text-foreground/70 mx-auto text-lg md:text-xl md:max-w-screen-md lg:max-w-full"
          />
        </div>

        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex justify-center">
              <ProfileCard
                name={member.name}
                role={member.role}
                buttonText1={member.buttonText1}
                icon={member.icon}
                imageUrl={member.imageUrl}
              />
            </div>
          ))}
        </div>
      </div>
    </GridBackground>
  );
});

TeamSection.displayName = 'TeamSection';

export default TeamSection;