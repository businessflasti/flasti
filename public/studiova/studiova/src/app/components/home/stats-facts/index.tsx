"use client";
import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import NavigationLink from "../../shared/navigation-link";
import { useEffect, useState } from "react";

function StatsFacts() {
    const [statsFactData, setStatsFactData] = useState<any>(null);
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/page-data')
                if (!res.ok) throw new Error('Failed to fetch')
                const data = await res.json()
                if (data) {
                    setStatsFactData(data?.statsFactData)
                }
                else{
                    console.error('No data found for statsFactData')
                }
            } catch (error) {
                console.error('Error fetching services:', error)
            }
        }
        fetchData()
    }, [])


    return (
        <section className="relative bg-white dark:bg-secondary overflow-hidden">
            <div className="relative py-20 md:py-40 z-10">
                <div className="container">
                    <div className="flex flex-col xl:flex xl:flex-row items-start gap-8">
                        <div className="flex items-center py-3 gap-4 md:gap-8 w-full max-w-xl">
                            <span className="bg-primary py-1.5 px-2.5 text-base font-medium rounded-full dark:text-secondary">1</span>
                            <div className="h-px w-16 bg-black/12 dark:bg-white/12" />
                            <p className="section-bedge py-1.5 px-4 rounded-full bg-[#1A1A1A] text-white">Juntos es mejor</p>
                        </div>
                        <div className="flex flex-col gap-11">
                            <div className="flex flex-col gap-5 ">
                                <h2 className="max-w-3xl">Ganancia colectiva</h2>
                                <p className="max-w-xl text-secondary/70 dark:text-white/70">Accede a la plataforma y comienza a generar ingresos con flasti</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {statsFactData && statsFactData?.scoreData?.map((value: any, index: any) => {
                                    // Personalización para las tarjetas específicas
                                    let number = value.number;
                                    let numberValue = value.numberValue;
                                    let scoreDescp = value.scoreDescp;
                                    let isCustom = false;
                                    // Primer cambio: Generados por usuarios
                                    if (scoreDescp === 'People who have launched their websites' || scoreDescp === 'Personas que han lanzado sus sitios web') {
                                        number = 24;
                                        numberValue = 'M';
                                        scoreDescp = 'Generados por usuarios';
                                        isCustom = true;
                                    }
                                    // Segundo cambio: Microtrabajos completados
                                    if (scoreDescp === 'Experienced professionals ready to assist' || scoreDescp === 'Profesionales experimentados listos para ayudar') {
                                        number = 1.3;
                                        numberValue = 'M';
                                        scoreDescp = 'Microtrabajos completados';
                                        isCustom = true;
                                    }
                                    // Tercer cambio: Soporte y consultas en vivo
                                    if (scoreDescp === 'Support through messages and live consultations' || scoreDescp === 'Soporte por mensajes y consultas en vivo') {
                                        number = 100;
                                        numberValue = 'K';
                                        scoreDescp = 'Ya son parte de nuestra comunidad';
                                        isCustom = true;
                                    }
                                    return (
                                        <div ref={ref} key={index} className="flex flex-col gap-5 pt-4 md:pt-11 border-t border-secondary/12 dark:border-white/12">
                                            <h3 className="text-5xl md:text-6xl Xxl:text-7xl font-bold">
                                                {inView ? <CountUp start={0} end={number} duration={3} prefix={isCustom ? '' : ''} decimals={isCustom && number % 1 !== 0 ? 1 : 0} /> : (isCustom ? '0' : '0')}
                                                {numberValue && <span>{numberValue}</span>}
                                                <span>+</span>
                                            </h3>
                                            <p className="text-base text-secondary/70 dark:text-white/70">{scoreDescp}</p>
                                        </div>
                                    )
                                })}
                            </div>
                            <div>
                                <NavigationLink navigationTitle="Flasti en números" navigationLink="/about" transform={false} disabled={true} className="pointer-events-none opacity-60 select-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-28 -left-20">
                <Image src={"/images/home/statsfact/sectionbg.png"} alt="image" height={590} width={590} className="dark:hidden" />
                <Image src={"/images/home/statsfact/sectionbgdark.png"} alt="image" height={590} width={590} className="hidden dark:block" />
            </div>
        </section>
    );
}

export default StatsFacts;
