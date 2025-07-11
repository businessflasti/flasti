"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

function Aboutus() {
    const [avatarList, setAvatarList] = useState<any>(null);
    useEffect(() => {
          const fetchData = async () => {
            try {
              const res = await fetch('/api/page-data')
              if (!res.ok) throw new Error('Failed to fetch')
              const data = await res.json()        
              setAvatarList(data?.avatarList)
            } catch (error) {
              console.error('Error fetching services:', error)
            }
          }
          fetchData()
        }, [])

    return (
        <section className="py-20 md:py-40 dark:bg-darkblack">
            <div className="container">
                <div className="flex flex-col 2xl:flex-row gap-10 2xl:gap-28">
                    <div className="flex flex-col gap-5 2xl:gap-7 w-full 2xl:max-w-2xl 2xl:w-full">
                        <div className="flex items-center gap-4 md:gap-8">
                            <span className="bg-primary py-1.5 px-2.5 text-base font-medium rounded-full dark:text-secondary">
                                4
                            </span>
                            <div className="h-px w-16 bg-secondary/12 dark:bg-white/12"/>
                            <p className="text-base font-medium text-white bg-[#1A1A1A] py-1.5 px-4 rounded-full">
                                Impulsa tus ingresos
                            </p>
                        </div>
                        <div className="flex flex-col gap-5 2xl:gap-7">
                            <h2 className="2xl:max-w-3xl text-secondary dark:text-white">Ingresa a un mundo de oportunidades</h2>
                            <p className="2xl:max-w-sm text-secondary/70 dark:text-white/70">Accede al área exclusiva de miembros</p>
                        </div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5 2xl:gap-7">
                        <div className="relative bg-primary p-4 2xl:p-7 flex flex-col justify-between gap-8 md:gap-0 rounded-2xl">
                            <div className="relative z-10 flex flex-col gap-2 lg:gap-4">
                                <div className="flex items-center gap-2">
                                    <Image src="/images/Icon/lock-secure-white.svg" alt="Icono seguridad" width={28} height={28} className="rounded-full" />
                                    <p className="text-white">Retira tus ganancias de forma segura</p>
                                </div>
                            </div>
                            <div className="relative z-10">
                                <div className="relative border-b border-secondary/12 pb-5">
                                    <h2 className="text-white">Sin mínimo de retiro</h2>
                                    <p className="text-base text-white">Cobra sin límites</p>
                                </div>
                                <div className="flex items-center gap-2 lg:gap-5 pt-5">
                                    <Image src="/images/Icon/money-minimal.svg" alt="Icono dinero" width={64} height={64} className="rounded-full bg-white" />
                                    <div>
                                        <p className="font-medium text-white">Sin mínimo de retiro</p>
                                        <p className="text-base text-white">Tu dinero, seguro con cifrado AES-256</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute bottom-0 right-0">
                                <Image src={"/images/home/aboutusIndex/bg-ellipse.svg"} alt="image" width={200} height={200} />
                            </div>
                        </div>
                        <div className="flex flex-col gap-5 2xl:gap-7">
                            <div className="w-full h-full">
                                <Image src={"/images/home/services/services_2.png"} alt="Image" width={340} height={215}  style={{ width: '100%',height:'100%' }} className="rounded-2xl" />
                            </div>
                            <div className="bg-[#323232] p-5 2xl:p-7 flex flex-col justify-between gap-8 rounded-2xl">
                                <div>
                                    <h2 className="text-white">Flasti AI</h2>
                                    <p className="text-base text-white">Trabaja rápido y sin límites con inteligencia artificial</p>
                                </div>
                                <div>
                                    <ul className='avatar flex flex-row items-center'>
                                        {avatarList?.map((items:any, index:any) => (
                                            <li key={index} className='-mr-2 z-1 avatar-hover:ml-2'>
                                                <Image src={items.image} alt='Image' width={44} height={44} quality={100} className='rounded-full border-2 border-secondary' />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="relative overflow-hidden p-5 2xl:p-7 border border-secondary/12 dark:border-white/30 flex flex-col justify-between gap-8 md:gap-0 rounded-2xl">
                            <div className="relative z-10">
                                <h2>Soporte 24/7</h2>
                                <p>Nuestro equipo está listo para ayudarte paso a paso</p>
                            </div>
                            <div className="flex flex-col gap-4 relative z-10">
                                <Image src={"/images/logo/logo-black.svg"} alt="Logo Image" height={44} width={160} className="dark:hidden"/>
                                <Image src={"/images/logo/WhiteLogo.svg"} alt="Logo Image" height={44} width={160} className="hidden dark:block"/>
                                <p>Métodos de retiro disponibles</p>
                            </div>
                            <div className="absolute -top-72 right-0 border border-secondary/12 dark:border-white/30 rounded-full w-[489px] h-[489px]" />
                            <div className="absolute -bottom-36 -right-14 border border-secondary/12 dark:border-white/30 rounded-full w-[489px] h-[489px]" />
                        </div>
                    </div>
                </div>
            </div>
        </section >


    );
}

export default Aboutus;
