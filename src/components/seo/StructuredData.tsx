export default function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Flasti",
    "url": "https://flasti.com",
    "logo": "https://flasti.com/logo/logo-web.png",
    "description": "Plataforma global de generación de ingresos mediante microtareas en línea. Más de 100,000 usuarios en 20+ países.",
    "foundingDate": "2020",
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "url": "https://flasti.com/contacto"
    },
    "sameAs": [
      "https://www.instagram.com/flastiapp/",
      "https://www.facebook.com/flastiapp",
      "https://www.threads.com/@flastiapp"
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Flasti",
    "url": "https://flasti.com",
    "description": "Genera ingresos completando microtareas en línea. Trabajo desde casa sin experiencia previa.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://flasti.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Plataforma de Microtareas Online",
    "provider": {
      "@type": "Organization",
      "name": "Flasti"
    },
    "areaServed": {
      "@type": "Place",
      "name": "Mundial"
    },
    "description": "Plataforma que permite generar ingresos completando microtareas en línea desde cualquier lugar del mundo.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Registro gratuito. Gana de $0.50 a $10 USD por microtarea completada."
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://flasti.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Registro",
        "item": "https://flasti.com/register"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Sobre Nosotros",
        "item": "https://flasti.com/nosotros"
      }
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "¿Por qué debería unirme a Flasti?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Unirte a Flasti es la decisión que transformará tu forma de ganar dinero. Es ideal para quienes no tienen experiencia y desean comenzar a generar ingresos en línea. Nuestra plataforma fue diseñada para que cualquier persona pueda empezar. Descubre cómo miles de personas en todo el mundo ya están utilizando nuestra plataforma para crear nuevas fuentes de ingresos desde la comodidad de su hogar."
        }
      },
      {
        "@type": "Question",
        "name": "¿Qué son las microtareas en línea?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Las microtareas en línea son tareas rápidas y sencillas que puedes completar desde cualquier dispositivo con conexión a internet. En Flasti, hemos optimizado este proceso para que cualquier persona pueda empezar sin necesidad de conocimientos previos ni largas jornadas de trabajo. Gana dinero a tu ritmo, sin horarios fijos ni compromisos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto dinero puedo ganar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Nuestra plataforma compensa las microtareas completadas con pagos que oscilan entre $0.50 USD y $10 USD. Usted tiene la flexibilidad de elegir la microtarea de su interés, visualizando su compensación antes de comenzar. Las actividades incluyen opciones populares como: mirar un video, probar un juego, descargar una aplicación, completar un registro, calificar un producto o servicio, escribir una reseña corta, llenar un formulario, revisar un contenido (texto, imagen o audio) entre muchas otras."
        }
      },
      {
        "@type": "Question",
        "name": "¿Necesito experiencia previa para empezar?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "¡No! La mayoría de los casos de éxito en Flasti son de personas que nunca antes habían trabajado en Internet ni tenían experiencia en generar ingresos en línea. Nuestra plataforma está diseñada para que cualquier persona pueda comenzar desde cero, sin necesidad de conocimientos previos."
        }
      },
      {
        "@type": "Question",
        "name": "¿Es Flasti legítimo y confiable?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sí, Flasti es una plataforma legítima con más de 100,000 usuarios activos en 20+ países. Los usuarios reciben pagos reales por tareas completadas a través de PayPal y transferencias bancarias. La plataforma está operando desde 2020 con miles de testimonios verificados."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cómo me pagan en Flasti?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Flasti paga a través de PayPal y transferencias bancarias en tu moneda local. Los pagos se procesan de forma rápida y segura. Miles de usuarios han recibido sus pagos exitosamente."
        }
      },
      {
        "@type": "Question",
        "name": "¿Flasti está disponible en mi país?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Flasti opera en más de 20 países a nivel global. La plataforma está disponible en español, inglés y portugués, facilitando el acceso a usuarios de América Latina, España, Estados Unidos, Brasil y muchos otros países."
        }
      },
      {
        "@type": "Question",
        "name": "¿Cuánto tiempo toma empezar a ganar dinero?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Puedes empezar a ganar dinero inmediatamente después de registrarte. El proceso de registro es gratuito y toma menos de 5 minutos. Una vez registrado, puedes comenzar a completar microtareas y ganar entre $0.50 y $10 USD por tarea."
        }
      }
    ]
  };

  const aggregateRatingSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": "Flasti - Plataforma de Microtareas",
    "description": "Plataforma global para ganar dinero completando microtareas en línea",
    "brand": {
      "@type": "Brand",
      "name": "Flasti"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "bestRating": "5",
      "worstRating": "1"
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": "https://flasti.com/register"
    }
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Cómo ganar dinero con Flasti",
    "description": "Guía paso a paso para empezar a ganar dinero completando microtareas en Flasti",
    "totalTime": "PT5M",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Regístrate gratis",
        "text": "Crea tu cuenta en Flasti de forma gratuita. Solo toma 2 minutos.",
        "url": "https://flasti.com/register"
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Elige una microtarea",
        "text": "Explora las microtareas disponibles y elige la que más te guste. Hay tareas desde $0.50 hasta $10 USD."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Completa la tarea",
        "text": "Sigue las instrucciones simples para completar la microtarea. Puede ser ver un video, probar una app, escribir una reseña, etc."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Recibe tu pago",
        "text": "Una vez completada la tarea, recibes tu pago. Retira tus ganancias a través de PayPal o transferencia bancaria en tu moneda local."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateRatingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
}
