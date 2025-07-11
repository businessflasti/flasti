"use client";
import Image from "next/image";
import StarRating from "../../shared/star-rating";
import { useEffect, useState } from "react";

function Testimonial() {
    const [testimonialData, setTestimonialData] = useState<any>(null);
    useEffect(() => {
          const fetchData = async () => {
            try {
              const res = await fetch('/api/page-data')
              if (!res.ok) throw new Error('Failed to fetch')
              const data = await res.json()        
              setTestimonialData(data?.testimonialData)
            } catch (error) {
              console.error('Error fetching services:', error)
            }
          }
          fetchData()
        }, [])
        
    return (
        <section className="bg-lightgray dark:bg-secondary py-20 md:py-40">
            <div className="flex flex-col gap-24">
                <div className="container">
                    <div className="flex flex-col gap-14 xl:gap-24">
                        <div className="flex flex-col xl:flex xl:flex-row items-start gap-8">
                            <div className="flex items-center py-3 gap-4 md:gap-8 w-full max-w-xl">
                                <span className="bg-primary dark:text-secondary py-1.5 px-2.5 text-base font-medium rounded-full">5</span>
                                <div className="h-px w-16 bg-black/12 dark:bg-white/12"/>
                                <p className="section-bedge py-1.5 px-4 rounded-full bg-[#323232] text-white">Experiencias reales</p>
                            </div>
                            <div className="flex flex-col gap-11">
                                <div className="flex flex-col gap-5 ">
                                    <h2 className="max-w-3xl">Lo que siempre soñaste, ahora es posible</h2>
                                    <p className="max-w-2xl text-secondary/70 dark:text-white/70">Conoce las experiencias de aquellos que ya están generando ingresos con flasti</p>
                                </div>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">
                            <div className="bg-[#323232] p-4 lg:p-5 flex flex-col justify-between gap-10 rounded-2xl">
                                {/* Tarjeta 1 */}
                                <div className="flex flex-col gap-3 flex-1">
                                    <p className="text-base md:text-sm text-white/70">{testimonialData?.data_1?.preTitle}</p>
                                    <h4 className="text-white text-lg md:text-base">{testimonialData?.data_1?.title}</h4>
                                </div>
                                <div className="flex items-center gap-4 mt-auto">
                                    <Image src={"/images/testimonial/testimonial_1.png"} alt="Image" width={60} height={60} className="rounded-full" />
                                    <div>
                                        <p className="text-white">{testimonialData?.data_1?.author}</p>
                                        <p className="text-white/70 text-base font-normal">{testimonialData?.data_1?.company}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#323232] p-4 lg:p-5 flex flex-col justify-between gap-6 rounded-2xl">
                                {/* Tarjeta 2 achicada */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-base md:text-sm text-white/70">{testimonialData?.data_2?.preTitle}</p>
                                    <h4 className="text-white text-lg md:text-base">{testimonialData?.data_2?.title}</h4>
                                    <div className="flex items-center gap-2.5">
                                        <StarRating count={4.5} color='#FFFFFF' />
                                        <span className="text-base md:text-sm text-white">4.9</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Image src={"/images/testimonial/testimonial_2.png"} alt="Image" width={60} height={60} className="rounded-full" />
                                        <div>
                                            <p className="text-white">{testimonialData?.data_2?.author}</p>
                                            <p className="text-white/70 text-base font-normal">{testimonialData?.data_2?.company}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Image src={"/images/testimonial/comma_vector.svg"} alt="comma" width={45} height={45}/>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#323232] p-4 lg:p-5 flex flex-col justify-between gap-10 rounded-2xl">
                                {/* Tarjeta 3 */}
                                <div className="flex flex-col gap-3">
                                    <p className="text-base md:text-sm text-white/70">{testimonialData?.data_3?.preTitle}</p>
                                    <h4 className="text-white text-lg md:text-base">{testimonialData?.data_3?.title}</h4>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Image src={"/images/testimonial/testimonial_3.png"} alt="Image" width={60} height={60} className="rounded-full" />
                                    <div>
                                        <p className="text-white">{testimonialData?.data_3?.author}</p>
                                        <p className="text-white/70 text-base font-normal">{testimonialData?.data_3?.company}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#323232] p-4 lg:p-5 flex flex-col justify-between gap-10 rounded-2xl">
                                {/* Tarjeta 4: personalizada */}
                                <div className="flex flex-col gap-3 flex-1">
                                    <p className="text-base md:text-sm text-white/70">{testimonialData?.data_3?.preTitle}</p>
                                    <h4 className="text-white text-lg md:text-base">Acabo de empezar y ya entré a mi cuenta, me encanta, pasé meses buscando algo así.</h4>
                                </div>
                                <div className="flex items-center gap-4 mt-auto">
                                    <Image src={"/images/testimonial/testimonial_3.png"} alt="Image" width={60} height={60} className="rounded-full" />
                                    <div>
                                        <p className="text-white">Santiago Hernández</p>
                                        <p className="text-white/70 text-base font-normal">Usuario</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Testimonial;
