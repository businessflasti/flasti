import { EventEmitter } from 'events';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  name: string; // Nombre del mensaje o asunto
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'sent' | 'delivered';
}

class ChatService {
  private static instance: ChatService;
  private eventEmitter: EventEmitter;
  private messages: Map<string, ChatMessage[]>;
  private readonly STORAGE_KEY = 'chat_messages';
  private ws: WebSocket | null = null;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.messages = this.loadMessagesFromStorage();
    this.initializeWebSocket();
  }

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  private initializeWebSocket() {
    // TODO: Reemplazar con la URL real del servidor WebSocket
    const wsUrl = 'ws://localhost:3001';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Conexión WebSocket establecida');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('Error en la conexión WebSocket:', error);
      };

      this.ws.onclose = () => {
        console.log('Conexión WebSocket cerrada');
        // Reintentar conexión después de 5 segundos
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
    } catch (error) {
      console.error('Error al inicializar WebSocket:', error);
    }
  }

  private handleIncomingMessage(data: any) {
    const { type, payload } = data;

    switch (type) {
      case 'new_message':
        this.addMessage(payload);
        this.eventEmitter.emit('messageReceived', payload);
        break;
      case 'status_update':
        this.updateMessageStatus(payload);
        break;
      default:
        console.warn('Tipo de mensaje no manejado:', type);
    }
  }

  public sendMessage(message: Omit<ChatMessage, 'id' | 'timestamp' | 'status'>) {
    const newMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'sent' as const
    };

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Si no hay conexión WebSocket, almacenamos el mensaje localmente
      this.addMessage(newMessage);
      return newMessage;
    }

    this.ws.send(JSON.stringify({
      type: 'new_message',
      payload: newMessage
    }));

    // Almacenamos el mensaje localmente después de enviarlo
    this.addMessage(newMessage);
    return newMessage;
  }

  private addMessage(message: ChatMessage) {
    const userMessages = this.messages.get(message.userId) || [];
    userMessages.push(message);
    this.messages.set(message.userId, userMessages);
    this.saveMessagesToStorage();
  }

  private updateMessageStatus(payload: { messageId: string; status: ChatMessage['status'] }) {
    this.messages.forEach((userMessages) => {
      const message = userMessages.find(m => m.id === payload.messageId);
      if (message) {
        message.status = payload.status;
        this.eventEmitter.emit('messageStatusUpdated', message);
        this.saveMessagesToStorage();
      }
    });
  }

  public getMessages(userId: string): ChatMessage[] {
    return this.messages.get(userId) || [];
  }

  public getAllMessages(): ChatMessage[] {
    const allMessages: ChatMessage[] = [];
    this.messages.forEach(userMessages => {
      allMessages.push(...userMessages);
    });
    return allMessages.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public onMessage(callback: (message: ChatMessage) => void) {
    this.eventEmitter.on('messageReceived', callback);
    return () => this.eventEmitter.off('messageReceived', callback);
  }

  public onStatusUpdate(callback: (message: ChatMessage) => void) {
    this.eventEmitter.on('messageStatusUpdated', callback);
    return () => this.eventEmitter.off('messageStatusUpdated', callback);
  }

  private loadMessagesFromStorage(): Map<string, ChatMessage[]> {
    if (typeof window === 'undefined') return new Map();

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return new Map();

    try {
      const data = JSON.parse(stored);
      return new Map(Object.entries(data));
    } catch (error) {
      console.error('Error loading messages from storage:', error);
      return new Map();
    }
  }

  private saveMessagesToStorage() {
    if (typeof window === 'undefined') return;

    try {
      const data = Object.fromEntries(this.messages);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving messages to storage:', error);
    }
  }

  public deleteConversation(userId: string) {
    this.messages.delete(userId);
    this.saveMessagesToStorage();
    this.eventEmitter.emit('conversationDeleted', userId);
  }
}

export const chatService = ChatService.getInstance();