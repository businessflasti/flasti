"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import {
  Mail,
  MessageCircle,
  Phone
} from "lucide-react";
import TawkToWidget from "@/components/chat/TawkToWidget";
import ChatButton from "@/components/chat/ChatButton";

export default function SupportPage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [formState, setFormState] = useState({
    name: profile?.name || user?.email?.split('@')[0] || "",
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Actualizar el formulario cuando se carguen los datos del usuario
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      name: profile?.name || user?.email?.split('@')[0] || prev.name,
      email: user?.email || prev.email,
    }));
  }, [user, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Configuración para enviar el correo con información del usuario logueado
      const emailData = {
        to: "flasti.business@gmail.com",
        subject: `Soporte - Usuario: ${formState.name} - ${formState.subject}`,
        text: `
          SOLICITUD DE SOPORTE
          
          Usuario ID: ${user?.id || 'No disponible'}
          Nombre: ${formState.name}
          Email: ${formState.email}
          Asunto: ${formState.subject}
          
          Mensaje:
          ${formState.message}
        `,
        html: `
          <h3>Nueva solicitud de soporte</h3>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 10px 0;">
            <p><strong>Usuario ID:</strong> ${user?.id || 'No disponible'}</p>
            <p><strong>Nombre:</strong> ${formState.name}</p>
            <p><strong>Email:</strong> ${formState.email}</p>
            <p><strong>Asunto:</strong> ${formState.subject}</p>
          </div>
          <h4>Mensaje:</h4>
          <p style="background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff;">
            ${formState.message.replace(/\n/g, '<br>')}
          </p>
        `
      };

      // Enviar el correo usando la API
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
      setFormState(prev => ({
        ...prev,
        subject: "",
        message: "",
      }));

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
    <div className="min-h-screen bg-[#101010] pt-16 md:pt-8 pb-16 md:pb-8 px-4 relative">
      {/* Widget de chat para soporte */}
      <TawkToWidget showBubble={true} />
      
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
            Centro de Soporte
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Hola {profile?.name || user?.email?.split('@')[0] || 'Usuario'}, estamos aquí para ayudarte. Si tienes alguna pregunta, problema técnico o necesitas asistencia, no dudes en contactarnos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center bg-[#232323]">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Email de Soporte</h3>
            <p className="text-gray-400 mb-4">Nuestro equipo te responderá en menos de 24 horas</p>
            <a
              href="mailto:access@flasti.com"
              className="text-white hover:text-gray-200 transition-colors"
            >
              access@flasti.com
            </a>
          </div>

          <div className="p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center bg-[#232323]">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Chat en vivo</h3>
            <p className="text-gray-400 mb-4">Habla con nuestro equipo en tiempo real</p>
            <ChatButton
              variant="default"
              size="sm"
              className="flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg shadow-md transition-all"
              text="Iniciar chat"
              showIcon={true}
            />
          </div>

          <div className="p-6 rounded-xl transition-all duration-300 flex flex-col items-center text-center bg-[#232323]">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Soporte Telefónico</h3>
            <p className="text-gray-400 mb-4">Disponible de lunes a viernes, 9am - 6pm</p>
            <span className="text-white">
              +1 (234) 567-890
            </span>
          </div>
        </div>

        <div className="p-8 md:p-10 rounded-2xl relative overflow-hidden bg-[#232323]">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
            Enviar solicitud de soporte
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-white">
                  Nombre
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  placeholder="Tu nombre"
                  required
                  className="w-full rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 border-0 bg-[#101010] text-white"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-white">
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
                  disabled
                  className="w-full rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 border-0 bg-[#101010] text-white opacity-75"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-white">
                Asunto
              </label>
              <Input
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                placeholder="Describe brevemente tu problema o consulta"
                required
                className="w-full rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 border-0 bg-[#101010] text-white"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-white">
                Descripción detallada
              </label>
              <Textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                placeholder="Describe tu problema o consulta con el mayor detalle posible..."
                required
                className="w-full min-h-[150px] rounded-xl focus-visible:ring-0 focus-visible:ring-offset-0 border-0 bg-[#101010] text-white"
              />
            </div>

            <div className="flex flex-col items-center">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto min-w-[200px] bg-white text-black hover:bg-gray-200"
              >
                {isSubmitting ? "Enviando..." : "Enviar solicitud"}
              </Button>

              {submitSuccess && (
                <p className="mt-4 text-green-400 text-center">
                  ¡Solicitud enviada con éxito! Te responderemos a la brevedad.
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
  );
}