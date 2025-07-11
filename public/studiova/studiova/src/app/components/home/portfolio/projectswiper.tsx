"use client";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

type Project = {
    title: string;
    slug: string;
    ScopeOfWork: string[];
    industry?: string;
    coverImage: string;
};

const Projectswiper = () => {
    const [projects, setProjects] = useState<Project[]>([]);  

    useEffect(() => {
        fetch("/api/projects")
            .then((res) => res.json())
            .then((data) => setProjects(data));
    }, []);

    return (
        <Swiper
            loop
            autoplay={{
                delay: 2000,
                disableOnInteraction: false,
            }}
            slidesPerView={"auto"}
            breakpoints={{
                320: { spaceBetween: 0 },
                640: { spaceBetween: 10 },
                768: { spaceBetween: 20 },
                1024: { spaceBetween: 20 },
                1920: { spaceBetween: 30 },
            }}
            modules={[Autoplay]}
            className="mySwiper"
        >
            {projects.slice(0, 4).map((value,index)=>{
                // Personalizar la primera, segunda, tercera y cuarta imagen
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isThird = index === 2;
                const isFourth = index === 3;
                return(
                    <SwiperSlide key={index}>
                        <div className="relative group flex flex-col gap-3 lg:gap-5">
                            <div className="relative">
                                <div className="w-auto h-80">
                                    <Image
                                        src={value.coverImage}
                                        alt={isFirst ? 'Gana dinero' : isSecond ? 'Sin experiencia' : isThird ? 'Desde casa' : isFourth ? 'Sin horarios' : value.title}
                                        width={530}
                                        height={350}
                                        style={{ width: "100%", maxWidth: "100%", height: "100%", objectFit: "cover" }}
                                        className="rounded-2xl"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 lg:gap-4">
                                <h3>{isFirst ? 'Gana dinero' : isSecond ? 'Sin experiencia' : isThird ? 'Desde casa' : isFourth ? 'Sin horarios' : value.title}</h3>
                                <div className="flex gap-3">
                                    <p className="text-base dark:text-white dark:hover:text-secondary hover:bg-primary border border-secondary/12 dark:border-white/12 w-fit rounded-full py-1 px-3">
                                        {isFirst ? 'Genera ingresos todos los días completando microtrabajos' : isSecond ? 'Empieza sin ningún tipo de experiencia o estudios previos' : isThird ? 'Usa tu celular o computadora, sin descargas ni instalaciones' : isFourth ? 'Trabaja a cualquier hora y en cualquier lugar' : value.ScopeOfWork[0]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                )
            })}
        </Swiper>
    );
};

export default Projectswiper;
