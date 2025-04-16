'use client';

import { useState, useEffect, useRef } from 'react';
import { ChatTablesError } from '@/components/ui/chat-tables-error';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Send,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  PaperclipIcon,
  SmileIcon
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { chatServiceSupabase, ChatMessage, ChatConversation } from '@/lib/chat-service-supabase';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import BackButton from '@/components/ui/back-button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';

export default function Page() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newConversation, setNewConversation] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [tablesError, setTablesError] = useState<boolean>(false);

  // Cargar conversaciones del usuario
  useEffect(() => {
    if (user) {
      loadUserConversations();
      loadUserProfile();
    }
  }, [user]);

  // Manejar errores de carga
  useEffect(() => {
    const handleError = (error: any) => {
      console.error('Error en la aplicación:', error);
      toast.error('Ha ocurrido un error. Por favor, intenta de nuevo.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // Cargar perfil del usuario
  const loadUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      setUserProfile(data);
    } catch (error) {
      console.error('Error al cargar perfil de usuario:', error);
    }
  };

  // Cargar conversaciones del usuario
  const loadUserConversations = async () => {
    try {
      const { conversations } = await chatServiceSupabase.loadUserConversations(user?.id || '');
      setConversations(conversations);
      setTablesError(false);

      // Si hay conversaciones, seleccionar la más reciente
      if (conversations.length > 0 && !activeConversation) {
        setActiveConversation(conversations[0].id);
        loadConversationMessages(conversations[0].id);
      }
    } catch (error: any) {
      console.error('Error al cargar conversaciones:', error);

      // Verificar si el error es por tablas inexistentes
      if (error?.message?.includes('does not exist') ||
          error?.details?.includes('does not exist') ||
          error?.code === '42P01') {
        setTablesError(true);
      } else {
        toast.error('Error al cargar conversaciones');
      }
    }
  };

  // Cargar mensajes de una conversación
  const loadConversationMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      const { messages } = await chatServiceSupabase.getConversationMessages(conversationId);
      setMessages(messages); // Los mensajes ya vienen ordenados por fecha

      // Marcar mensajes como leídos
      await chatServiceSupabase.markMessagesAsRead(conversationId, user?.id || '');

      // Actualizar lista de conversaciones para reflejar mensajes leídos
      loadUserConversations();
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Enviar un mensaje
  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    try {
      if (!activeConversation) {
        // Crear nueva conversación
        const { success, conversationId } = await chatServiceSupabase.createConversation(
          user?.id || '',
          subject
        );

        if (success && conversationId) {
          setActiveConversation(conversationId);

          // Enviar mensaje en la nueva conversación
          await chatServiceSupabase.sendMessage(
            conversationId,
            user?.id || '',
            message
          );

          // Recargar conversaciones y mensajes
          await loadUserConversations();
          await loadConversationMessages(conversationId);

          // Limpiar formulario
          setMessage('');
          setSubject('');
          setNewConversation(false);
        } else {
          throw new Error('Error al crear conversación');
        }
      } else {
        // Enviar mensaje en conversación existente
        const { success, messageId } = await chatServiceSupabase.sendMessage(
          activeConversation,
          user?.id || '',
          message
        );

        if (success) {
          // Añadir mensaje a la lista local temporalmente
          const newMessage: ChatMessage = {
            id: messageId || `temp_${Date.now()}`,
            conversation_id: activeConversation,
            sender_id: user?.id || '',
            sender_name: userProfile?.email || 'Usuario',
            content: message,
            created_at: new Date().toISOString(),
            read: false
          };

          setMessages(prev => [...prev, newMessage]);

          // Recargar mensajes para asegurar consistencia
          try {
            setTimeout(async () => {
              await loadConversationMessages(activeConversation);
              setLoading(false);
            }, 1000);
          } catch (error) {
            console.error('Error al recargar mensajes:', error);
            setLoading(false);
          }
        }

        // Limpiar campo de mensaje
        setMessage('');
      }
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      toast.error('Error al enviar mensaje');
      setLoading(false);
    }
  };

  // Desplazarse al último mensaje
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Formatear fecha relativa según el idioma
  const formatRelativeTime = (dateStr: string) => {
    try {
      // Usar useEffect para evitar errores de hidratación
      const [formattedDate, setFormattedDate] = useState('');

      useEffect(() => {
        try {
          const date = new Date(dateStr);
          const formatted = formatDistanceToNow(date, {
            addSuffix: true,
            locale: language === 'es' ? es : undefined
          });
          setFormattedDate(formatted);
        } catch (error) {
          console.error('Error al formatear fecha relativa:', error);
        }
      }, [dateStr, language]);

      return formattedDate;
    } catch (error) {
      console.error('Error al formatear fecha relativa:', error);
      return 'hace un momento';
    }
  };

  // Formatear fecha completa
  const formatFullDate = (date: Date) => {
    try {
      return format(date, 'dd MMM yyyy, HH:mm', {
        locale: language === 'es' ? es : undefined
      });
    } catch (error) {
      console.error('Error al formatear fecha completa:', error);
      return new Date().toLocaleString();
    }
  };

  // Crear nueva conversación
  const startNewConversation = () => {
    setNewConversation(true);
    setActiveConversation(null);
    setMessages([]);
  };

  // Seleccionar conversación
  const selectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    setNewConversation(false);
    loadConversationMessages(conversationId);
  };

  // Obtener estado de la conversación
  const getConversationStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
            <CheckCircle size={10} className="mr-1" />
            Abierto
          </span>
        );
      case 'closed':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
            <XCircle size={10} className="mr-1" />
            Cerrado
          </span>
        );
      case 'archived':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300">
            <Clock size={10} className="mr-1" />
            Archivado
          </span>
        );
      default:
        return null;
    }
  };

  // Manejar el reintento cuando hay error de tablas
  const handleRetryTablesCheck = async () => {
    try {
      await loadUserConversations();
    } catch (error) {
      console.error('Error al reintentar cargar conversaciones:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <BackButton />

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Soporte</h1>
        <p className="text-foreground/70 mt-1">
          Contacta con nuestro equipo de soporte
        </p>
      </div>

      {tablesError ? (
        <ChatTablesError onRetry={handleRetryTablesCheck} />
      ) : (

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Lista de conversaciones */}
        <div className="lg:col-span-1">
          <Card className="h-[calc(80vh-8rem)] flex flex-col">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium">Conversaciones</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={startNewConversation}
                >
                  Nueva
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <MessageSquare size={40} className="text-foreground/30 mb-4" />
                  <p className="text-foreground/60 text-center text-sm">
                    No tienes conversaciones activas
                  </p>
                  <Button
                    variant="link"
                    onClick={startNewConversation}
                    className="mt-2"
                  >
                    Iniciar una conversación
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        activeConversation === conversation.id
                          ? 'bg-foreground/10'
                          : 'hover:bg-foreground/5'
                      }`}
                      onClick={() => selectConversation(conversation.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <MessageSquare size={14} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {conversation.subject || 'Sin asunto'}
                            </p>
                            <span className="text-xs text-foreground/50">
                              {formatRelativeTime(new Date(conversation.last_message_at))}
                            </span>
                          </div>
                          <p className="text-xs text-foreground/60 truncate">
                            {conversation.last_message || 'No hay mensajes'}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            {getConversationStatusBadge(conversation.status)}
                            {conversation.unread_count > 0 && (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                                {conversation.unread_count}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Área de chat */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(80vh-8rem)] flex flex-col">
            {newConversation ? (
              <>
                <div className="p-4 border-b border-border/50">
                  <h2 className="font-medium mb-4">Nuevo Mensaje</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">
                        Asunto
                      </label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Escribe el asunto de tu consulta"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 bg-foreground/5">
                  <div className="flex flex-col items-center justify-center h-full">
                    <MessageSquare size={48} className="text-foreground/30 mb-4" />
                    <p className="text-foreground/60 text-center max-w-md mb-2">
                      Escribe tu mensaje para iniciar una nueva conversación con nuestro equipo de soporte
                    </p>
                    <p className="text-foreground/50 text-center text-xs">
                      Tiempo de respuesta estimado: 24 horas
                    </p>
                  </div>
                </div>
              </>
            ) : !activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <MessageSquare size={48} className="text-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
                <p className="text-foreground/60 text-center max-w-md mb-4">
                  Selecciona una conversación existente o inicia una nueva para contactar con nuestro equipo de soporte
                </p>
                <Button onClick={startNewConversation}>
                  Iniciar nueva conversación
                </Button>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <h2 className="font-medium">
                      {conversations.find(c => c.id === activeConversation)?.subject || 'Conversación'}
                    </h2>
                    {getConversationStatusBadge(
                      conversations.find(c => c.id === activeConversation)?.status || 'open'
                    )}
                  </div>
                </div>

                <ScrollArea className="flex-1 p-4">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin text-primary mr-2">⟳</div>
                      <p>Cargando mensajes...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                      <MessageSquare size={40} className="text-foreground/30 mb-4" />
                      <p className="text-foreground/60 text-center">
                        No hay mensajes en esta conversación
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.sender_id === user?.id
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-foreground/10'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback>
                                  {msg.sender_id === user?.id ? 'YO' : 'SP'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {msg.sender_id === user?.id ? 'Tú' : 'Soporte'}
                              </span>
                            </div>
                            <p className="text-sm whitespace-pre-wrap break-words">
                              {msg.content}
                            </p>
                            <p
                              className={`text-xs mt-1 text-right ${
                                msg.sender_id === user?.id
                                  ? 'text-primary-foreground/70'
                                  : 'text-foreground/50'
                              }`}
                            >
                              {formatRelativeTime(msg.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>
              </>
            )}

            <div className="p-4 border-t border-border/50">
              <div className="flex gap-2">
                <Textarea
                  placeholder={
                    newConversation
                      ? "Escribe tu mensaje..."
                      : !activeConversation
                      ? "Selecciona una conversación para enviar un mensaje"
                      : conversations.find(c => c.id === activeConversation)?.status !== 'open'
                      ? "Esta conversación está cerrada"
                      : "Escribe un mensaje..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] resize-none"
                  disabled={!newConversation && (!activeConversation || conversations.find(c => c.id === activeConversation)?.status !== 'open')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  className="self-end"
                  size="icon"
                  disabled={!message.trim() || loading || (!newConversation && (!activeConversation || conversations.find(c => c.id === activeConversation)?.status !== 'open'))}
                  onClick={sendMessage}
                >
                  {loading ? (
                    <span className="animate-spin">⟳</span>
                  ) : (
                    <Send size={16} />
                  )}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
