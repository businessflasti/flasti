'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
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
  Search,
  Filter,
  ArrowLeft,
  RefreshCw
} from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { chatServiceSupabase, ChatMessage, ChatConversation } from '@/lib/chat-service-supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function SupportPageContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed' | 'archived'>('all');
  const [tablesError, setTablesError] = useState<boolean>(false);

  // Verificar si el usuario es administrador
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;

      // Verificar si el usuario es administrador (usando localStorage como solución temporal)
      const isAdminUser = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(isAdminUser);

      if (!isAdminUser) {
        toast.error('No tienes permisos para acceder a esta página');
        router.push('/dashboard');
      } else {
        // Cargar conversaciones
        loadAllConversations();
      }
    };

    checkAdminStatus();
  }, [user, router]);

  // Cargar todas las conversaciones
  const loadAllConversations = async () => {
    setLoadingConversations(true);
    try {
      // Ignorar la verificación de tablas
      setTablesError(false);

      // Usar un enfoque alternativo para evitar la recursión infinita
      // Usar la API REST directamente en lugar de las políticas de seguridad
      const response = await fetch('/api/admin/conversations');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar conversaciones');
      }

      const { data: conversationsData } = await response.json();

      // El error ya se maneja en el bloque try-catch

      // Si no hay conversaciones, mostrar mensaje y salir
      if (!conversationsData || conversationsData.length === 0) {
        setConversations([]);
        setLoadingConversations(false);
        return;
      }

      // Para cada conversación, obtener el número de mensajes no leídos
      const conversationsWithUnread = await Promise.all(
        conversationsData.map(async (conversation) => {
          // Contar mensajes no leídos (enviados por usuarios y no leídos por admin)
          const { count, error: countError } = await supabase
            .from('chat_messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conversation.id)
            .neq('sender_id', user?.id)
            .eq('read', false);

          // Obtener el último mensaje
          const { data: lastMessages, error: lastMessageError } = await supabase
            .from('chat_messages')
            .select('content')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(1);

          // Cargar información del usuario
          await loadUserProfile(conversation.user_id);

          return {
            ...conversation,
            unread_count: countError ? 0 : (count || 0),
            last_message: lastMessageError || !lastMessages?.length ? '' : lastMessages[0].content
          };
        })
      );

      setConversations(conversationsWithUnread);

      // Si hay conversaciones, seleccionar la más reciente con mensajes no leídos
      const unreadConversation = conversationsWithUnread.find(c => c.unread_count > 0);
      if (unreadConversation) {
        setActiveConversation(unreadConversation.id);
        loadConversationMessages(unreadConversation.id);
      } else if (conversationsWithUnread.length > 0) {
        setActiveConversation(conversationsWithUnread[0].id);
        loadConversationMessages(conversationsWithUnread[0].id);
      }
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
      toast.error('Error al cargar conversaciones');
    } finally {
      setLoadingConversations(false);
    }
  };

  // Cargar perfil de usuario
  const loadUserProfile = async (userId: string) => {
    if (userProfiles[userId]) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserProfiles(prev => ({
        ...prev,
        [userId]: data
      }));
    } catch (error) {
      console.error(`Error al cargar perfil del usuario ${userId}:`, error);
    }
  };

  // Cargar mensajes de una conversación
  const loadConversationMessages = async (conversationId: string) => {
    setLoadingMessages(true);
    try {
      // Usar el endpoint de API para evitar la recursión infinita
      const response = await fetch(`/api/admin/messages/${conversationId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar mensajes');
      }

      const { data: messagesData } = await response.json();

      setMessages(messagesData);

      // Marcar mensajes como leídos (solo los enviados por el usuario)
      await markMessagesAsRead(conversationId);

      // Actualizar lista de conversaciones para reflejar mensajes leídos
      loadAllConversations();
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      toast.error('Error al cargar mensajes');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Marcar mensajes como leídos
  const markMessagesAsRead = async (conversationId: string) => {
    try {
      // Usar el endpoint de API para evitar la recursión infinita
      const response = await fetch(`/api/admin/mark-read/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al marcar mensajes como leídos:', errorData.error);
      }
    } catch (error) {
      console.error('Error al marcar mensajes como leídos:', error);
    }
  };

  // Enviar un mensaje
  const sendMessage = async () => {
    if (!message.trim() || !activeConversation) return;

    setLoading(true);
    try {
      // Usar el endpoint de API para evitar la recursión infinita
      const response = await fetch('/api/admin/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversationId: activeConversation,
          senderId: user?.id || '',
          content: message
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar mensaje');
      }

      const { success, messageId } = await response.json();

      if (success) {
        // Añadir mensaje a la lista local temporalmente
        const newMessage: ChatMessage = {
          id: messageId || `temp_${Date.now()}`,
          conversation_id: activeConversation,
          sender_id: user?.id || '',
          sender_name: 'Soporte',
          content: message,
          created_at: new Date().toISOString(),
          read: true
        };

        setMessages(prev => [...prev, newMessage]);

        // Limpiar campo de mensaje
        setMessage('');

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
      } else {
        throw new Error('Error al enviar mensaje');
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

  // Formatear fecha relativa
  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return formatDistanceToNow(date, {
        addSuffix: true,
        locale: es
      });
    } catch (error) {
      console.error('Error al formatear fecha relativa:', error);
      return 'hace un momento';
    }
  };

  // Formatear fecha completa
  const formatFullDate = (date: Date) => {
    try {
      return format(date, 'dd MMM yyyy, HH:mm', {
        locale: es
      });
    } catch (error) {
      console.error('Error al formatear fecha completa:', error);
      return new Date().toLocaleString();
    }
  };

  // Seleccionar conversación
  const selectConversation = (conversationId: string) => {
    setActiveConversation(conversationId);
    loadConversationMessages(conversationId);
  };

  // Cambiar estado de la conversación
  const changeConversationStatus = async (conversationId: string, status: 'open' | 'closed' | 'archived') => {
    try {
      // Usar el endpoint de API para evitar la recursión infinita
      const response = await fetch(`/api/admin/change-status/${conversationId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cambiar estado de la conversación');
      }

      toast.success(`Conversación ${status === 'open' ? 'abierta' : status === 'closed' ? 'cerrada' : 'archivada'}`);

      // Actualizar lista de conversaciones
      loadAllConversations();
    } catch (error) {
      console.error('Error al cambiar estado de la conversación:', error);
      toast.error('Error al cambiar estado de la conversación');
    }
  };

  // Filtrar conversaciones
  const filteredConversations = conversations.filter(conversation => {
    // Filtrar por estado
    if (statusFilter !== 'all' && conversation.status !== statusFilter) {
      return false;
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const userProfile = userProfiles[conversation.user_id];
      const userEmail = userProfile?.email || '';
      const userName = userProfile?.name || '';

      return (
        conversation.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.last_message?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return true;
  });

  // Obtener estado de la conversación
  const getConversationStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <Badge variant="outline" className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800">
            <CheckCircle size={10} className="mr-1" />
            Abierto
          </Badge>
        );
      case 'closed':
        return (
          <Badge variant="outline" className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800">
            <XCircle size={10} className="mr-1" />
            Cerrado
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            <Clock size={10} className="mr-1" />
            Archivado
          </Badge>
        );
      default:
        return null;
    }
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6 max-w-7xl mt-20">
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-xl font-semibold mb-2">Acceso Restringido</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            No tienes permisos para acceder a esta página.
          </p>
          <Button asChild>
            <Link href="/dashboard">Volver al Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Manejar el reintento cuando hay error de tablas
  const handleRetryTablesCheck = async () => {
    try {
      await loadAllConversations();
    } catch (error) {
      console.error('Error al reintentar cargar conversaciones:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl mt-20">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/admin">
            <ArrowLeft size={16} />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Soporte</h1>
          <p className="text-foreground/70 mt-1">
            Gestiona las conversaciones de soporte
          </p>
        </div>
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
                  size="icon"
                  onClick={() => loadAllConversations()}
                  title="Actualizar"
                >
                  <RefreshCw size={14} />
                </Button>
              </div>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="icon">
                    <Search size={14} />
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={statusFilter === 'all' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter('all')}
                    className="flex-1 text-xs"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={statusFilter === 'open' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter('open')}
                    className="flex-1 text-xs"
                  >
                    Abiertos
                  </Button>
                  <Button
                    variant={statusFilter === 'closed' ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter('closed')}
                    className="flex-1 text-xs"
                  >
                    Cerrados
                  </Button>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              {loadingConversations ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin text-primary mr-2">⟳</div>
                  <p>Cargando conversaciones...</p>
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <MessageSquare size={40} className="text-foreground/30 mb-4" />
                  <p className="text-foreground/60 text-center text-sm">
                    No hay conversaciones
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border/30">
                  {filteredConversations.map((conversation) => {
                    const userProfile = userProfiles[conversation.user_id];
                    return (
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
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>
                              {userProfile?.email?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm truncate">
                                {userProfile?.email || 'Usuario'}
                              </p>
                              <span className="text-xs text-foreground/50">
                                {formatRelativeTime(conversation.last_message_at)}
                              </span>
                            </div>
                            <p className="text-sm font-medium truncate">
                              {conversation.subject || 'Sin asunto'}
                            </p>
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
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        {/* Área de chat */}
        <div className="lg:col-span-3">
          <Card className="h-[calc(80vh-8rem)] flex flex-col">
            {!activeConversation ? (
              <div className="flex-1 flex flex-col items-center justify-center p-4">
                <MessageSquare size={48} className="text-foreground/30 mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona una conversación</h3>
                <p className="text-foreground/60 text-center max-w-md mb-4">
                  Selecciona una conversación para ver los mensajes y responder
                </p>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {userProfiles[conversations.find(c => c.id === activeConversation)?.user_id || '']?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="font-medium">
                          {userProfiles[conversations.find(c => c.id === activeConversation)?.user_id || '']?.email || 'Usuario'}
                        </h2>
                        <p className="text-xs text-foreground/60">
                          {conversations.find(c => c.id === activeConversation)?.subject || 'Sin asunto'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getConversationStatusBadge(
                        conversations.find(c => c.id === activeConversation)?.status || 'open'
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeConversationStatus(activeConversation, 'open')}
                        disabled={conversations.find(c => c.id === activeConversation)?.status === 'open'}
                      >
                        <CheckCircle size={14} className="mr-1" />
                        Abrir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeConversationStatus(activeConversation, 'closed')}
                        disabled={conversations.find(c => c.id === activeConversation)?.status === 'closed'}
                      >
                        <XCircle size={14} className="mr-1" />
                        Cerrar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => changeConversationStatus(activeConversation, 'archived')}
                        disabled={conversations.find(c => c.id === activeConversation)?.status === 'archived'}
                      >
                        <Clock size={14} className="mr-1" />
                        Archivar
                      </Button>
                    </div>
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
                                  {msg.sender_id === user?.id ? 'SP' : 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium">
                                {msg.sender_id === user?.id ? 'Soporte' : (userProfiles[msg.sender_id]?.email || 'Usuario')}
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
                    !activeConversation
                      ? "Selecciona una conversación para enviar un mensaje"
                      : conversations.find(c => c.id === activeConversation)?.status !== 'open'
                      ? "Esta conversación está cerrada"
                      : "Escribe un mensaje..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[60px] resize-none"
                  disabled={!activeConversation || conversations.find(c => c.id === activeConversation)?.status !== 'open'}
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
                  disabled={!message.trim() || !activeConversation || loading || conversations.find(c => c.id === activeConversation)?.status !== 'open'}
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

export default function Page() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin text-primary mb-2">⟳</div><p className="ml-2">Cargando...</p></div>}>
      <SupportPageContent />
    </Suspense>
  );
}
