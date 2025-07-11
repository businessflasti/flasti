import { NextResponse } from "next/server";

const avatarList = [
    {
        image: "/images/avatar/avatar_1.jpg",
        title: "Sarah Johnson"
    },
    {
        image: "/images/avatar/avatar_2.jpg",
        title: "Olivia Miller"
    },
    {
        image: "/images/avatar/avatar_3.jpg",
        title: "Sophia Roberts"
    },
    {
        image: "/images/avatar/avatar_4.jpg",
        title: "Isabella Clark"
    },
];

const statsFactData = {
    number: '01',
    name: "Stats & facts",
    heading: "Lo que siempre soñaste, ahora es posible",
    description: "Conoce las experiencias de aquellos que ya están generando ingresos con flasti",
    scoreData: [
        {
            number: 40,
            numberValue: 'K',
            scoreDescp: "People who have launched their websites"
        },
        {
            number: 238,
            scoreDescp: "Experienced professionals ready to assist"
        },
        {
            number: 3,
            numberValue: 'M',
            scoreDescp: "Support through messages and live consultations"
        }
    ]
};

const servicesData = {
    number: '03',
    name: "Services",
    heading: "What we do",
    description: "A glimpse into our creativity—exploring innovative designs, successful collaborations, and transformative digital experiences.",
    data: [
        {
            id: 1,
            image: "/images/home/services/services_1.png",
            heading: "Brand identity",
            descp: "When selecting a web design agency, it's essential to consider its reputation, experience, and the specific needs of your project."
        },
        {
            id: 2,
            image: "/images/home/services/services_2.png",
            heading: "Web development",
            descp: "When selecting a web design agency, it's essential to consider its reputation, experience, and the specific needs of your project."
        },
        {
            id: 3,
            image: "/images/home/services/services_3.png",
            heading: "Content creation",
            descp: "When selecting a web design agency, it's essential to consider its reputation, experience, and the specific needs of your project."
        },
        {
            id: 4,
            image: "/images/home/services/services_4.png",
            heading: "Motion & 3d modeling",
            descp: "When selecting a web design agency, it's essential to consider its reputation, experience, and the specific needs of your project."
        },
    ]
};

const testimonialData = {
    data_1: {
        preTitle: "Hear from them",
        title: "Excelente servicio, ya logré mi primer retiro en casi 3 horas!! Me cuesta ocultar la emoción, estoy muy feliz! Fue fácil y rápido registrarse y las tareas son fáciles de completar, muchísimas gracias!",
        author: "Juan Rodríguez",
        company: "Usuario"
    },
    data_2: {
        preTitle: "Hear from them",
        title: "Es 100% real. Llevo un par de semanas haciendo trabajos y ya cobré varias veces. La verdad estoy muy contenta porque siempre resuelven mis dudas rápido y con mucha amabilidad. Hasta convencí a mi esposo para que lo intente y los resultados han sido mejores de lo que esperábamos. Gracias",
        author: "Ana González",
        company: "Usuaria"
    },
    data_3: {
        preTitle: "Hear from them",
        title: "No pensé que esto funcionara tan bien, recuperé mi inversión el mismo día y hasta gané un extra, puedo decir con total honestidad que nunca imaginé que haciendo esto podía ganar dinero por internet, es un alivio saber que aún es posible tener un trabajo digno a pesar de la situación económica difícil que estamos pasando en el país, la página es confiable y segura, la recomiendo totalmente",
        author: "Luis López",
        company: "Usuario"
    },
};

