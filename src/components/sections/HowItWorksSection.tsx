"use client";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { BackgroundGradient } from "@/components/ui/background-gradient";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useRouter } from "next/navigation";

const howItWorksImages = [
  "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso1-web.webp",
  "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso2.webp",
  "https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso3.webp"
];

const HowItWorksSection = React.memo(() => {
  const { t } = useLanguage();
  const router = useRouter();

  const handleCardClick = (stepNumber: number) => {
    if (stepNumber === 1) {
      router.push('/register');
    }
  };

  const steps = [
    {
      number: 1,
      title: t('registrateAhora'),
      description: t('registrateDesc'),
      image: howItWorksImages[0]
    },
    {
      number: 2,
      title: 'Completa microtareas',
      description: t('microtareasDesc'),
      image: howItWorksImages[1]
    },
    {
      number: 3,
      title: t('recogeTusRecompensas'),
      description: t('recogeTusRecompensasDesc'),
      image: howItWorksImages[2]
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-[#E75333]">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center" style={{ color: '#FFFFFF' }}>{t('comoFunciona')}</h2>
          <p className="max-w-2xl mx-auto text-center text-lg md:text-xl" style={{ color: '#FFFFFF' }}>
            {t('soloNecesitas')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`floating-card ${step.number === 1 ? 'clickable-card' : ''}`}
              onClick={() => handleCardClick(step.number)}
            >
              <img 
                className="image" 
                alt={step.title} 
                src={step.image}
              />
              <div className="heading">{step.title}</div>
              <p className="description">{step.description}</p>
              <div className="button-container">
                <button className="step-button">
                  <span>{step.number === 1 ? 'Registro' : step.number === 2 ? 'Trabajo' : 'Retiro'}</span>
                  <span className="step-badge">✓</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          .floating-card {
            --dark: #212121;
            --darker: #232323;
            --semidark: #2c2c2c;
            --lightgray: #e8e8e8;
            --unit: 24px;
            background-color: var(--darker);
            border: calc(var(--unit) / 4) solid var(--darker);
            border-radius: 1.5rem;
            position: relative;
            padding: var(--unit);
            overflow: hidden;
            max-width: 350px;
            margin: 0 auto;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }

          .clickable-card {
            cursor: pointer;
          }

          .clickable-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          }

          .floating-card::before {
            content: "";
            position: absolute;
            width: 120%;
            height: 20%;
            top: 40%;
            left: -10%;
            background: linear-gradient(144deg, #ee5635, #3C66CD 50%, #ee5635);
            animation: keyframes-floating-light 2.5s infinite ease-in-out;
            filter: blur(20px);
          }

          @keyframes keyframes-floating-light {
            0% {
              transform: rotate(-5deg) translateY(-5%);
              opacity: 0.5;
            }
            50% {
              transform: rotate(5deg) translateY(5%);
              opacity: 1;
            }
            100% {
              transform: rotate(-5deg) translateY(-5%);
              opacity: 0.5;
            }
          }

          /* Efecto de introducción eliminado */

          .floating-card .image {
            width: 100%;
            height: 200px;
            object-fit: contain;
            border-radius: 1.5rem;
            animation: keyframes-floating-img 10s ease-in-out infinite;
          }

          .floating-card:first-child .image {
            width: 100%;
            height: 200px;
            object-fit: contain;
          }

          @keyframes keyframes-floating-img {
            0% {
              transform: translate(-2%, 2%) scaleY(0.95) rotate(-1deg);
            }
            50% {
              transform: translate(2%, -2%) scaleY(1) rotate(1deg);
            }
            100% {
              transform: translate(-2%, 2%) scaleY(0.95) rotate(-1deg);
            }
          }

          .floating-card .heading {
            font-weight: 600;
            font-size: 18px;
            text-align: center;
            margin-top: calc(var(--unit) * 0.75);
            padding-block: calc(var(--unit) * 0.5);
            color: #FFFFFF;
            font-family: 'Segoe UI Display Semibold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            animation: keyframes-flash-text 3s infinite;
          }

          .floating-card .description {
            font-size: 14px;
            text-align: center;
            color: #b0b0b0;
            margin-bottom: calc(var(--unit) * 2);
            line-height: 1.4;
          }

          @keyframes keyframes-flash-text {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }

          .button-container {
            display: flex;
            justify-content: center;
          }

          .step-button {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            background-color: white;
            color: #000000;
            padding: 8px 16px;
            border-radius: 1.5rem;
            border: none;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.2s;
          }

          .step-button:hover {
            background-color: #f5f5f5;
          }

          .step-badge {
            background-color: #232323;
            color: #FFFFFF;
            padding: 2px 6px;
            border-radius: 1.5rem;
            font-size: 10px;
          }
        `}</style>
      </div>
    </section>
  );
});

export default HowItWorksSection;
