"use client";

import { ParallaxProvider } from "react-scroll-parallax";
import { useSeasonalTheme } from "@/hooks/useSeasonalTheme";

function StudiovaHeroSection() {
    const { activeTheme } = useSeasonalTheme();
    const scrollToStats = () => {
        const statsSection = document.querySelector('#stats-section');
        if (statsSection) {
            const offset = 20;
            const elementPosition = statsSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <ParallaxProvider>
            <section 
                className="relative flex items-start text-white bg-black h-full min-h-[70vh] pt-8 overflow-hidden"
                style={{
                    transform: 'translate3d(0, 0, 0)',
                    contain: 'layout style paint',
                    backfaceVisibility: 'hidden'
                }}
            >
                {/* Guirnalda temática - Solo para Halloween y Navidad */}
                {activeTheme === 'halloween' && (
                    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                        {/* Desktop: Guirnalda completa */}
                        <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
                            <path
                                d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10"
                                stroke="#2a2a2a"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.6"
                            />
                            {[...Array(25)].map((_, i) => {
                                const x = (i * 48) + 24;
                                const y = 10 + Math.sin(i * 0.5) * 8;
                                const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
                                const color = colors[i % colors.length];
                                return (
                                    <g key={`light-${i}`}>
                                        <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#2a2a2a" strokeWidth="1" opacity="0.5" />
                                        <ellipse cx={x} cy={y + 20} rx="4" ry="6" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        <ellipse cx={x - 1} cy={y + 18} rx="1.5" ry="2" fill="white" opacity="0.6" />
                                    </g>
                                );
                            })}
                        </svg>
                        {/* Mobile: Guirnalda adaptada */}
                        <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
                            <path d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8" stroke="#2a2a2a" strokeWidth="1.5" fill="none" opacity="0.6" />
                            {[...Array(10)].map((_, i) => {
                                const x = (i * 40) + 20;
                                const y = 8 + Math.sin(i * 0.5) * 5;
                                const colors = ['#ff6b00', '#8b00ff', '#ff6b00', '#8b00ff', '#ff8c00'];
                                const color = colors[i % colors.length];
                                return (
                                    <g key={`light-mobile-${i}`}>
                                        <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#2a2a2a" strokeWidth="0.8" opacity="0.5" />
                                        <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        <ellipse cx={x - 0.8} cy={y + 12} rx="1" ry="1.5" fill="white" opacity="0.6" />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}
                
                {activeTheme === 'christmas' && (
                    <div className="absolute top-0 left-0 right-0 z-50 pointer-events-none">
                        {/* Desktop: Guirnalda navideña */}
                        <svg className="hidden md:block w-full h-16" viewBox="0 0 1200 60" preserveAspectRatio="none">
                            <path
                                d="M 0,10 Q 60,25 120,10 T 240,10 T 360,10 T 480,10 T 600,10 T 720,10 T 840,10 T 960,10 T 1080,10 T 1200,10"
                                stroke="#2a2a2a"
                                strokeWidth="2"
                                fill="none"
                                opacity="0.6"
                            />
                            {[...Array(25)].map((_, i) => {
                                const x = (i * 48) + 24;
                                const y = 10 + Math.sin(i * 0.5) * 8;
                                const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
                                const color = colors[i % colors.length];
                                return (
                                    <g key={`light-${i}`}>
                                        <line x1={x} y1={y} x2={x} y2={y + 15} stroke="#2a2a2a" strokeWidth="1" opacity="0.5" />
                                        <ellipse cx={x} cy={y + 20} rx="4" ry="6" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        <ellipse cx={x - 1} cy={y + 18} rx="1.5" ry="2" fill="white" opacity="0.6" />
                                    </g>
                                );
                            })}
                        </svg>
                        {/* Mobile: Guirnalda navideña adaptada */}
                        <svg className="md:hidden w-full h-12" viewBox="0 0 400 50" preserveAspectRatio="xMidYMid meet">
                            <path d="M 0,8 Q 40,18 80,8 T 160,8 T 240,8 T 320,8 T 400,8" stroke="#2a2a2a" strokeWidth="1.5" fill="none" opacity="0.6" />
                            {[...Array(10)].map((_, i) => {
                                const x = (i * 40) + 20;
                                const y = 8 + Math.sin(i * 0.5) * 5;
                                const colors = ['#ff0000', '#00ff00', '#ffff00', '#0000ff'];
                                const color = colors[i % colors.length];
                                return (
                                    <g key={`light-mobile-${i}`}>
                                        <line x1={x} y1={y} x2={x} y2={y + 10} stroke="#2a2a2a" strokeWidth="0.8" opacity="0.5" />
                                        <ellipse cx={x} cy={y + 14} rx="3" ry="5" fill={color} opacity="0.9" className="animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
                                        <ellipse cx={x - 0.8} cy={y + 12} rx="1" ry="1.5" fill="white" opacity="0.6" />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>
                )}

                {/* Imagen de fondo */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
                    <div 
                        className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                        style={{
                            backgroundImage: 'url("/images/principal/herouno.webp")'
                        }}
                    />
                </div>
                
                {/* Overlay elegante */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/80 to-black/90"></div>
                
                {/* Partículas flotantes sutiles */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(15)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full animate-float-particle"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${8 + Math.random() * 4}s`
                            }}
                        />
                    ))}
                </div>

                {/* Elementos decorativos de fondo mejorados */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }}></div>
                </div>

                <div 
                    className="relative z-10 container"
                    style={{
                        transform: 'translate3d(0, 0, 0)',
                        backfaceVisibility: 'hidden'
                    }}
                >
                    <div 
                        className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start min-h-[60vh] py-6 lg:py-12"
                        style={{
                            contain: 'layout style',
                            transform: 'translate3d(0, 0, 0)'
                        }}
                    >
                        
                        {/* Columna izquierda */}
                        <div className="flex flex-col gap-10 text-center lg:text-left">
                            {/* Título con efecto de brillo */}
                            <div className="space-y-4 px-4 sm:px-6 lg:px-0">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.1] tracking-tight text-center lg:text-left relative">
                                    Comienza a{" "}
                                    <span className="text-blue-400">generar ingresos</span>
                                </h1>
                            </div>

                            {/* Subtítulo */}
                            <p className="text-white/80 text-xl md:text-2xl leading-relaxed max-w-2xl mx-auto lg:mx-0 font-light">
                                Empieza a trabajar completando microtareas en línea
                            </p>

                            {/* Botón mejorado - Desktop */}
                            <div className="hidden lg:flex justify-start pt-4">
                                <button
                                    onClick={scrollToStats}
                                    className="force-segoe-display group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 text-black px-8 py-4 rounded-3xl text-lg font-semibold transition-all duration-300 shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Descubre más
                                        <svg className="w-6 h-6 transition-transform group-hover:translate-y-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.2929 10.2929L12.7071 14.8787C12.3166 15.2692 11.6834 15.2692 11.2929 14.8787L6.70711 10.2929C6.07714 9.66295 6.52331 8.5 7.41421 8.5H16.5858C17.4767 8.5 17.9229 9.66295 17.2929 10.2929Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                </button>
                            </div>

                            {/* Tarjetas móvil */}
                            <div 
                              className="lg:hidden relative pt-8 h-80"
                              style={{
                                transform: 'translate3d(0, 0, 0)',
                                contain: 'layout style'
                              }}
                            >
                                {/* Testimonial 1 - Móvil con efecto */}
                                <div 
                                  className="absolute top-0 left-4 bg-white rounded-3xl p-4 max-w-xs shadow-2xl animate-float-card"
                                  style={{
                                    transform: 'translate3d(0, 0, 0)',
                                    backfaceVisibility: 'hidden'
                                  }}
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="relative">
                                            <img 
                                                src="/images/paypal.png" 
                                                alt="PayPal" 
                                                className="w-10 h-10 object-cover rounded-lg shadow-lg"
                                                data-noindex="true"
                                                loading="lazy"
                                            />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[#101010] font-semibold text-sm leading-relaxed">
                                                Ha recibido <span className="text-green-600 font-bold">$132.00 USD</span> de Flasti LLC
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-gray-200">
                                        <img 
                                            src="/images/principal/soporte.webp" 
                                            alt="María García" 
                                            className="w-6 h-6 rounded-full object-cover ring-2 ring-green-400"
                                            data-noindex="true"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="text-[#101010] text-xs font-medium">María García</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Testimonial 2 - Móvil con efecto */}
                                <div 
                                  className="absolute top-20 right-4 bg-gradient-to-br from-[#0B0F17] to-[#0B0F17] rounded-3xl p-4 max-w-xs shadow-2xl animate-float-card" 
                                  style={{ 
                                    animationDelay: '0.5s',
                                    transform: 'translate3d(0, 0, 0)',
                                    backfaceVisibility: 'hidden'
                                  }}
                                >
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="relative w-10 h-10 rounded-lg shadow-lg flex items-center justify-center" style={{ backgroundColor: '#3C66CE' }}>
                                            <img 
                                                src="/images/banco.webp" 
                                                alt="Banco" 
                                                className="w-full h-full object-contain"
                                                data-noindex="true"
                                                loading="lazy"
                                            />
                                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-ping"></div>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-semibold text-sm leading-relaxed">
                                                Flasti LLC te envió <span className="text-yellow-300 font-bold">$ 58 USD</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                                        <img 
                                            src="/images/principal/soportedos.webp" 
                                            alt="Carlos Ruiz" 
                                            className="w-6 h-6 rounded-full object-cover ring-2 ring-blue-400"
                                            data-noindex="true"
                                            loading="lazy"
                                        />
                                        <div>
                                            <p className="text-white text-xs font-medium">Carlos Ruiz</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Estadística mejorada - Móvil */}
                                <div 
                                  className="absolute top-36 right-6 bg-gradient-to-br from-[#FAD74A] to-[#f5c71a] backdrop-blur-2xl rounded-3xl p-3 shadow-xl animate-float-card" 
                                  style={{ 
                                    animationDelay: '1s',
                                    transform: 'translate3d(0, 0, 0)',
                                    backfaceVisibility: 'hidden'
                                  }}
                                >
                                    <div className="text-center relative">
                                        <p className="text-lg font-bold text-black">+100,000</p>
                                        <p className="text-black/70 text-xs font-medium">Usuarios activos</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón móvil */}
                            <div className="lg:hidden flex justify-center -mt-[76px] pb-8">
                                <button
                                    onClick={scrollToStats}
                                    className="force-segoe-display group relative overflow-hidden bg-gradient-to-r from-white to-gray-50 text-black px-8 py-4 rounded-3xl text-lg font-semibold transition-all duration-300 shadow-xl"
                                >
                                    <span className="relative z-10 flex items-center gap-3">
                                        Descubre más
                                        <svg className="w-6 h-6 transition-transform group-hover:translate-y-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M17.2929 10.2929L12.7071 14.8787C12.3166 15.2692 11.6834 15.2692 11.2929 14.8787L6.70711 10.2929C6.07714 9.66295 6.52331 8.5 7.41421 8.5H16.5858C17.4767 8.5 17.9229 9.66295 17.2929 10.2929Z" fill="currentColor"/>
                                        </svg>
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Columna derecha - Desktop */}
                        <div 
                          className="hidden lg:block relative h-full"
                          style={{
                            transform: 'translate3d(0, 0, 0)',
                            contain: 'layout style'
                          }}
                        >
                            {/* Testimonial 1 - Desktop mejorado */}
                            <div 
                              className="absolute top-16 right-12 bg-white rounded-3xl p-6 max-w-sm shadow-2xl animate-float-card transition-opacity duration-300"
                              style={{
                                transform: 'translate3d(0, 0, 0)',
                                backfaceVisibility: 'hidden'
                              }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <img 
                                            src="/images/paypal.png" 
                                            alt="PayPal" 
                                            className="w-12 h-12 object-cover rounded-xl shadow-lg"
                                            data-noindex="true"
                                            loading="lazy"
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[#101010] font-semibold text-base leading-relaxed">
                                            Ha recibido <span className="text-green-600 font-bold">$132.00 USD</span> de Flasti LLC
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-gray-200">
                                    <img 
                                        src="/images/principal/soporte.webp" 
                                        alt="María García" 
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-green-400"
                                        data-noindex="true"
                                        loading="lazy"
                                    />
                                    <div>
                                        <p className="text-[#101010] text-sm font-medium">María García</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial 2 - Desktop mejorado */}
                            <div 
                              className="absolute top-48 right-40 bg-gradient-to-br from-[#0B0F17] to-[#0B0F17] rounded-3xl p-6 max-w-sm shadow-2xl animate-float-card transition-opacity duration-300" 
                              style={{ 
                                animationDelay: '0.5s',
                                transform: 'translate3d(0, 0, 0)',
                                backfaceVisibility: 'hidden'
                              }}
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative w-12 h-12 rounded-xl shadow-lg flex items-center justify-center p-0.5" style={{ backgroundColor: '#3C66CE' }}>
                                        <img 
                                            src="/images/banco.webp" 
                                            alt="Banco" 
                                            className="w-full h-full object-contain"
                                            data-noindex="true"
                                            loading="lazy"
                                        />
                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-ping"></div>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-base leading-relaxed">
                                            Flasti LLC te envió <span className="text-yellow-300 font-bold">$ 58 USD</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                                    <img 
                                        src="/images/principal/soportedos.webp" 
                                        alt="Carlos Ruiz" 
                                        className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-400"
                                        data-noindex="true"
                                        loading="lazy"
                                    />
                                    <div>
                                        <p className="text-white text-sm font-medium">Carlos Ruiz</p>
                                    </div>
                                </div>
                            </div>

                            {/* Estadística mejorada - Desktop */}
                            <div 
                              className="absolute bottom-20 right-8 bg-gradient-to-br from-[#FAD74A] to-[#f5c71a] backdrop-blur-2xl border-2 border-yellow-500/40 rounded-3xl p-4 shadow-xl animate-float-card transition-opacity duration-300" 
                              style={{ 
                                animationDelay: '1s',
                                transform: 'translate3d(0, 0, 0)',
                                backfaceVisibility: 'hidden'
                              }}
                            >
                                <div className="text-center relative">
                                    <p className="text-2xl font-bold text-black">+100,000</p>
                                    <p className="text-black/70 text-xs font-medium">Usuarios activos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes float-particle {
                        0%, 100% {
                            transform: translateY(0) translateX(0);
                            opacity: 0.3;
                        }
                        50% {
                            transform: translateY(-100px) translateX(50px);
                            opacity: 0.6;
                        }
                    }

                    @keyframes pulse-glow {
                        0%, 100% {
                            opacity: 0.3;
                            transform: scale(1);
                        }
                        50% {
                            opacity: 0.6;
                            transform: scale(1.1);
                        }
                    }

                    @keyframes text-glow {
                        0%, 100% {
                            text-shadow: 0 0 20px rgba(96, 165, 250, 0.5);
                        }
                        50% {
                            text-shadow: 0 0 30px rgba(96, 165, 250, 0.8), 0 0 40px rgba(96, 165, 250, 0.4);
                        }
                    }

                    @keyframes float-card {
                        0%, 100% {
                            transform: translateY(0);
                        }
                        50% {
                            transform: translateY(-10px);
                        }
                    }

                    @keyframes shimmer {
                        0% {
                            transform: translateX(-100%);
                        }
                        100% {
                            transform: translateX(100%);
                        }
                    }

                    .animate-float-particle {
                        animation: float-particle linear infinite;
                    }

                    .animate-pulse-glow {
                        animation: pulse-glow 3s ease-in-out infinite;
                    }

                    .animate-text-glow {
                        animation: text-glow 2s ease-in-out infinite;
                    }

                    .animate-float-card {
                        animation: float-card 3s ease-in-out infinite;
                    }

                    .animate-shimmer {
                        animation: shimmer 2s ease-in-out infinite;
                    }
                `}</style>
            </section>
        </ParallaxProvider>
    );
}

export default StudiovaHeroSection;
