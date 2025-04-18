import MainLayout from "@/components/layout/MainLayout";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, ChevronRight, HelpCircle, CreditCard, Users, Settings, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Flasti | Centro de Ayuda",
  description: "Encuentra respuestas a tus preguntas y obtén soporte para la plataforma Flasti.",
};

export default function AyudaPage() {
  return (
    <MainLayout showHeader={true} disableChat={true}>
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gradient font-outfit">
              Centro de Ayuda
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Encuentra respuestas a tus preguntas y obtén soporte para la plataforma Flasti.
            </p>
          </div>

          {/* Buscador */}
          <div className="bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-accent/5 rounded-full blur-3xl -z-10"></div>

            <h2 className="text-2xl font-bold mb-4 text-center font-outfit">¿Cómo podemos ayudarte?</h2>
            <div className="flex max-w-xl mx-auto">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Buscar en el centro de ayuda..."
                  className="w-full px-4 py-3 pr-10 rounded-l-lg bg-background/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 w-5 h-5" />
              </div>
              <Button className="rounded-l-none">
                Buscar
              </Button>
            </div>
          </div>

          {/* Categorías */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center font-outfit">Categorías Populares</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card/20 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 hover-lift">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-outfit">Pagos y Retiros</h3>
                <p className="text-foreground/70 mb-4">
                  Información sobre métodos de pago, retiros, comisiones y transacciones.
                </p>
                <Link href="#" className="flex items-center text-primary hover:text-accent transition-colors text-sm">
                  Ver artículos <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="bg-card/20 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 hover-lift">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-outfit">Programa de Afiliados</h3>
                <p className="text-foreground/70 mb-4">
                  Cómo funciona el programa de afiliados, comisiones y estrategias de promoción.
                </p>
                <Link href="#" className="flex items-center text-primary hover:text-accent transition-colors text-sm">
                  Ver artículos <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="bg-card/20 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 hover-lift">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Settings className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2 font-outfit">Configuración de Cuenta</h3>
                <p className="text-foreground/70 mb-4">
                  Gestión de perfil, seguridad, notificaciones y preferencias de cuenta.
                </p>
                <Link href="#" className="flex items-center text-primary hover:text-accent transition-colors text-sm">
                  Ver artículos <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* Preguntas frecuentes */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center font-outfit">Preguntas Frecuentes</h2>

            <div className="space-y-4">
              <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 font-outfit">¿Cómo funciona el sistema de niveles?</h3>
                <p className="text-foreground/70">
                  El sistema de niveles de Flasti se basa en tu actividad y rendimiento en la plataforma. A medida que generas más ingresos, avanzas automáticamente a niveles superiores que ofrecen mayores comisiones y beneficios. Hay tres niveles: Nivel 1 (50% de comisión), Nivel 2 (60% de comisión) y Nivel 3 (70% de comisión).
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 font-outfit">¿Cuándo recibo mis pagos?</h3>
                <p className="text-foreground/70">
                  Los pagos se procesan dentro de las 48 horas posteriores a tu solicitud de retiro. El tiempo exacto de acreditación depende del método de pago seleccionado. Para PayPal, generalmente toma 1-2 días hábiles, mientras que las transferencias bancarias pueden demorar entre 3-5 días hábiles.
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 font-outfit">¿Cómo genero mi enlace de afiliado?</h3>
                <p className="text-foreground/70">
                  Para generar tu enlace de afiliado, inicia sesión en tu cuenta de Flasti y ve a la sección "Programa de Afiliados" en tu panel de control. Allí encontrarás la opción para generar enlaces personalizados para cada aplicación disponible. Puedes compartir estos enlaces en redes sociales, correos electrónicos o cualquier otro canal para comenzar a ganar comisiones.
                </p>
              </div>

              <div className="bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2 font-outfit">¿Qué hago si olvidé mi contraseña?</h3>
                <p className="text-foreground/70">
                  Si olvidaste tu contraseña, ve a la página de inicio de sesión y haz clic en "¿Olvidaste tu contraseña?". Ingresa tu dirección de correo electrónico registrada y te enviaremos un enlace para restablecer tu contraseña. El enlace es válido por 24 horas. Si no recibes el correo, revisa tu carpeta de spam.
                </p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6 font-outfit">¿No encuentras lo que buscas?</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Nuestro equipo de soporte está listo para ayudarte con cualquier pregunta o problema que puedas tener.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contacto">
                <Button size="lg" className="min-w-[200px]">
                  Contactar soporte
                </Button>
              </Link>
              <Link href="/dashboard/soporte">
                <Button variant="outline" size="lg" className="min-w-[200px] border-primary/20 hover:border-primary/50">
                  Chat en vivo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
