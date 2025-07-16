"use client";


import Image from "next/image";
import { ParallaxProvider } from "react-scroll-parallax";
import LocationBadge from '@/components/dashboard/LocationBadge';
import { useLanguage } from '@/contexts/LanguageContext';

function StudiovaHeroSection() {
    const { t } = useLanguage();
    return (
        <ParallaxProvider>
            <section className="relative flex items-end text-white bg-black h-full min-h-screen">
                <video
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    loop
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    poster="/video/poster.jpg"
                >
                    <source src="/video/video-dem.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 container text-left">
                    {/* Badge de ubicación eliminado */}
                    <div className="flex flex-col gap-6 Xxl:pb-20 pb-10 md:mt-0 mt-[-30vh]">
                        <div className="flex items-start">
                            <p className="text-white/70 max-w-md text-lg md:text-xl font-normal text-left">
                                {t('aprovechaPoder')}
                            </p>
                        </div>
                        <div className="flex flex-col lg:flex-row items-start lg:items-end gap-4">
                            <h1 className="large-heading">flasti</h1>
                        </div>
                    </div>
                </div>
            </section>
        </ParallaxProvider>
    );
}

export default StudiovaHeroSection;