const teamData = {
    number: '06',
    data: [
        {
            image: "/images/home/team/team-img-1.png",
            name: "Martha Finley",
            position: "Creative Director",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/team-img-2.png",
            name: "Floyd Miles",
            position: "Marketing Strategist",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/team-img-3.png",
            name: "Glenna Snyder",
            position: "Lead Designer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
        {
            image: "/images/home/team/team-img-4.png",
            name: "Albert Flores",
            position: "UX/UI Developer",
            socialLinks: [
                {
                    icon: "/images/socialIcon/twitter.svg",
                    link: "https://twitter.com"
                },
                {
                    icon: "/images/socialIcon/Be.svg",
                    link: "https://www.behance.net/"
                },
                {
                    icon: "/images/socialIcon/linkedin.svg",
                    link: "https://linkedin.com"
                }
            ]
        },
    ]
};

const pricingData = {
    data: [
        {
            planName: "Launch",
            planPrice: "$699",
            planDescp: "Ideal for startups and small businesses taking their first steps online.",
            planIncludes: ["Competitive research & insights","Wireframing and prototyping","Basic tracking setup (Google Analytics, etc.)","Standard contact form integration"]
        },
        {
            planName: "Scale",
            tag: "Most popular",
            planPrice: "$1,699",
            cancelPrice: "$2,199",
            planDescp: "Perfect for growing brands needing more customization and flexibility.",
            planIncludes: ["Everything in the Launch Plan","Custom design for up to 10 pages","Seamless social media integration","SEO enhancements for key pages"]
        },
        {
            planName: "Elevate",
            planPrice: "$3,499",
            planDescp: "Best suited for established businesses wanting a fully tailored experience.",
            planIncludes: ["Everything in the Scale Plan","E-commerce functionality (if needed)","Branded email template design","Priority support for six months after launch"]
        },
    ],
    partnerLogo: [
        { light: "/images/home/pricing/partner-1.svg", dark: "/images/home/pricing/partner-dark-1.svg" },
        { light: "/images/home/pricing/partner-2.svg", dark: "/images/home/pricing/partner-dark-2.svg" },
        { light: "/images/home/pricing/partner-3.svg", dark: "/images/home/pricing/partner-dark-3.svg" },
        { light: "/images/home/pricing/partner-4.svg", dark: "/images/home/pricing/partner-dark-4.svg" },
        { light: "/images/home/pricing/partner-5.svg", dark: "/images/home/pricing/partner-dark-5.svg" },
      ],
};

const faqData = {
    data: [
        {
            faq_que: "¿Por qué debería unirme a Flasti?",
            faq_ans: 'Unirte a Flasti es la decisión que transformará tu forma de ganar dinero. Es ideal para quienes no tienen experiencia y desean comenzar a generar ingresos en línea. Nuestra plataforma fue diseñada para guiarte paso a paso con estrategias comprobadas. Y si ya tienes conocimientos, Flasti te llevará al siguiente nivel con herramientas avanzadas.\n\nDescubre cómo miles de personas en todo el mundo ya están utilizando nuestra plataforma para crear nuevas fuentes de ingresos desde la comodidad de su hogar.\n\nFlasti es más que una plataforma, es tu oportunidad de estar un paso adelante y formar parte de la nueva era digital. ¿Estás listo para dar el salto?'
        },
        {
            faq_que: "¿Qué son los microtrabajos en línea?",
            faq_ans: 'Los microtrabajos en línea son tareas rápidas y sencillas que puedes completar desde cualquier dispositivo con conexión a internet. En Flasti, hemos optimizado este proceso para que cualquier persona pueda empezar sin necesidad de conocimientos previos ni largas jornadas de trabajo, aprovechando esta nueva forma de ganar dinero.\n\n💰 Oportunidades disponibles en todo momento\n\nGana dinero a tu ritmo, sin horarios fijos ni compromisos. Puedes generar un ingreso estable para tu día a día o simplemente obtener un extra en tu tiempo libre.\n\n🚀 Sin experiencia ni largas jornadas\n\nFlasti está diseñado para que aproveches al máximo y conviertas tareas digitales en dinero real de forma sencilla y rápida.\n\n¡Comienza ahora y descubre lo fácil que es generar ingresos con Flasti!'
        },
        {
            faq_que: "¿Cuánto dinero puedo ganar?",
            faq_ans: '¡Aquí es donde entras tú! 💎\n\nTienes el control total: puedes generar un ingreso estable para tu día a día o simplemente ganar un extra en tu tiempo libre.\n\n💥 Elige cómo y cuánto ganar\n\nCompleta microtrabajos de corto, mediano o largo plazo según tu tiempo disponible y cuánto dinero quieras generar. Tú decides hasta dónde llegar.\n\n¡Elige tu camino y empieza a ganar! 🚀'
        },
        {
            faq_que: "¿Necesito experiencia previa para empezar?",
            faq_ans: '¡No! La mayoría de los casos de éxito en Flasti son de personas que nunca antes habían trabajado en Internet ni tenían experiencia en generar ingresos en línea.\n\nNuestra plataforma está diseñada para guiarte paso a paso desde cero, con estrategias comprobadas que cualquiera puede seguir.\n\nSi ellos lo lograron, tú también puedes comenzar a ganar dinero con Flasti hoy mismo.'
        },
        {
            faq_que: "¿Cuál es la inversión para acceder a Flasti?",
            faq_ans: 'Yes, we provide post-launch support to ensure smooth implementation and offer ongoing maintenance packages for clients needing regular updates or technical assistance.'
        },
        {
            faq_que: "¿Y si no me gusta, tengo alguna garantía?",
            faq_ans: 'En Flasti, tu satisfacción es nuestra prioridad. Por eso, cuentas con una garantía incondicional de 7 días. Estamos tan seguros de que te encantará nuestra plataforma, que asumimos todo el riesgo. Si, por algún motivo, no cumple con tus expectativas o no estás completamente satisfecho, podrás solicitar un reembolso del 100% de tu dinero, sin tener que dar justificaciones ni llenar formularios interminables con preguntas incómodas.\n\nÚnete sin preocupaciones. ¡Tu inversión está completamente protegida!'
        }
    ]
};
const contactData = {
    keypoint:["Always-On Customer Support","Service Across the Globe"],
    managerProfile:{
        image:"/images/avatar/avatar_1.jpg",
        name:"Courtney Henry",
        position:"Onboarding & Success Manager"
    }
}

const aboutusStats = [
    {
        number: 45,
        postfix:"+",
        title: 'Presence in global markets',
        descp: "Expanding reach across international regions with localized expertise and worldwide impact."
    },
    {
        number: 15,
        prefix: "$",
        postfix: "M",
        title: 'In strategic investments',
        descp: "Driving growth with curated partnerships and high-performing, audience-driven initiatives."
    },
    {
        number: 158,
        postfix: "+",
        title: 'Trusted brand collaborations',
        descp: "Shaping industry conversations through innovation, creativity, and lasting influence."
    },
]

const servicesSliderData = [
    "Branding", "Web development", "Agency","Content creation","SaaS","Motion & 3d modeling","Photography"
]



export const GET = async () => {
    return NextResponse.json({
        avatarList,
        statsFactData,
        servicesData,
        testimonialData,
        teamData,
        pricingData,
        faqData,
        contactData,
        aboutusStats,
        servicesSliderData
    });
};