"use client";

import { useEffect } from "react";
import { ParallaxProvider } from "react-scroll-parallax";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";

function StudiovaHeroSection() {
    const scrollToStats = () => {
        const statsSection = document.querySelector('#stats-section');
        if (statsSection) {
            const offset = 20; // 20px de espacio extra arriba
            const elementPosition = statsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    const words = [
        {
            text: "Comienza",
        },
        {
            text: "a",
        },
        {
            text: "trabajar",
            className: "text-blue-400",
        },
    ];
    
    return (
        <ParallaxProvider>
            <style jsx>{`
                @keyframes gentle-float-1 {
                    0%, 100% { transform: translateY(0px) translateX(0px); }
                    25% { transform: translateY(-8px) translateX(2px); }
                    50% { transform: translateY(-4px) translateX(-1px); }
                    75% { transform: translateY(-12px) translateX(1px); }
                }
                @keyframes gentle-float-2 {
                    0%, 100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
                    33% { transform: translateY(-6px) translateX(-2px) rotate(1deg); }
                    66% { transform: translateY(-10px) translateX(3px) rotate(-1deg); }
                }
                @keyframes gentle-sway {
                    0%, 100% { transform: translateX(0px) rotate(0deg); }
                    50% { transform: translateX(4px) rotate(2deg); }
                }

                @keyframes vertical-float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>
            <section className="relative flex items-start text-white bg-black h-full min-h-[70vh] pt-8">
                {/* Imagen de fondo estática */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: 'url("https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/herouno.webp")'
                        }}
                    />
                </div>
                {/* Overlay elegante con gradiente más oscuro */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-black/90"></div>
                
                {/* Elementos decorativos de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                <div className="relative z-10 container">
                    {/* Layout responsive: centrado en móvil, dos columnas en desktop */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start min-h-[60vh] py-6 lg:py-12">
                        
                        {/* Columna izquierda - Contenido principal */}
                        <div className="flex flex-col gap-10 text-center lg:text-left">


                            {/* Título principal con efecto typewriter */}
                            <div className="space-y-4">
                                <TypewriterEffectSmooth 
                                    words={words} 
                                    className="text-lg sm:text-xl md:text-3xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight text-center lg:text-left"
                                />
                            </div>

                            {/* Subtítulo descriptivo mejorado */}
                            <TextGenerateEffect 
                                words="Aprovecha el poder de internet y empieza ahora mismo a generar ingresos"
                                className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light"
                            />

                            {/* Botón de acción principal con flecha - Solo desktop */}
                            <div className="hidden lg:flex justify-start pt-4">
                                <button
                                    onClick={scrollToStats}
                                    className="force-segoe-display group relative overflow-hidden bg-white/95 backdrop-blur-sm hover:bg-white text-black px-8 py-4 rounded-3xl text-lg font-semibold transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transform hover:scale-105 border border-white/20"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Descubre más
                                        <svg className="w-6 h-6 transition-transform group-hover:translate-y-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.2929 10.2929L12.7071 14.8787C12.3166 15.2692 11.6834 15.2692 11.2929 14.8787L6.70711 10.2929C6.07714 9.66295 6.52331 8.5 7.41421 8.5H16.5858C17.4767 8.5 17.9229 9.66295 17.2929 10.2929Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                </button>
                            </div>

                            {/* Tarjetas flotantes compactas - Solo móvil */}
                            <div className="lg:hidden relative pt-8 h-80">
                                {/* Testimonial 1 - Móvil */}
                                <div className="absolute top-0 left-4 bg-white rounded-3xl p-4 max-w-xs shadow-2xl" style={{animation: 'vertical-float 6s ease-in-out infinite'}}>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[#101010] font-semibold text-sm leading-relaxed">
                                                "Trabajar en flasti es increíble"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                        <img 
                                            src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/soporte.webp" 
                                            alt="María García" 
                                            className="w-6 h-6 rounded-full object-cover"
                                            data-noindex="true"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="text-[#101010] text-xs font-medium">María García</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 2 - Móvil */}
                                <div className="absolute top-20 right-4 bg-[#3C66CD] rounded-3xl p-4 max-w-xs shadow-2xl" style={{animation: 'vertical-float 8s ease-in-out infinite 2s'}}>
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-semibold text-sm leading-relaxed">
                                                "Gracias a flasti puedo pasar más tiempo con mi familia"
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                        <img 
                                            src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/soportedos.webp" 
                                            alt="Carlos Ruiz" 
                                            className="w-6 h-6 rounded-full object-cover"
                                            data-noindex="true"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="text-white text-xs font-medium">Carlos Ruiz</p>
                                        </div>
                                    </div>
                                </div>



                                {/* Estadística - Móvil - Movida hacia la derecha y más abajo */}
                                <div className="absolute top-32 right-6 bg-gradient-to-br from-[#EC4184] to-[#d63384] backdrop-blur-2xl border border-white/20 rounded-3xl p-3 shadow-xl">
                                    <div className="text-center">
                                        <p className="text-lg font-bold text-white">+100K</p>
                                        <p className="text-white/70 text-xs font-medium">Usuarios activos</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de acción principal con flecha - Solo móvil */}
                            <div className="lg:hidden flex justify-center -mt-[76px] pb-8">
                                <button
                                    onClick={scrollToStats}
                                    className="force-segoe-display group relative overflow-hidden bg-white/95 backdrop-blur-sm hover:bg-white text-black px-8 py-4 rounded-3xl text-lg font-semibold transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)] transform hover:scale-105 border border-white/20"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Descubre más
                                        <svg className="w-6 h-6 transition-transform group-hover:translate-y-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.2929 10.2929L12.7071 14.8787C12.3166 15.2692 11.6834 15.2692 11.2929 14.8787L6.70711 10.2929C6.07714 9.66295 6.52331 8.5 7.41421 8.5H16.5858C17.4767 8.5 17.9229 9.66295 17.2929 10.2929Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                                </button>
                            </div>
                        </div>

                        {/* Columna derecha - Elementos flotantes elegantes (solo desktop) */}
                        <div className="hidden lg:block relative h-full">
                            {/* Testimonial 1 - Diseño premium */}
                            <div className="absolute top-16 right-12 bg-white rounded-3xl p-6 max-w-sm shadow-2xl hover:shadow-blue-500/10 transition-all duration-500" style={{animation: 'vertical-float 6s ease-in-out infinite'}}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-3xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#101010] font-semibold text-base leading-relaxed">
                                            "Trabajar en flasti es increíble"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                                    <img 
                                        src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/soporte.webp" 
                                        alt="María García" 
                                        className="w-8 h-8 rounded-full object-cover"
                                        data-noindex="true"
                                        loading="lazy"
                                    />
                                    <div>
                                        <p className="text-[#101010] text-sm font-medium">María García</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial 2 - Diseño premium con delay */}
                            <div className="absolute top-48 right-40 bg-[#3C66CD] rounded-3xl p-6 max-w-sm shadow-2xl hover:shadow-purple-500/10 transition-all duration-500" style={{animation: 'vertical-float 8s ease-in-out infinite 2s'}}>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl flex items-center justify-center shadow-lg">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-base leading-relaxed">
                                            "Gracias a flasti puedo pasar más tiempo con mi familia"
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                                    <img 
                                        src="https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/soportedos.webp" 
                                        alt="Carlos Ruiz" 
                                        className="w-8 h-8 rounded-full object-cover"
                                        data-noindex="true"
                                        loading="lazy"
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">Carlos Ruiz</p>
                                    </div>
                                </div>
                            </div>



                            {/* Elemento adicional - Estadística flotante */}
                            <div className="absolute bottom-20 right-8 bg-gradient-to-br from-[#EC4184] to-[#d63384] backdrop-blur-2xl border border-white/20 rounded-3xl p-4 shadow-xl">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-white">+100K</p>
                                    <p className="text-white/70 text-xs font-medium">Usuarios activos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </ParallaxProvider>
    );
}

export default StudiovaHeroSection;
