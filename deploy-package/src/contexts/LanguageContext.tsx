import Reac--- a/Users/usuario/Documents/Copia de v2.2 (live)/src/components/sections/TestimonialsSection.tsx
+++ b/Users/usuario/Documents/Copia de v2.2 (live)/src/components/sections/TestimonialsSection.tsx
@@ -82,7 +82,7 @@
  return (
    <section className="py-16 relative overflow-hidden">
      {/* Elementos decorativos */}
-			<div className="absolute inset-0 z-0">
+			<div className="absolute inset-0 z-0 hardware-accelerated">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-[#9333ea]/5 blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-[#ec4899]/5 blur-3xl"></div>
      </div>
@@ -113,7 +113,7 @@
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
-											i < testimonial.rating
+											i < testimonial.rating 
                        ? "text-[#facc15] fill-[#facc15]"
                        : "text-foreground/30"
                    }`}
@@ -148,7 +148,7 @@
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
-											index === currentIndex
+											index === currentIndex 
                        ? "bg-[#ec4899] scale-110"
                        : "bg-white/20"
                    }`}
@@ -157,7 +157,7 @@
 
              <button
                onClick={prevTestimonial}
-								className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#ec4899]/70 transition-colors"
+								className="absolute top-1/2 -translate-y-1/2 -left-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/70 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="h-6 w-6" />
@@ -165,7 +165,7 @@
 
              <button
                onClick={nextTestimonial}
-								className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#ec4899]/70 transition-colors"
+								className="absolute top-1/2 -translate-y-1/2 -right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/70 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="h-6 w-6" />
@@ -194,7 +194,7 @@
                <Star
                  key={i}
                  className="h-5 w-5 text-[#facc15] fill-[#facc15]"
-								/>
+								/> 
              ))}
              {/* Last star with partial fill to represent 4.9 */}
              <div className="relative overflow-hidden w-5 h-5">
