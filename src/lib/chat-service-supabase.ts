import { supabase } from './supabase';

// Función simple para generar IDs únicos
function generateUUID() {
  return Date.now().toString() + '-' + Math.random().toString(36).substring(2, 15);
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name?: string;
  content: string;
  created_at: string;
  read: boolean;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  admin_id?: string;
  subject: string;
  status: 'open' | 'closed' | 'archived';
  last_message_at: string;
  created_at: string;
  unread_count?: number;
  last_message?: string;
}

class ChatServiceSupabase {
  private static instance: ChatServiceSupabase;

  private constructor() {}

  public static getInstance(): ChatServiceSupabase {
    if (!ChatServiceSupabase.instance) {
      ChatServiceSupabase.instance = new ChatServiceSupabase();
    }
    return ChatServiceSupabase.instance;
  }

  /**
   * Carga las conversaciones del usuario
   */
  public async loadUserConversations(userId: string): Promise<{ conversations: ChatConversation[] }> {
    try {
      console.log('Cargando conversaciones para usuario:', userId);

      // Ignorar la verificación de tablas

      // Obtener todas las conversaciones del usuario
      const { data: conversations, error } = await supabase
        .from('chat_conversations')
        .select('*')
        .eq('user_id', userId)
        .order('last_message_at', { ascending: false });

      if (error) {
        console.error('Error al cargar conversaciones:', error);
        return { conversations: [] };
      }

      // Si no hay conversaciones, devolver array vacío
      if (!conversations || conversations.length === 0) {
        return { conversations: [] };
      }

      // Para cada conversación, obtener el número de mensajes no leídos
      const conversationsWithUnread = await Promise.all(
        conversations.map(async (conversation) => {
          try {
            // Contar mensajes no leídos (enviados por admin y no leídos por el usuario)
            const { count, error: countError } = await supabase
              .from('chat_messages')
              .select('*', { count: 'exact', head: true })
              .eq('conversation_id', conversation.id)
              .neq('sender_id', userId)
              .eq('read', false);

            // Obtener el último mensaje
            const { data: lastMessages, error: lastMessageError } = await supabase
              .from('chat_messages')
              .select('content')
              .eq('conversation_id', conversation.id)
              .order('created_at', { ascending: false })
              .limit(1);

            return {
              ...conversation,
              unread_count: countError ? 0 : (count || 0),
              last_message: lastMessageError || !lastMessages?.length ? '' : lastMessages[0].content
            };
          } catch (convError) {
            console.error(`Error al procesar conversación ${conversation.id}:`, convError);
            return {
              ...conversation,
              unread_count: 0,
              last_message: ''
            };
          }
        })
      );

      return { conversations: conversationsWithUnread };
    } catch (error) {
      console.error('Error inesperado al cargar conversaciones:', error);
      return { conversations: [] };
    }
  }

  /**
   * Carga los mensajes de una conversación
   */
  public async getConversationMessages(conversationId: string): Promise<{ messages: ChatMessage[] }> {
    try {
      console.log('Cargando mensajes para conversación:', conversationId);

      // Ignorar la verificación de tablas

      const { data: messages, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error al cargar mensajes:', error);
        return { messages: [] };
      }

      return { messages: messages || [] };
    } catch (error) {
      console.error('Error inesperado al cargar mensajes:', error);
      return { messages: [] };
    }
  }

  /**
   * Crea una nueva conversación
   */
  public async createConversation(
    userId: string,
    subject: string
  ): Promise<{ success: boolean; conversationId: string | null }> {
    try {
      console.log('Creando nueva conversación para usuario:', userId);

      // Ignorar la verificación de tablas

      const conversationId = generateUUID();

      const { error } = await supabase
        .from('chat_conversations')
        .insert({
          id: conversationId,
          user_id: userId,
          subject: subject,
          status: 'open',
          last_message_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error al crear conversación:', error);
        return { success: false, conversationId: null };
      }

      return { success: true, conversationId };
    } catch (error) {
      console.error('Error inesperado al crear conversación:', error);
      return { success: false, conversationId: null };
    }
  }

  /**
   * Envía un mensaje en una conversación
   */
  public async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<{ success: boolean; messageId: string | null }> {
    try {
      console.log('Enviando mensaje en conversación:', conversationId);

      // Ignorar la verificación de tablas

      // Obtener información del remitente
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', senderId)
        .single();

      if (userError) {
        console.error('Error al obtener datos del usuario:', userError);
      }

      const messageId = generateUUID();

      // Insertar el mensaje
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          id: messageId,
          conversation_id: conversationId,
          sender_id: senderId,
          sender_name: userData?.email || 'Usuario',
          content: content,
          created_at: new Date().toISOString(),
          read: false
        });

      if (error) {
        console.error('Error al enviar mensaje:', error);
        return { success: false, messageId: null };
      }

      // Actualizar la fecha del último mensaje en la conversación
      const { error: updateError } = await supabase
        .from('chat_conversations')
        .update({
          last_message_at: new Date().toISOString()
        })
        .eq('id', conversationId);

      if (updateError) {
        console.error('Error al actualizar conversación:', updateError);
      }

      return { success: true, messageId };
    } catch (error) {
      console.error('Error inesperado al enviar mensaje:', error);
      return { success: false, messageId: null };
    }
  }

  /**
   * Marca los mensajes de una conversación como leídos
   */
  public async markMessagesAsRead(
    conversationId: string,
    userId: string
  ): Promise<{ success: boolean }> {
    try {
      console.log('Marcando mensajes como leídos en conversación:', conversationId);

      // Marcar como leídos solo los mensajes que NO fueron enviados por el usuario actual
      const { error } = await supabase
        .from('chat_messages')
        .update({ read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', userId)
        .eq('read', false);

      if (error) {
        console.error('Error al marcar mensajes como leídos:', error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Error inesperado al marcar mensajes como leídos:', error);
      return { success: false };
    }
  }

  /**
   * Cierra una conversación
   */
  public async closeConversation(conversationId: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ status: 'closed' })
        .eq('id', conversationId);

      if (error) {
        console.error('Error al cerrar conversación:', error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Error inesperado al cerrar conversación:', error);
      return { success: false };
    }
  }

  /**
   * Archiva una conversación
   */
  public async archiveConversation(conversationId: string): Promise<{ success: boolean }> {
    try {
      const { error } = await supabase
        .from('chat_conversations')
        .update({ status: 'archived' })
        .eq('id', conversationId);

      if (error) {
        console.error('Error al archivar conversación:', error);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Error inesperado al archivar conversación:', error);
      return { success: false };
    }
  }
}

export const chatServiceSupabase = ChatServiceSupabase.getInstance();
