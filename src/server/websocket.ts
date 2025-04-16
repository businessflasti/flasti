import { WebSocketServer, WebSocket } from 'ws';
import { EventEmitter } from 'events';
import crypto from 'crypto';

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'sent' | 'delivered';
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  email: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  timestamp: string;
  paymentMethod: 'paypal';
  notes?: string;
  balance?: number;
}

class WithdrawalWebSocketServer {
  private wss: WebSocketServer;
  private clients: Map<string, WebSocket>;
  private withdrawalRequests: Map<string, WithdrawalRequest[]>;
  private eventEmitter: EventEmitter;

  constructor(port: number) {
    this.wss = new WebSocketServer({ port });
    this.clients = new Map();
    this.withdrawalRequests = new Map();
    this.eventEmitter = new EventEmitter();
    this.initialize();
  }

  private initialize() {
    this.wss.on('connection', (ws: WebSocket) => {
      const clientId = crypto.randomUUID();
      this.clients.set(clientId, ws);

      ws.on('message', (data: Buffer) => {
        try {
          const parsedData = JSON.parse(data.toString());
          this.handleMessage(clientId, parsedData);
        } catch (error) {
          console.error('Error al procesar mensaje:', error);
        }
      });

      ws.on('close', () => {
        this.clients.delete(clientId);
      });

      // Enviar historial de solicitudes al cliente cuando se conecta
      const allRequests = this.getAllWithdrawalRequests();
      ws.send(JSON.stringify({
        type: 'history',
        payload: allRequests
      }));
    });
  }

  private handleMessage(clientId: string, data: any) {
    const { type, payload } = data;

    switch (type) {
      case 'new_withdrawal_request':
        this.handleNewWithdrawalRequest(payload);
        break;
      case 'status_update':
        this.handleStatusUpdate(payload);
        break;
      default:
        console.warn('Tipo de mensaje no manejado:', type);
    }
  }

  private handleNewWithdrawalRequest(request: WithdrawalRequest) {
    const userRequests = this.withdrawalRequests.get(request.userId) || [];
    userRequests.push(request);
    this.withdrawalRequests.set(request.userId, userRequests);

    // Notificar a todos los clientes sobre la nueva solicitud
    this.broadcast({
      type: 'new_withdrawal_request',
      payload: request
    });

  private handleStatusUpdate(payload: { requestId: string; status: WithdrawalRequest['status']; notes?: string }) {
    let updated = false;

    this.withdrawalRequests.forEach((requests, userId) => {
      const index = requests.findIndex(r => r.id === payload.requestId);
      if (index !== -1) {
        requests[index].status = payload.status;
        if (payload.notes) {
          requests[index].notes = payload.notes;
        }
        this.withdrawalRequests.set(userId, requests);
        updated = true;

        // Notificar a todos los clientes sobre la actualización
        this.broadcast({
          type: 'status_update',
          payload: requests[index]
        });
      }
    });
  }

  private broadcast(data: any) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  }

  private getAllWithdrawalRequests(): WithdrawalRequest[] {
    const allRequests: WithdrawalRequest[] = [];
    this.withdrawalRequests.forEach(requests => {
      allRequests.push(...requests);
    });
    return allRequests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  private updateMessageStatus(payload: { messageId: string; status: ChatMessage['status'] }) {
    this.messages.forEach((userMessages) => {
      const message = userMessages.find(m => m.id === payload.messageId);
      if (message) {
        message.status = payload.status;
        this.broadcastStatusUpdate(message);
      }
    });
  }

  private broadcastStatusUpdate(message: ChatMessage) {
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'status_update',
          payload: {
            messageId: message.id,
            status: message.status
          }
        }));
      }
    });
  }

  private getAllMessages(): ChatMessage[] {
    const allMessages: ChatMessage[] = [];
    this.messages.forEach(userMessages => {
      // Ordenar los mensajes del usuario por fecha
      const sortedUserMessages = userMessages.sort((a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      allMessages.push(...sortedUserMessages);
    });
    // Agrupar mensajes por usuario y ordenar por el último mensaje
    const groupedMessages = new Map<string, ChatMessage[]>();
    allMessages.forEach(message => {
      const userMessages = groupedMessages.get(message.userId) || [];
      userMessages.push(message);
      groupedMessages.set(message.userId, userMessages);
    });
    const finalMessages: ChatMessage[] = [];
    groupedMessages.forEach(userMessages => {
      finalMessages.push(...userMessages);
    });
    return finalMessages;
  }
}

// Iniciar el servidor WebSocket en el puerto 3001
const chatServer = new ChatWebSocketServer(3001);