@@ -219,7 +219,7 @@
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
-										index === currentIndex
+										index === currentIndex 
                      ? "bg-[#ec4899] scale-110"
                      : "bg-white/20"
                  }`}
@@ -228,7 +228,7 @@
 
            <button
              onClick={prevTestimonial}
-							className="absolute top-1/3 -translate-y-1/2 left-0 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#ec4899]/70 transition-colors"
+							className="absolute top-1/3 -translate-y-1/2 left-0 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/70 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
@@ -236,7 +236,7 @@
 
            <button
              onClick={nextTestimonial}
-							className="absolute top-1/3 -translate-y-1/2 right-0 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#ec4899]/70 transition-colors"
+							className="absolute top-1/3 -translate-y-1/2 right-0 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-[#d4386c]/70 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
t, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Definir traducciones para diferentes textos en la aplicación
export const translations = {
  es: {
    // Navbar
    iniciarSesion: 'Iniciar sesión',
    modoClaro: 'Claro',
    modoOscuro: 'Oscuro',

    // Hero Section
    genera: 'Genera',
    con: 'con',
    aprovechaPoder: 'Aprovecha el poder de internet y empieza ahora mismo a generar ingresos',
    empiezaGanar: 'Empieza a ganar',
    rotatingWords: [
      { text: "ingresos", color: "from-[#d4386c] to-[#3359b6]" }, 
      { text: "dinero extra", color: "from-[#d4386c] to-[#3359b6]" }, 
      { text: "oportunidades", color: "from-[#d4386c] to-[#3359b6]" } 
    ],
    generadosPorUsuarios: 'Generados por usuarios',
    generadosPor: 'Generados por',
    usuarios: 'usuarios',
    microtrabajosCompletados: 'Microtrabajos completados',
    microtrabajos: 'Microtrabajos',
    completados: 'completados',
    personasFormanParte: 'Más de 100.000 ya son parte de nuestra comunidad',
    detectandoUbicacion: 'Detectando ubicación...',
    accesoGlobal: 'Acceso Global',
    errorCargarEstadisticas: 'Error al cargar estadísticas:',
    usuario1: 'Usuario 1',
    usuario2: 'Usuario 2',
    usuario3: 'Usuario 3',
    pagoSeguroLabel: 'Pago Seguro',
    accesoExclusivoPlataforma: 'Acceso exclusivo a la plataforma',
    soporte24_7: 'Soporte 24/7',
    asistenciaPersonalizada: 'Asistencia personalizada paso a paso',
    suiteCompleta: 'Suite completa',
    accesoFuncionesPremium: 'Acceso a todas las funciones premium',
    actualizacionesGratuitas: 'Actualizaciones gratuitas',
    nuevasFuncionesSinCosto: 'Nuevas funciones sin costo adicional',
    comoInicioSesion: '¿Cómo inicio sesión?',
    instruccionesInicioSesion: 'Una vez completado el pago, serás redirigido automáticamente a tu panel de control. También recibirás un correo electrónico de confirmación con tus datos de acceso. Si por alguna razón no puedes acceder, simplemente ve a la página de inicio de sesión, ingresa el correo electrónico que usaste para registrarte y tu contraseña. Si olvidaste tu contraseña, puedes restablecerla fácilmente desde la misma página.',
    accesoInmediato: 'Acceso inmediato',
    comienzaGenerarIngresos: 'Comienza a generar ingresos ahora mismo',
    accesoPorVida: 'Acceso de por vida',
    sinLimitesRenovaciones: 'Sin límites de tiempo ni renovaciones',
    garantia7Dias: 'Garantía de 7 días',
    devolucion100: 'Devolución del 100% si no estás satisfecho',
    loQueObtienes: 'Lo que obtienes:',
    accesoCompletoPlataforma: 'Acceso completo a la plataforma de microtrabajos asistidos por IA',
    herramientasAutomatizacion: 'Herramientas de automatización para maximizar tus ganancias',
    tutorialesGuias: 'Tutoriales y guías paso a paso para comenzar desde cero',
    accesoComunidad: 'Acceso a la comunidad exclusiva de usuarios de Flasti',
    actualizacionesSinCosto: 'Actualizaciones y nuevas funcionalidades sin costo adicional',
    terminandoseRapidoDisponibles: '¡Terminándose rápido! Últimos cupos disponibles',
    empiezaGanarMayus: 'EMPIEZA A GANAR',
    pagoSeguroLabel2: 'Pago seguro',
    monedaLocal2: 'Moneda local',
    pagoSeguroTarjeta: 'Pago seguro con tarjeta de crédito, débito o transferencia bancaria',
    instruccionesInicioSesionSimple: 'Después de completar el pago, serás llevado automáticamente a la página de registro donde podrás crear tu cuenta y acceder de inmediato a tu panel personal.',

    // Footer
    plataformaSegura: 'Plataforma Segura',
    encriptacionAES: 'Encriptación AES-256 y TLS 1.3',
    cifradoSSL: 'Cifrado SSL',
    pagosProtegidos: 'Pagos Protegidos',
    transaccionesSeguras: 'Transacciones 100% seguras',
    retirosVerificados: 'Retiros Verificados',
    gananciaColectiva: 'Ganancia colectiva',
    empresa: 'Empresa',
    sobreNosotros: 'Sobre nosotros',
    contacto: 'Contacto',
    legal: 'Legal',
    informacionLegal: 'Información legal',
    terminosCondiciones: 'Términos y condiciones',
    recursos: 'Recursos',
    politicaPrivacidad: 'Política de privacidad',
    derechosReservados: 'Todos los derechos reservados.',
    volverArriba: 'Volver arriba',

    // Testimonials Section
    experienciasUsuarios: 'Conoce las experiencias de aquellos que ya están<br />generando ingresos con Flasti',
    experienciasUsuariosMobile: 'Conoce las experiencias<br />de aquellos que ya están<br />generando ingresos con Flasti',

    // Dashboard Preview Section
    metodosRetiroDisponibles: 'Métodos de retiro disponibles',
    cuentaBancaria: 'Cuenta bancaria',
    sinMinimoRetiro: 'Sin mínimo de retiro',
    retiraGananciasSegura: 'Retira tus ganancias de forma segura',
    microtrabajosEnLinea: 'Microtrabajos en línea',
    generaIngresosTareas: 'Genera ingresos con tareas digitales',
    soporte24_7: 'Soporte 24/7',
    equipoListoAyudarte: 'Nuestro equipo esta listo para ayudarte paso a paso',

    // Benefits Section
    ganaDinero: 'Gana dinero',
    generaIngresosMicrotrabajos: 'Genera ingresos todos los días completando microtrabajos',
    desdeCasa: 'Desde casa',
    usaCelularComputadora: 'Usa tu celular o computadora, sin descargas ni instalaciones',
    sinHorarios: 'Sin horarios',
    trabajaCualquierHora: 'Trabaja a cualquier hora y en cualquier lugar, sin horarios fijos',

    // Notifications
    bienvenidoFlasti: '¡Bienvenido a Flasti!',
    emocionadosTenerte: 'Estamos emocionados de tenerte con nosotros. Explora tu panel personal y comienza a generar ingresos.',
    todasNotificacionesLeidas: 'Todas las notificaciones marcadas como leídas',
    notificaciones: 'Notificaciones',
    marcarTodasLeidas: 'Marcar todas como leídas',
    noTienesNotificaciones: 'No tienes notificaciones',
    verTodasNotificaciones: 'Ver todas las notificaciones',

    // Dashboard Notifications
    gananciasTotal: 'Ganancias totales',
    ultimoRetiro: 'Último retiro',

    // Dashboard Preview Section
    ingresaMundo: 'Ingresa a un mundo de oportunidades',
    accedeArea: 'Accede al área exclusiva de miembros',
    metodosRetiroDisponibles: 'Métodos de retiro disponibles',
    cuentaBancaria: 'Cuenta bancaria',
    sinMinimoRetiro: 'Sin mínimo de retiro',
    retiraGananciasSegura: 'Retira tus ganancias de forma segura',
    generaIngresosTareas: 'Genera ingresos con tareas digitales',
    equipoListoAyudarte: 'Nuestro equipo está listo para ayudarte paso a paso',

    // Benefits Section
    accedeFlasti: 'Accede a',
    comienzaGanar: 'y comienza a ganar',
    milesPersonas: 'Miles de personas en todo el mundo ya están ganando dinero con nuestra plataforma',
    sinExperiencia: 'Sin experiencia',
    empiezaSin: 'Empieza sin ningún tipo de experiencia o estudios previos',

    // How It Works Section
    comoFunciona: '¿Cómo funciona?',
    soloNecesitas: 'Solo necesitas 3 pasos para empezar a generar ingresos con Flasti',
    paso: 'Paso',
    registrateAhora: 'Registrate ahora',
    registrateDesc: 'En tu panel de miembro, te enseñamos paso a paso cómo comenzar a completar microtrabajos de forma fácil y rápida',
    microtrabajosEnLinea: 'Microtrabajos en línea',
    microtrabajosDesc: 'Disfruta y recibe dinero por cada nuevo microtrabajo completado y genera ingresos todos los días',
    recogeTusRecompensas: 'Recoge tus recompensas',
    recogeTusRecompensasDesc: 'Retira tus ganancias de forma segura a través de PayPal o cuenta bancaria sin mínimo de retiro',

    // Dashboard Preview Section
    ingresaMundo: 'Ingresa a un mundo de oportunidades',
    accedeArea: 'Accede al área exclusiva de miembros',
    aprovechaFlastiAI: 'Aprovecha Flasti AI',
    trabajaRapido: 'Trabaja rápido y sin límites con inteligencia artificial',

    // Testimonials Section
    loQueSiempre: 'Lo que siempre soñaste, ahora es posible',
    testimonial1Name: 'Juan Rodríguez',
    testimonial1Content: 'Excelente servicio, ya logré mi primer retiro en casi 3 horas!! Me cuesta ocultar la emoción, estoy muy feliz! Fue fácil y rápido registrarse y las tareas son fáciles de completar, muchísimas gracias!',
    testimonial2Name: 'Ana González',
    testimonial2Content: 'Es 100% real. Llevo un par de semanas haciendo trabajos y ya cobré varias veces. La verdad estoy muy contenta porque siempre resuelven mis dudas rápido y con mucha amabilidad. Hasta convencí a mi esposo para que lo intente y los resultados han sido mejores de lo que esperábamos. Gracias',
    testimonial3Name: 'Luis López',
    testimonial3Content: 'No pensé que esto funcionara tan bien, recuperé mi inversión el mismo día y hasta gané un extra, puedo decir con total honestidad que nunca imaginé que haciendo esto podía ganar dinero por internet, es un alivio saber que aún es posible tener un trabajo digno a pesar de la situación económica difícil que estamos pasando en el país, la página es confiable y segura, la recomiendo totalmente',
    testimonial4Name: 'Santiago Hernández',
    testimonial4Content: 'Acabo de empezar y ya entré a mi cuenta, me encanta, pasé meses buscando algo así.',
    calificacionPromedio: '4.9 de calificación promedio',
    calificacion: '4.9 de calificación',

    // Pricing Section
    registrateAhoraBtn: 'Registrate ahora',
    unicoPago: 'Único pago, acceso de por vida',
    accedeComienza: 'Accede a la plataforma y comienza a generar ingresos con Flasti',
    pagoUnico: 'Pago único - Sin suscripciones ni cargos recurrentes',
    terminandoseRapido: '¡Terminándose rápido! Últimos cupos',
    ultimosCupos: '¡Últimos cupos!',
    empiezaGanarBtn: 'Empieza a ganar',
    pagoSeguro: 'Pago seguro con',
    monedaLocal: 'Moneda local',
    descuento: '80% OFF',
    ofertaTermina: '¡La oferta termina en:',

    // CTA Section
    conoceFlasti: 'Conoce a Flasti',
    confianza: 'Confianza',
    relacionesTransparentes: 'Relaciones transparentes',
    resultados: 'Resultados',
    beneficiosTangibles: 'Beneficios tangibles',
    innovacion: 'Innovación',
    mejoraConstante: 'Mejora constante de la plataforma',
    seguridad: 'Seguridad',
    proteccionDatos: 'Protección de datos e ingresos',
    crecimiento: 'Crecimiento',
    plataformaGlobal: 'Plataforma global en expansión',
    oportunidad: 'Oportunidad',
    futuroProspero: 'Futuro próspero y conectado',
    ctaDescription: 'Nacidos de la pasión por empoderar a las personas, diseñamos un ecosistema inteligente que simplifica procesos, potencia oportunidades y optimiza la generación de ingresos. Nuestra visión va más allá de la tecnología: construimos relaciones sostenibles basadas en la confianza, la seguridad y la innovación constante, generando resultados tangibles para nuestros usuarios. Flasti no es solo una empresa, es una plataforma global en crecimiento que impulsa a miles de personas hacia un futuro próspero, conectado y lleno de oportunidades.',

    // FAQ Section
    faqTitle: 'Preguntas frecuentes',
    faqSubtitle: 'Todo lo que necesitas saber',
    todoLoQueNecesitasSaber: 'Todo lo que necesitas saber',

    // FAQ Questions
    faq1Question: '¿Por qué debería unirme a Flasti?',
  faq1Answer: "Unirte a Flasti es la decisión que transformará tu forma de ganar dinero. Es ideal para quienes no tienen experiencia y desean comenzar a generar ingresos en línea. Nuestra plataforma fue diseñada para guiarte paso a paso. Y si ya tienes conocimientos, Flasti te llevará al siguiente nivel.\n\nDescubre cómo miles de personas en todo el mundo ya están utilizando nuestra plataforma para crear nuevas fuentes de ingresos desde la comodidad de su hogar.\n\nFlasti es más que una plataforma, es tu oportunidad de estar un paso adelante y formar parte de la nueva era digital. ¿Estás listo para dar el salto? 😎",

  faq2Question: '¿Qué son los microtrabajos en línea?',
  faq2Answer: "Las microtareas en línea son tareas rápidas y sencillas que puedes completar desde cualquier dispositivo con conexión a internet. En Flasti, hemos optimizado este proceso para que cualquier persona pueda empezar sin necesidad de conocimientos previos ni largas jornadas de trabajo.\n\n💰 Oportunidades disponibles en todo momento\n\nGana dinero a tu ritmo, sin horarios fijos ni compromisos. Puedes generar un ingreso estable para tu día a día o simplemente obtener un extra en tu tiempo libre.\n\n🚀 Sin experiencia ni largas jornadas\n\nFlasti está diseñado para que aproveches al máximo y conviertas tareas digitales en dinero real de forma sencilla y rápida.\n\n¡Comienza ahora y descubre lo fácil que es generar ingresos con Flasti!",

  faq3Question: '¿Cuánto dinero puedo ganar?',
  faq3Answer: "Puedes generar un ingreso estable para tu día a día o simplemente obtener un ingreso adicional en tu tiempo libre.\n\n• Elige cómo y cuánto ganar\n\nNuestra plataforma te recompensa por cada microtarea completada, con pagos de $1 hasta $20 USD, según la tarea que elijas. Algunas de las microtareas que encontrarás son: mirar un video, probar un juego, descargar una aplicación, completar un registro, calificar un producto o servicio, escribir una reseña corta, llenar un formulario, revisar un contenido (texto, imagen o audio) y muchas más que puedes empezar a realizar ahora mismo.\n\nTú decides hasta dónde llegar, elige tu camino y empieza a ganar",

    faq4Question: '¿Necesito experiencia previa para empezar?',
  faq4Answer: "¡No! La mayoría de los casos de éxito en Flasti son de personas que nunca antes habían trabajado en Internet ni tenían experiencia en generar ingresos en línea.\n\nNuestra plataforma está diseñada para guiarte paso a paso desde cero, sin necesidad de conocimientos previos.\n\nSi ellos lo lograron, tú también puedes comenzar a ganar dinero con Flasti hoy mismo.",

    faq5Question: '¿Cuál es la inversión para acceder a Flasti?',
    faq5Answer: "Esta plataforma fue creada con el objetivo de cambiar la vida de nuestros miembros, brindándoles una oportunidad real de independencia laboral. Nuestro propósito es llegar a la mayor cantidad de personas posible, transformando la manera en que se trabaja en línea. Y hoy, solo por tiempo limitado, tenemos una oferta especial para ti, para que puedas unirte a Flasti y comenzar a generar ingresos desde ya.  \n\n⚡ ¡SUPER OFERTA EXCLUSIVA POR TIEMPO LIMITADO!  \n\nSolo $10 USD (el equivalente en tu moneda local se mostrará al finalizar el pago)  \n\n💥 ¡Paga una sola vez y accede a Flasti de por vida usando PayPal o tu moneda local! 💥  \n\n🚨 EL PRECIO VOLVERÁ A SU VALOR ORIGINAL DE $50 USD EN CUALQUIER MOMENTO  \n\nSi lo piensas bien, esta pequeña inversión es mínima comparada con el potencial de ingresos que puedes obtener a partir de hoy mismo.  \n\n💡 Recuerda: Este precio tiene un 80% de descuento y es solo por tiempo limitado. ¡Estás ahorrando $40 USD por única vez, ahora mismo! Solo los más decididos y comprometidos tendrán la oportunidad de aprovechar esta oferta. ¡Este es tu momento! ✅ No dejes escapar esta oportunidad. ¡Aprovecha ahora antes de que sea tarde!  \n\n⚠️ IMPORTANTE: El precio volverá a su valor original en cualquier momento. Esta oferta exclusiva es única y las inscripciones están por agotarse.",

    faq6Question: '¿Y si no me gusta, tengo alguna garantía?',
    faq6Answer: "En Flasti, tu satisfacción es nuestra prioridad. Por eso, cuentas con una garantía incondicional de 7 días. Estamos tan seguros de que te encantará nuestra plataforma, que asumimos todo el riesgo. Si, por algún motivo, no cumple con tus expectativas o no estás completamente satisfecho, podrás solicitar un reembolso del 100% de tu dinero, sin tener que dar justificaciones ni llenar formularios interminables con preguntas incómodas.\n\nÚnete sin preocupaciones. ¡Tu inversión está completamente protegida!",

    // Dashboard
    balance: 'BALANCE',
    misEnlaces: 'Mis Enlaces',
    estadisticas: 'Estadísticas',
    apps: 'Apps',
    recursos: 'Recursos',
    retiros: 'Retiros',
    soporte: 'Soporte',
    reciente: 'RECIENTE',
    verActividad: 'Ver actividad',
    // Tabla de transacciones
    transaccion: 'TRANSACCIÓN',
    cantidad: 'CANTIDAD',
    balance_tabla: 'BALANCE',
    compañero: 'COMPAÑERO',
    fecha: 'FECHA',
    estado: 'ESTADO',
    completada: 'Completada',
    // Retiros
    volverDashboard: 'Volver al Inicio',
    canjearRecompensas: 'Canjear recompensas',
    eligeOpciones: 'Elige entre nuestras opciones de retiro para convertir tus puntos en recompensas reales.',
    redimible: 'Redimible:',
    misRecompensas: 'Mis recompensas',
    ofertasExclusivas: 'Ofertas exclusivas para ti',
    retiroRapidoPaypal: 'Retiro rápido con PayPal',
  },
  en: {
    // Navbar
    iniciarSesion: 'Log in',
    modoClaro: 'Light',
    modoOscuro: 'Dark',

    // Hero Section
    genera: 'Generate',
    con: 'with',
    aprovechaPoder: 'Harness the power of the internet and start earning income right now',
    empiezaGanar: 'Start earning',
    rotatingWords: [
      { text: "income", color: "from-[#d4386c] to-[#3359b6]" }, 
      { text: "extra money", color: "from-[#d4386c] to-[#3359b6]" }, 
      { text: "opportunities", color: "from-[#d4386c] to-[#3359b6]" } 
    ],
    generadosPorUsuarios: 'Generated by users',
    generadosPor: 'Generated by',
    usuarios: 'users',
    microtrabajosCompletados: 'Microtasks completed',
    microtrabajos: 'Microtasks',
    completados: 'completed',
    personasFormanParte: 'More than 100,000 are already part of our community',
    detectandoUbicacion: 'Detecting location...',
    accesoGlobal: 'Global Access',
    errorCargarEstadisticas: 'Error loading statistics:',
    usuario1: 'User 1',
    usuario2: 'User 2',
    usuario3: 'User 3',
    pagoSeguroLabel: 'Secure Payment',
    accesoExclusivoPlataforma: 'Exclusive access to the platform',
    soporte24_7: '24/7 Support',
    asistenciaPersonalizada: 'Step-by-step personalized assistance',
    suiteCompleta: 'Complete Suite',
    accesoFuncionesPremium: 'Access to all premium features',
    actualizacionesGratuitas: 'Free Updates',
    nuevasFuncionesSinCosto: 'New features at no additional cost',
    comoInicioSesion: 'How do I log in?',
    instruccionesInicioSesion: 'Once payment is completed, you will be automatically redirected to your dashboard. You will also receive a confirmation email with your login details. If for any reason you cannot access, simply go to the login page, enter the email you used to register and your password. If you forgot your password, you can easily reset it from the same page.',
    accesoInmediato: 'Immediate access',
    comienzaGenerarIngresos: 'Start generating income right now',
    accesoPorVida: 'Lifetime access',
    sinLimitesRenovaciones: 'No time limits or renewals',
    garantia7Dias: '7-day guarantee',
    devolucion100: '100% refund if you are not satisfied',
    loQueObtienes: 'What you get:',
    accesoCompletoPlataforma: 'Complete access to the AI-assisted microtasks platform',
    herramientasAutomatizacion: 'Automation tools to maximize your earnings',
    tutorialesGuias: 'Step-by-step tutorials and guides to start from scratch',
    accesoComunidad: 'Access to the exclusive Flasti user community',
    actualizacionesSinCosto: 'Updates and new features at no additional cost',
    terminandoseRapidoDisponibles: 'Last spots!',
    ultimosCupos: 'Last spots!',
    empiezaGanarMayus: 'START EARNING',
    pagoSeguroLabel2: 'Secure payment',
    monedaLocal2: 'Local currency',
    pagoSeguroTarjeta: 'Secure payment with credit card, debit card or bank transfer',
    instruccionesInicioSesionSimple: 'After completing the payment, you will be automatically taken to the registration page where you can create your account and immediately access your personal dashboard.',

    // Footer
    plataformaSegura: 'Secure Platform',
    encriptacionAES: 'AES-256 Encryption and TLS 1.3',
    cifradoSSL: 'SSL Encryption',
    pagosProtegidos: 'Protected Payments',
    transaccionesSeguras: '100% secure transactions',
    retirosVerificados: 'Verified Withdrawals',
    gananciaColectiva: 'Collective earnings',
    empresa: 'Company',
    sobreNosotros: 'About us',
    contacto: 'Contact',
    legal: 'Legal',
    informacionLegal: 'Legal information',
    terminosCondiciones: 'Terms and conditions',
    recursos: 'Resources',
    politicaPrivacidad: 'Privacy policy',
    derechosReservados: 'All rights reserved.',
    volverArriba: 'Back to top',

    // Testimonials Section
    experienciasUsuarios: 'Discover the experiences of those who are already<br />generating income with Flasti',
    experienciasUsuariosMobile: 'Discover the experiences<br />of those who are already<br />generating income with Flasti',

    // Dashboard Preview Section
    metodosRetiroDisponibles: 'Available withdrawal methods',
    cuentaBancaria: 'Bank account',
    sinMinimoRetiro: 'No minimum withdrawal',
    retiraGananciasSegura: 'Withdraw your earnings securely',
    microtrabajosEnLinea: 'Online microtasks',
    generaIngresosTareas: 'Generate income with digital tasks',
    soporte24_7: '24/7 Support',
    equipoListoAyudarte: 'Our team is ready to help you step by step',

    // Benefits Section
    ganaDinero: 'Earn money',
    generaIngresosMicrotrabajos: 'Generate income every day by completing microtasks',
    desdeCasa: 'From home',
    usaCelularComputadora: 'Use your phone or computer, no downloads or installations',
    sinHorarios: 'No schedules',
    trabajaCualquierHora: 'Work at any time and from anywhere, without fixed schedules',

    // Notifications
    bienvenidoFlasti: 'Welcome to Flasti!',
    emocionadosTenerte: 'We are excited to have you with us. Explore your personal dashboard and start generating income.',
    todasNotificacionesLeidas: 'All notifications marked as read',
    notificaciones: 'Notifications',
    marcarTodasLeidas: 'Mark all as read',
    noTienesNotificaciones: 'You have no notifications',
    verTodasNotificaciones: 'View all notifications',

    // Dashboard Notifications
    gananciasTotal: 'Total earnings',
    ultimoRetiro: 'Last withdrawal',

    // Dashboard Preview Section
    ingresaMundo: 'Enter a world of opportunities',
    accedeArea: 'Access the exclusive members area',
    metodosRetiroDisponibles: 'Available withdrawal methods',
    cuentaBancaria: 'Bank account',
    sinMinimoRetiro: 'No minimum withdrawal',
    retiraGananciasSegura: 'Withdraw your earnings securely',
    generaIngresosTareas: 'Generate income with digital tasks',
    equipoListoAyudarte: 'Our team is ready to help you step by step',

    // Benefits Section
    accedeFlasti: 'Access',
    comienzaGanar: 'and start earning',
    milesPersonas: 'Thousands of people worldwide are already making money with our platform',
    sinExperiencia: 'No experience needed',
    empiezaSin: 'Start without any prior experience or studies',

    // How It Works Section
    comoFunciona: 'How does it work?',
    soloNecesitas: 'You only need 3 steps to start generating income with Flasti',
    paso: 'Step',
    registrateAhora: 'Register now',
    registrateDesc: 'In your member dashboard, we show you step by step how to start completing microtasks easily and quickly',
    microtrabajosEnLinea: 'Online microtasks',
    microtrabajosDesc: 'Enjoy and receive money for each new microtask completed and generate income every day',
    recogeTusRecompensas: 'Collect your rewards',
    recogeTusRecompensasDesc: 'Withdraw your earnings securely through PayPal or bank account with no minimum withdrawal',

    // Dashboard Preview Section
    ingresaMundo: 'Enter a world of opportunities',
    accedeArea: 'Access the exclusive members area',
    aprovechaFlastiAI: 'Leverage Flasti AI',
    trabajaRapido: 'Work fast and without limits with step-by-step artificial intelligence',

    // Testimonials Section
    loQueSiempre: 'What you always dreamed of is now possible',
    testimonial1Name: 'Juan Rodríguez',
    testimonial1Content: 'Excellent service, I already got my first withdrawal in almost 3 hours!! It\'s hard to hide my excitement, I\'m very happy! It was easy and quick to register and the tasks are easy to complete, thank you very much!',
    testimonial2Name: 'Ana González',
    testimonial2Content: 'It\'s 100% real. I\'ve been doing tasks for a couple of weeks and I\'ve already been paid several times. I\'m really happy because they always solve my questions quickly and very kindly. I even convinced my husband to try it and the results have been better than we expected. Thanks',
    testimonial3Name: 'Luis López',
    testimonial3Content: 'I didn\'t think this would work so well, I recovered my investment the same day and even earned extra, I can say with complete honesty that I never imagined that by doing this I could earn money online, it\'s a relief to know that it\'s still possible to have a decent job despite the difficult economic situation we\'re going through in the country, the site is reliable and secure, I totally recommend it',
    testimonial4Name: 'Santiago Hernández',
    testimonial4Content: 'I just started and already logged into my account, I love it, I spent months looking for something like this.',
    calificacionPromedio: '4.9 average rating',
    calificacion: '4.9 rating',

    // Pricing Section
    registrateAhoraBtn: 'Register now',
    unicoPago: 'Single payment, lifetime access',
    accedeComienza: 'Access the platform and start generating income with Flasti',
    pagoUnico: 'One-time payment - No subscriptions or recurring charges',
    terminandoseRapido: 'Last spots!',
    empiezaGanarBtn: 'Start earning',
    pagoSeguro: 'Secure payment with',
    monedaLocal: 'Local currency',
    descuento: '80% OFF',
    ofertaTermina: 'The offer ends in:',

    // CTA Section
    conoceFlasti: 'Get to know Flasti',
    confianza: 'Trust',
    relacionesTransparentes: 'Transparent relationships',
    resultados: 'Results',
    beneficiosTangibles: 'Tangible benefits',
    innovacion: 'Innovation',
    mejoraConstante: 'Constant platform improvement',
    seguridad: 'Security',
    proteccionDatos: 'Data and earnings protection',
    crecimiento: 'Growth',
    plataformaGlobal: 'Expanding global platform',
    oportunidad: 'Opportunity',
    futuroProspero: 'Prosperous and connected future',
    ctaDescription: 'Born from the passion to empower people, we designed an intelligent ecosystem that simplifies processes, enhances opportunities, and optimizes income generation. Our vision goes beyond technology: we build sustainable relationships based on trust, security, and constant innovation, generating tangible results for our users. Flasti is not just a company, it\'s a growing global platform that propels thousands of people towards a prosperous, connected future full of opportunities.',

    // FAQ Section
    faqTitle: 'Frequently Asked Questions',
    faqSubtitle: 'Everything you need to know',
    todoLoQueNecesitasSaber: 'Everything you need to know',

    // FAQ Questions
    faq1Question: 'Why should I join Flasti?',
    faq1Answer: "Joining Flasti is the decision that will transform how you earn money. It's ideal for those with no experience who want to start generating income online. Our platform was designed to guide you step by step with proven strategies. And if you already have knowledge, Flasti will take you to the next level with advanced tools.\n\nDiscover how thousands of people around the world are already using our platform to create new sources of income from the comfort of their home.\n\nFlasti is more than a platform, it's your opportunity to be one step ahead and be part of the new digital era. Are you ready to take the leap? 😎",

    faq2Question: 'What are online microtasks?',
    faq2Answer: "Online microtasks are quick and simple tasks that you can complete from any device with an internet connection. At Flasti, we've optimized this process so that anyone can start without prior knowledge or long working hours, taking advantage of this new way of earning money.\n\n💰 Opportunities available at all times\n\nEarn money at your own pace, without fixed schedules or commitments. You can generate a stable income for your day-to-day or simply get an extra in your free time.\n\n🚀 No experience or long hours required\n\nFlasti is designed for you to make the most of it and turn digital tasks into real money easily and quickly.\n\nStart now and discover how easy it is to generate income with Flasti!",

    faq3Question: 'How much money can I make?',
    faq3Answer: "This is where you come in! 💎\n\nYou have total control: you can generate a stable income for your day-to-day or simply earn an extra in your free time.\n\n💥 Choose how and how much to earn\n\nComplete microtasks short, medium, or long term according to your available time and how much money you want to generate. You decide how far to go.\n\nChoose your path and start earning! 🚀",

    faq4Question: 'Do I need previous experience to start?',
    faq4Answer: "No! Most success stories on Flasti are from people who had never worked on the Internet before or had experience generating income online.\n\nOur platform is designed to guide you step by step from scratch, with proven strategies that anyone can follow.\n\nIf they could do it, you can also start making money with Flasti today.",

    faq5Question: 'What is the investment to access Flasti?',
    faq5Answer: "This platform was created with the aim of changing the lives of our members, providing them with a real opportunity for job independence. Our purpose is to reach as many people as possible, transforming the way people work online. And today, only for a limited time, we have a special offer for you, so you can join Flasti and start generating income right away.  \n\n⚡ EXCLUSIVE SUPER OFFER FOR A LIMITED TIME!  \n\nOnly $10 USD (the equivalent in your local currency will be shown at checkout)  \n\n💥 Pay once and access Flasti for life using PayPal or your local currency! 💥  \n\n🚨 THE PRICE WILL RETURN TO ITS ORIGINAL VALUE OF $50 USD AT ANY MOMENT  \n\nIf you think about it, this small investment is minimal compared to the potential income you can obtain from today.  \n\n💡 Remember: This price has an 80% discount and is only for a limited time. You are saving $40 USD for a one-time payment, right now! Only the most determined and committed will have the opportunity to take advantage of this offer. This is your moment! ✅ Don't miss this opportunity. Take advantage now before it's too late!  \n\n⚠️ IMPORTANT: The price will return to its original value at any moment. This exclusive offer is unique and registrations are about to run out.",

    faq6Question: 'And if I don\'t like it, do I have any guarantee?',
    faq6Answer: "At Flasti, your satisfaction is our priority. That's why you have an unconditional 7-day guarantee. We are so sure that you will love our platform that we take all the risk. If, for any reason, it does not meet your expectations or you are not completely satisfied, you can request a 100% refund of your money, without having to give justifications or fill out endless forms with uncomfortable questions.\n\nJoin worry-free. Your investment is completely protected.",

    // Dashboard
    balance: 'BALANCE',
    misEnlaces: 'Mis Enlaces',
    estadisticas: 'Estadísticas',
    apps: 'Apps',
    recursos: 'Recursos',
    retiros: 'Retiros',
    soporte: 'Soporte',
    reciente: 'RECIENTE',
    verActividad: 'Ver actividad',
    // Tabla de transacciones
    transaccion: 'TRANSACCIÓN',
    cantidad: 'CANTIDAD',
    balance_tabla: 'BALANCE',
    compañero: 'COMPAÑERO',
    fecha: 'FECHA',
    estado: 'ESTADO',
    completada: 'Completada',
    // Retiros
    volverDashboard: 'Volver al Inicio',
    canjearRecompensas: 'Canjear recompensas',
    eligeOpciones: 'Elige entre nuestras opciones de retiro para convertir tus puntos en recompensas reales.',
    redimible: 'Redimible:',
    misRecompensas: 'Mis recompensas',
    ofertasExclusivas: 'Ofertas exclusivas para ti',
    retiroRapidoPaypal: 'Retiro rápido con PayPal',
  },
  pt: {
    // Navbar
    iniciarSesion: 'Entrar',
    modoClaro: 'Claro',
    modoOscuro: 'Escuro',

    // Hero Section
    genera: 'Gere',
    con: 'com',
    aprovechaPoder: 'Aproveite o poder da internet e comece a ganhar dinheiro agora mesmo',
    empiezaGanar: 'Comece a ganhar',
    rotatingWords: [
      { text: "renda", color: "from-[#d4386c] to-[#3359b6]" }, 
      { text: "dinheiro extra", color: "from-[#d4386c] to-[#3359b6]" }, 
      { text: "oportunidades", color: "from-[#d4386c] to-[#3359b6]" } 
    ],
    generadosPorUsuarios: 'Gerado por usuários',
    generadosPor: 'Gerado por',
    usuarios: 'usuários',
    microtrabajosCompletados: 'Microtrabalhos completados',
    microtrabajos: 'Microtrabalhos',
    completados: 'completados',
    personasFormanParte: 'Mais de 100.000 já fazem parte da nossa comunidade',
    detectandoUbicacion: 'Detectando localização...',
    accesoGlobal: 'Acesso Global',
    errorCargarEstadisticas: 'Erro ao carregar estatísticas:',
    usuario1: 'Usuário 1',
    usuario2: 'Usuário 2',
    usuario3: 'Usuário 3',
    pagoSeguroLabel: 'Pagamento Seguro',
    accesoExclusivoPlataforma: 'Acesso exclusivo à plataforma',
    soporte24_7: 'Suporte 24/7',
    asistenciaPersonalizada: 'Assistência personalizada passo a passo',
    suiteCompleta: 'Suite completa',
    accesoFuncionesPremium: 'Acesso a todas as funções premium',
    actualizacionesGratuitas: 'Atualizações gratuitas',
    nuevasFuncionesSinCosto: 'Novas funções sem custo adicional',
    comoInicioSesion: 'Como faço para entrar?',
    instruccionesInicioSesion: 'Assim que o pagamento for concluído, você será redirecionado automaticamente para o seu painel de controle. Você também receberá um e-mail de confirmação com seus dados de acesso. Se por algum motivo você não conseguir acessar, basta ir para a página de login, inserir o e-mail que você usou para se registrar e sua senha. Se você esqueceu sua senha, pode redefini-la facilmente na mesma página.',
    accesoInmediato: 'Acesso imediato',
    comienzaGenerarIngresos: 'Comece a gerar renda agora mesmo',
    accesoPorVida: 'Acesso vitalício',
    sinLimitesRenovaciones: 'Sem limites de tempo ou renovações',
    garantia7Dias: 'Garantia de 7 dias',
    devolucion100: 'Reembolso de 100% se você não estiver satisfeito',
    loQueObtienes: 'O que você recebe:',
    accesoCompletoPlataforma: 'Acesso completo à plataforma de microtrabalhos assistidos por IA',
    herramientasAutomatizacion: 'Ferramentas de automação para maximizar seus ganhos',
    tutorialesGuias: 'Tutoriais e guias passo a passo para começar do zero',
    accesoComunidad: 'Acesso à comunidade exclusiva de usuários do Flasti',
    actualizacionesSinCosto: 'Atualizações e novas funcionalidades sem custo adicional',
    terminandoseRapidoDisponibles: 'Acabando rápido! Últimas vagas disponíveis',
    empiezaGanarMayus: 'COMECE A GANHAR',
    pagoSeguroLabel2: 'Pagamento seguro',
    monedaLocal2: 'Moeda local',
    pagoSeguroTarjeta: 'Pagamento seguro com cartão de crédito, débito ou transferência bancária',
    instruccionesInicioSesionSimple: 'Após concluir o pagamento, você será levado automaticamente para a página de registro onde poderá criar sua conta e acessar imediatamente seu painel pessoal.',

    // Footer
    plataformaSegura: 'Plataforma Segura',
    encriptacionAES: 'Criptografia AES-256 e TLS 1.3',
    cifradoSSL: 'Criptografia SSL',
    pagosProtegidos: 'Pagamentos Protegidos',
    transaccionesSeguras: 'Transações 100% seguras',
    retirosVerificados: 'Saques Verificados',
    gananciaColectiva: 'Ganhos coletivos',
    empresa: 'Empresa',
    sobreNosotros: 'Sobre nós',
    contacto: 'Contato',
    legal: 'Legal',
    informacionLegal: 'Informações legais',
    terminosCondiciones: 'Termos e condições',
    recursos: 'Recursos',
    politicaPrivacidad: 'Política de privacidade',
    derechosReservados: 'Todos os direitos reservados.',
    volverArriba: 'Voltar ao topo',

    // Testimonials Section
    experienciasUsuarios: 'Descubra as experiências daqueles que já estão<br />gerando renda com Flasti',
    experienciasUsuariosMobile: 'Descubra as experiências<br />daqueles que já estão<br />gerando renda com Flasti',

    // Dashboard Preview Section
    metodosRetiroDisponibles: 'Métodos de retirada disponíveis',
    cuentaBancaria: 'Conta bancária',
    sinMinimoRetiro: 'Sem mínimo de retirada',
    retiraGananciasSegura: 'Retire seus ganhos com segurança',
    microtrabajosEnLinea: 'Microtrabalhos online',
    generaIngresosTareas: 'Gere renda com tarefas digitais',
    soporte24_7: 'Suporte 24/7',
    equipoListoAyudarte: 'Nossa equipe está pronta para ajudá-lo passo a passo',

    // Benefits Section
    ganaDinero: 'Ganhe dinheiro',
    generaIngresosMicrotrabajos: 'Gere renda todos os dias completando microtrabalhos',
    desdeCasa: 'De casa',
    usaCelularComputadora: 'Use seu celular ou computador, sem downloads ou instalações',
    sinHorarios: 'Sem horários',
    trabajaCualquierHora: 'Trabalhe a qualquer hora e em qualquer lugar, sem horários fixos',

    // Notifications
    bienvenidoFlasti: 'Bem-vindo ao Flasti!',
    emocionadosTenerte: 'Estamos emocionados em tê-lo conosco. Explore seu painel pessoal e comece a gerar renda.',
    todasNotificacionesLeidas: 'Todas as notificações marcadas como lidas',
    notificaciones: 'Notificações',
    marcarTodasLeidas: 'Marcar todas como lidas',
    noTienesNotificaciones: 'Você não tem notificações',
    verTodasNotificaciones: 'Ver todas as notificações',

    // Dashboard Notifications
    gananciasTotal: 'Ganhos totais',
    ultimoRetiro: 'Último saque',

    // Dashboard Preview Section
    ingresaMundo: 'Entre em um mundo de oportunidades',
    accedeArea: 'Acesse a área exclusiva para membros',
    metodosRetiroDisponibles: 'Métodos de retirada disponíveis',
    cuentaBancaria: 'Conta bancária',
    sinMinimoRetiro: 'Sem mínimo de retirada',
    retiraGananciasSegura: 'Retire seus ganhos com segurança',
    generaIngresosTareas: 'Gere renda com tarefas digitais',
    equipoListoAyudarte: 'Nossa equipe está pronta para ajudá-lo passo a passo',

    // Benefits Section
    accedeFlasti: 'Acesse',
    comienzaGanar: 'e comece a ganhar',
    milesPersonas: 'Milhares de pessoas em todo o mundo já estão ganhando dinheiro com nossa plataforma',
    sinExperiencia: 'Sem experiência',
    empiezaSin: 'Comece sem nenhum tipo de experiência ou estudos anteriores',

    // How It Works Section
    comoFunciona: 'Como funciona?',
    soloNecesitas: 'Você só precisa de 3 passos para começar a gerar renda com Flasti',
    paso: 'Passo',
    registrateAhora: 'Registre-se agora',
    registrateDesc: 'No seu painel de membro, mostramos passo a passo como começar a completar microtrabalhos de forma fácil e rápida',
    microtrabajosEnLinea: 'Microtrabalhos online',
    microtrabajosDesc: 'Aproveite e receba dinheiro por cada novo microtrabalho completado e gere renda todos os dias',
    recogeTusRecompensas: 'Colete suas recompensas',
    recogeTusRecompensasDesc: 'Retire seus ganhos com segurança através do PayPal ou conta bancária sem mínimo de retirada',

    // Dashboard Preview Section
    ingresaMundo: 'Entre em um mundo de oportunidades',
    accedeArea: 'Acesse a área exclusiva para membros',
    aprovechaFlastiAI: 'Aproveite a IA do Flasti',
    trabajaRapido: 'Trabalhe rápido e sem limites com inteligência artificial passo a passo',

    // Testimonials Section
    loQueSiempre: 'O que você sempre sonhou, agora é possível',
    testimonial1Name: 'Juan Rodríguez',
    testimonial1Content: 'Excelente serviço, já consegui meu primeiro saque em quase 3 horas!! É difícil esconder minha emoção, estou muito feliz! Foi fácil e rápido me registrar e as tarefas são fáceis de completar, muito obrigado!',
    testimonial2Name: 'Ana González',
    testimonial2Content: 'É 100% real. Estou há algumas semanas fazendo trabalhos e já recebi várias vezes. Estou muito feliz porque sempre resolvem minhas dúvidas rapidamente e com muita gentileza. Até convenci meu marido a tentar e os resultados foram melhores do que esperávamos. Obrigado',
    testimonial3Name: 'Luis López',
    testimonial3Content: 'Não pensei que isso funcionasse tão bem, recuperei meu investimento no mesmo dia e ainda ganhei um extra, posso dizer com total honestidade que nunca imaginei que fazendo isso poderia ganhar dinheiro pela internet, é um alívio saber que ainda é possível ter um trabalho digno apesar da situação econômica difícil que estamos enfrentando no país, o site é confiável e seguro, recomendo totalmente',
    testimonial4Name: 'Santiago Hernández',
    testimonial4Content: 'Acabei de começar e já entrei na minha conta, adoro, passei meses procurando algo assim.',
    calificacionPromedio: '4.9 de avaliação média',
    calificacion: '4.9 de avaliação',

    // Pricing Section
    registrateAhoraBtn: 'Registre-se agora',
    unicoPago: 'Pagamento único, acesso vitalício',
    accedeComienza: 'Acesse a plataforma e comece a gerar renda com Flasti',
    pagoUnico: 'Pagamento único - Sem assinaturas ou cobranças recorrentes',
    terminandoseRapido: 'Acabando rápido! Últimas vagas',
    empiezaGanarBtn: 'Comece a ganhar',
    pagoSeguro: 'Pagamento seguro com',
    monedaLocal: 'Moeda local',
    descuento: '80% DESCONTO',
    ofertaTermina: 'A oferta termina em:',

    // CTA Section
    conoceFlasti: 'Conheça o Flasti',
    confianza: 'Confiança',
    relacionesTransparentes: 'Relações transparentes',
    resultados: 'Resultados',
    beneficiosTangibles: 'Benefícios tangíveis',
    innovacion: 'Inovação',
    mejoraConstante: 'Melhoria constante da plataforma',
    seguridad: 'Segurança',
    proteccionDatos: 'Proteção de dados e rendimentos',
    crecimiento: 'Crescimento',
    plataformaGlobal: 'Plataforma global em expansão',
    oportunidad: 'Oportunidade',
    futuroProspero: 'Futuro próspero e conectado',
    ctaDescription: 'Nascidos da paixão por empoderar pessoas, projetamos um ecossistema inteligente que simplifica processos, potencia oportunidades e otimiza a geração de renda. Nossa visão vai além da tecnologia: construímos relações sustentáveis baseadas na confiança, segurança e inovação constante, gerando resultados tangíveis para nossos usuários. Flasti não é apenas uma empresa, é uma plataforma global em crescimento que impulsiona milhares de pessoas em direção a um futuro próspero, conectado e cheio de oportunidades.',

    // FAQ Section
    faqTitle: 'Perguntas frequentes',
    faqSubtitle: 'Tudo o que você precisa saber',
    todoLoQueNecesitasSaber: 'Tudo o que você precisa saber',

    // FAQ Questions
    faq1Question: 'Por que devo me juntar ao Flasti?',
    faq1Answer: "Juntar-se ao Flasti é a decisão que transformará a sua forma de ganhar dinheiro. É ideal para quem não tem experiência e deseja começar a gerar renda online. Nossa plataforma foi projetada para guiá-lo passo a passo com estratégias comprovadas. E se você já tem conhecimento, o Flasti o levará ao próximo nível com ferramentas avançadas.\n\nDescubra como milhares de pessoas em todo o mundo já estão usando nossa plataforma para criar novas fontes de renda no conforto de suas casas.\n\nFlasti é mais do que uma plataforma, é a sua oportunidade de estar um passo à frente e fazer parte da nova era digital. Você está pronto para dar o salto? 😎",

    faq2Question: 'O que são microtrabalhos online?',
    faq2Answer: "Microtrabalhos online são tarefas rápidas e simples que você pode completar de qualquer dispositivo com conexão à internet. No Flasti, otimizamos esse processo para que qualquer pessoa possa começar sem necessidade de conhecimentos prévios ou longas jornadas de trabalho, aproveitando essa nova forma de ganhar dinheiro.\n\n💰 Oportunidades disponíveis o tempo todo\n\nGanhe dinheiro no seu ritmo, sem horários fixos ou compromissos. Você pode gerar uma renda estável para o seu dia a dia ou simplesmente obter um extra no seu tempo livre.\n\n🚀 Sem experiência ou longas jornadas necessárias\n\nO Flasti foi projetado para que você aproveite ao máximo e transforme tarefas digitais em dinheiro real de forma simples e rápida.\n\nComece agora e descubra como é fácil gerar renda com o Flasti!",

    faq3Question: 'Quanto dinheiro posso ganhar?',
    faq3Answer: "Aqui é onde você entra! 💎\n\nVocê tem total controle: pode gerar uma renda estável para o seu dia a dia ou simplesmente ganhar um extra no seu tempo livre.\n\n💥 Escolha como e quanto ganhar\n\nComplete microtrabalhos de curto, médio ou longo prazo conforme seu tempo disponível e quanto dinheiro deseja gerar. Você decide até onde quer chegar.\n\nEscolha seu caminho e comece a ganhar! 🚀",

    faq4Question: 'Preciso de experiência prévia para começar?',
    faq4Answer: "Não! A maioria dos casos de sucesso no Flasti são de pessoas que nunca haviam trabalhado na Internet ou tinham experiência em gerar renda online.\n\nNossa plataforma é projetada para guiá-lo passo a passo desde o início, com estratégias comprovadas que qualquer um pode seguir.\n\nSe eles conseguiram, você também pode começar a ganhar dinheiro com o Flasti hoje mesmo.",

    faq5Question: 'Qual é o investimento para acessar o Flasti?',
    faq5Answer: "Esta plataforma foi criada com o objetivo de mudar a vida de nossos membros, oferecendo uma oportunidade real de independência financeira. Nosso propósito é alcançar o maior número possível de pessoas, transformando a maneira como se trabalha online. E hoje, apenas por tempo limitado, temos uma oferta especial para você, para que possa se juntar ao Flasti e começar a gerar renda agora mesmo.  \n\n⚡ SUPER OFERTA EXCLUSIVA POR TEMPO LIMITADO!  \n\nApenas $10 USD (o equivalente na sua moeda local será exibido ao finalizar o pagamento)  \n\n💥 Pague uma única vez e tenha acesso vitalício ao Flasti usando PayPal ou sua moeda local! 💥  \n\n🚨 O PREÇO VOLTARÁ AO SEU VALOR ORIGINAL DE $50 USD A QUALQUER MOMENTO  \n\nSe você pensar bem, esse pequeno investimento é mínimo comparado ao potencial de renda que você pode obter a partir de hoje.  \n\n💡 Lembre-se: Este preço tem 80% de desconto e é apenas por tempo limitado. Você está economizando $40 USD por uma única vez, agora mesmo! Apenas os mais decididos e comprometidos terão a oportunidade de aproveitar essa oferta. Este é o seu momento! ✅ Não deixe escapar essa oportunidade. Aproveite agora antes que seja tarde!  \n\n⚠️ IMPORTANTE: O preço voltará ao seu valor original a qualquer momento. Esta oferta exclusiva é única e as inscrições estão prestes a se esgotar.",

    faq6Question: 'E se eu não gostar, tenho alguma garantia?',
    faq6Answer: "No Flasti, sua satisfação é nossa prioridade. Por isso, você tem uma garantia incondicional de 7 dias. Estamos tão confiantes de que você vai adorar nossa plataforma que assumimos todo o risco. Se, por algum motivo, não atender às suas expectativas ou você não estiver completamente satisfeito, poderá solicitar um reembolso de 100% do seu dinheiro, sem precisar justificar ou preencher formulários intermináveis com perguntas desconfortáveis.\n\nJunte-se sem preocupações. Seu investimento está completamente protegido.",

    // Dashboard
    balance: 'BALANCE',
    misEnlaces: 'Mis Enlaces',
    estadisticas: 'Estadísticas',
    apps: 'Apps',
    recursos: 'Recursos',
    retiros: 'Retiros',
    soporte: 'Soporte',
    reciente: 'RECIENTE',
    verActividad: 'Ver actividad',
    // Tabla de transacciones
    transaccion: 'TRANSACCIÓN',
    cantidad: 'CANTIDAD',
    balance_tabla: 'BALANCE',
    compañero: 'COMPAÑERO',
    fecha: 'FECHA',
    estado: 'ESTADO',
    completada: 'Completada',
    // Retiros
    volverDashboard: 'Volver al Inicio',
    canjearRecompensas: 'Canjear recompensas',
    eligeOpciones: 'Elige entre nuestras opciones de retiro para convertir tus puntos en recompensas reales.',
    redimible: 'Redimible:',
    misRecompensas: 'Mis recompensas',
    ofertasExclusivas: 'Ofertas exclusivas para ti',
    retiroRapidoPaypal: 'Retiro rápido con PayPal',
  },
