'use client';

import React from 'react';
import { User, Gift } from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  badge?: {
    text: string;
    color: string;
  };
  price: number;
  period: string;
  subtitle: string;
  description: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  footerText: string;
  buttonText: string;
  buttonStyle: string;
  cardStyle: string;
  textColor: string;
}

export function PricingCards() {
  const plans: PricingPlan[] = [
    {
      id: 'personal',
      name: 'Personal',
      badge: {
        text: 'Popular',
        color: 'bg-gradient-to-r from-orange-400 to-orange-500'
      },
      price: 8,
      period: '/mo',
      subtitle: '',
      description: 'Best value for solo creators',
      features: [
        {
          icon: '📦',
          title: 'Massive Icon Collection',
          description: '40K+ flat, 3D, animated icons.'
        },
        {
          icon: '🖱️',
          title: 'Unlimited Access',
          description: 'Use anywhere, with free updates.'
        },
        {
          icon: '💎',
          title: 'Premium Experience',
          description: 'Fast help and easy customization.'
        },
        {
          icon: '%',
          title: 'Save 25%',
          description: 'Pay less when billed annually'
        }
      ],
      footerText: 'Billed yearly',
      buttonText: 'Upgrade $99',
      buttonStyle: 'bg-black hover:bg-black/90 text-white',
      cardStyle: 'bg-white border-gray-200',
      textColor: 'text-gray-900'
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      badge: {
        text: 'Limited',
        color: 'bg-gradient-to-r from-yellow-600 to-yellow-700'
      },
      price: 189,
      period: '/1 user',
      subtitle: '/One-time payment',
      description: 'Lifetime use in all your work',
      features: [
        {
          icon: '📦',
          title: 'Massive Icon Collection',
          description: '40K+ flat, 3D, animated icons.'
        },
        {
          icon: '🖱️',
          title: 'Unlimited Access',
          description: 'Use anywhere, with free updates.'
        },
        {
          icon: '💎',
          title: 'Premium Experience',
          description: 'Fast help and easy customization.'
        },
        {
          icon: '$',
          title: 'One-time payment',
          description: 'No recurring fees, ever'
        }
      ],
      footerText: 'Available for a limited time',
      buttonText: 'Upgrade now',
      buttonStyle: 'bg-white hover:bg-gray-100 text-black',
      cardStyle: 'bg-gradient-to-br from-gray-900 via-gray-800 to-black border-gray-700',
      textColor: 'text-white'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl border p-6 transition-all duration-300 hover:scale-[1.02] ${plan.cardStyle}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-lg ${plan.id === 'lifetime' ? 'bg-white/10' : 'bg-gray-100'}`}>
                  {plan.id === 'personal' ? (
                    <User className={`w-4 h-4 ${plan.id === 'lifetime' ? 'text-white' : 'text-gray-700'}`} />
                  ) : (
                    <Gift className={`w-4 h-4 ${plan.id === 'lifetime' ? 'text-white' : 'text-gray-700'}`} />
                  )}
                </div>
                <h3 className={`text-base font-semibold ${plan.textColor}`}>
                  {plan.name}
                </h3>
              </div>
              
              {plan.badge && (
                <span className={`${plan.badge.color} text-white text-[10px] font-semibold px-2.5 py-1 rounded-full`}>
                  {plan.badge.text}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-0.5">
                <span className={`text-5xl font-bold ${plan.textColor}`}>
                  ${plan.price}
                </span>
                <span className={`text-base ${plan.id === 'lifetime' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>
              {plan.subtitle && (
                <p className={`text-sm ${plan.id === 'lifetime' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {plan.subtitle}
                </p>
              )}
              <p className={`text-sm mt-1 ${plan.id === 'lifetime' ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.description}
              </p>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${plan.id === 'lifetime' ? 'bg-white/10' : 'bg-gray-100'}`}>
                    <span className="text-lg">{feature.icon}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h4 className={`font-medium text-sm leading-tight mb-0.5 ${plan.textColor}`}>
                      {feature.title}
                    </h4>
                    <p className={`text-xs leading-tight ${plan.id === 'lifetime' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer con texto a la izquierda y botón a la derecha */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <p className={`text-xs ${plan.id === 'lifetime' ? 'text-gray-400' : 'text-gray-500'}`}>
                {plan.footerText}
              </p>
              
              <button
                className={`py-2.5 px-6 rounded-xl text-sm font-semibold transition-all duration-200 whitespace-nowrap ${plan.buttonStyle}`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
