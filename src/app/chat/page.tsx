"use client";

import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, User, MessageSquare } from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { id: 1, text: "¡Hola! Bienvenido al chat de soporte de Flasti. ¿En qué podemos ayudarte hoy?", isUser: false, timestamp: new Date() },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const messagesEndRef = useRef(null);

  // Función para desplazarse al final de los mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Agregar mensaje del usuario
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simular respuesta automática después de un breve retraso
    setTimeout(() => {
      const botResponses = [
        "Gracias por tu mensaje. Un agente de soporte se pondrá en contacto contigo pronto.",
        "Entiendo tu consulta. Estamos procesando tu solicitud y te responderemos a la brevedad.",
        "Hemos recibido tu mensaje. Nuestro equipo está trabajando para ayudarte lo antes posible.",
        "Gracias por contactarnos. Tu consulta es importante para nosotros y será atendida en breve.",
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      const botMessage = {
        id: messages.length + 2,
        text: randomResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleRegister = () => {
    if (userName.trim() === "" || userEmail.trim() === "") {
      alert("Por favor, completa todos los campos");
      return;
    }

    setIsRegistered(true);

    // Mensaje de bienvenida personalizado
    const welcomeMessage = {
      id: messages.length + 1,
      text: `Hola ${userName}, gracias por contactarnos. ¿En qué podemos ayudarte hoy?`,
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, welcomeMessage]);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <MainLayout showHeader={true} disableChat={true}>
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gradient font-outfit">
              Chat de Soporte
            </h1>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Comunícate en tiempo real con nuestro equipo de soporte para resolver tus dudas.
            </p>
          </div>

          {!isRegistered ? (
            <div className="bg-card/30 backdrop-blur-sm p-8 rounded-2xl border border-white/5 max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-6 text-center font-outfit">
                Ingresa tus datos para comenzar
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nombre
                  </label>
                  <Input
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full"
                  />
                </div>
                <Button
                  onClick={handleRegister}
                  className="w-full mt-2"
                >
                  Iniciar chat
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl border border-white/5 overflow-hidden flex flex-col h-[600px]">
              {/* Cabecera del chat */}
              <div className="bg-card/70 p-4 border-b border-white/10 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                  <MessageSquare className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Soporte Flasti</h3>
                  <p className="text-xs text-foreground/60">En línea</p>
                </div>
              </div>

              {/* Área de mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.isUser
                          ? "bg-primary/20 text-foreground"
                          : "bg-card/50 border border-white/10"
                      }`}
                    >
                      <div className="flex items-center mb-1">
                        <div className="w-6 h-6 rounded-full bg-card/70 flex items-center justify-center mr-2">
                          {message.isUser ? (
                            <User className="w-3 h-3 text-primary" />
                          ) : (
                            <MessageSquare className="w-3 h-3 text-primary" />
                          )}
                        </div>
                        <span className="text-xs font-medium">
                          {message.isUser ? userName : "Soporte Flasti"}
                        </span>
                        <span className="text-xs text-foreground/50 ml-auto">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Área de entrada de texto */}
              <div className="p-4 border-t border-white/10 bg-card/50">
                <div className="flex">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 mr-2"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={inputValue.trim() === ""}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
