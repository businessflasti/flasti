"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {
  Mail,
  MessageCircle,
  Phone
} from "lucide-react";
import TawkToWidget from "@/components/chat/TawkToWidget";
import ChatButton from "@/components/chat/ChatButton";

export default function ContactoPage() {
  const router = useRouter();

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Configuración para enviar el correo
      const emailData = {
        to: "flasti.business@gmail.com",
        subject: `Formulario de contacto: ${formState.subject}`,
        text: `
          Nombre: ${formState.name}
          Email: ${formState.email}
          Asunto: ${formState.subject}
          Mensaje: ${formState.message}
        `,
        html: `
          <h3>Nuevo mensaje de contacto</h3>
          <p><strong>Nombre:</strong> ${formState.name}</p>
          <p><strong>Email:</strong> ${formState.email}</p>
          <p><strong>Asunto:</strong> ${formState.subject}</p>
          <p><strong>Mensaje:</strong> ${formState.message}</p>
        `
      };

      // Enviar el correo usando la API de Email.js o un servicio similar
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar el correo');
      }

      // Éxito
      setSubmitSuccess(true);
      setFormState({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Resetear el estado de éxito después de 5 segundos
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      setSubmitError("Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.");
      console.error("Error al enviar el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout showHeader={true} disableChat={true}>
      {/* Widget de chat para la página de contacto (visible) */}
      <TawkToWidget showBubble={true} />
      <div className="container-custom py-16 md:py-24" style={{ background: '#101010', minHeight: '100vh' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
              Contáctanos
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Estamos aquí para ayudarte. Si tienes alguna pregunta, sugerencia o necesitas asistencia, no dudes en contactarnos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email</h3>
              <p className="text-foreground/70 mb-4">Nuestro equipo te responderá en menos de 24 horas</p>
              <a
                href="mailto:access@flasti.com"
                className="text-primary hover:text-accent transition-colors"
              >
                access@flasti.com
              </a>
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat en vivo</h3>
              <p className="text-foreground/70 mb-4">Habla con nuestro equipo en tiempo real</p>
              <ChatButton
                variant="default"
                size="sm"
                className="flex items-center justify-center gap-2 bg-[#3c66ce] hover:bg-[#3359b6] text-white px-4 py-2 rounded-lg shadow-md transition-all"
                text="Iniciar chat"
                showIcon={true}
              />
            </div>

            <div className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-white/5 hover:border-primary/20 transition-all duration-300 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Teléfono</h3>
              <p className="text-foreground/70 mb-4">Disponible de lunes a viernes, 9am - 6pm</p>
              <a
                href="tel:+123456789"
                className="text-primary hover:text-accent transition-colors"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>

          <div className="bg-card/30 backdrop-blur-sm p-8 md:p-10 rounded-2xl border border-white/5 relative overflow-hidden">
            {/* Elementos decorativos */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Envíanos un mensaje
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium">
                  Asunto
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="¿Sobre qué quieres hablar?"
                  required
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium">
                  Mensaje
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Escribe tu mensaje aquí..."
                  required
                  className="w-full min-h-[150px]"
                />
              </div>

              <div className="flex flex-col items-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto min-w-[200px]"
                >
                  {isSubmitting ? "Enviando..." : "Enviar mensaje"}
                </Button>

                {submitSuccess && (
                  <p className="mt-4 text-green-400 text-center">
                    ¡Mensaje enviado con éxito! Te responderemos a la brevedad.
                  </p>
                )}

                {submitError && (
                  <p className="mt-4 text-red-400 text-center">
                    {submitError}
                  </p>
                )}
              </div>
            </form>
          </div>


        </div>
      </div>
    </MainLayout>
  );
}
