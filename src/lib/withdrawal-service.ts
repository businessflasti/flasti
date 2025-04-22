import { EventEmitter } from 'events';

export interface WithdrawalRequest {
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

class WithdrawalService {
  private static instance: WithdrawalService;
  private eventEmitter: EventEmitter;
  private withdrawalRequests: Map<string, WithdrawalRequest[]>;
  private readonly STORAGE_KEY = 'withdrawal_requests';
  private ws: WebSocket | null = null;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.withdrawalRequests = this.loadRequestsFromStorage();
    this.initializeWebSocket();
  }

  public static getInstance(): WithdrawalService {
    if (!WithdrawalService.instance) {
      WithdrawalService.instance = new WithdrawalService();
    }
    return WithdrawalService.instance;
  }

  private initializeWebSocket() {
    // TODO: Reemplazar con la URL real del servidor WebSocket
    const wsUrl = 'ws://localhost:3001';

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('Conexión WebSocket establecida para retiros');
      };

      this.ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        this.handleIncomingMessage(data);
      };

      this.ws.onerror = (error) => {
        console.error('Error en la conexión WebSocket para retiros:', error);
      };

      this.ws.onclose = () => {
        console.log('Conexión WebSocket cerrada para retiros');
        // Reintentar conexión después de 5 segundos
        setTimeout(() => this.initializeWebSocket(), 5000);
      };
    } catch (error) {
      console.error('Error al inicializar WebSocket para retiros:', error);
    }
  }

  private handleIncomingMessage(data: any) {
    const { type, payload } = data;

    switch (type) {
      case 'new_withdrawal_request':
        this.addWithdrawalRequest(payload);
        this.eventEmitter.emit('requestReceived', payload);
        break;
      case 'status_update':
        this.updateRequestStatus(payload);
        break;
      default:
        console.warn('Tipo de mensaje no manejado:', type);
    }
  }

  public validateWithdrawalRequest(userId: string, amount: number): { valid: boolean; message?: string } {
    // Validar que el monto sea mayor que cero
    if (amount <= 0) {
      return { valid: false, message: 'El monto debe ser mayor que cero' };
    }

    // Simular validación de balance disponible
    const userBalance = 100; // En un caso real, esto vendría de la base de datos
    if (amount > userBalance) {
      return { valid: false, message: 'Balance insuficiente para realizar el retiro' };
    }

    return { valid: true };
  }

  public createWithdrawalRequest(request: Omit<WithdrawalRequest, 'id' | 'timestamp' | 'status'>): WithdrawalRequest {
    const newRequest = {
      ...request,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'pending' as const
    };

    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      // Si no hay conexión WebSocket, almacenamos la solicitud localmente
      this.addWithdrawalRequest(newRequest);
      return newRequest;
    }

    this.ws.send(JSON.stringify({
      type: 'new_withdrawal_request',
      payload: newRequest
    }));

    // Almacenamos la solicitud localmente después de enviarla
    this.addWithdrawalRequest(newRequest);
    return newRequest;
  }

  public updateRequestStatus(payload: { requestId: string; status: WithdrawalRequest['status']; notes?: string }) {
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

        // Notificar a los suscriptores sobre el cambio de estado
        this.eventEmitter.emit('statusUpdated', requests[index]);
      }
    });

    if (updated) {
      this.saveRequestsToStorage();

      // Enviar actualización a través de WebSocket si está disponible
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({
          type: 'status_update',
          payload
        }));
      }
    }

    return updated;
  }

  private addWithdrawalRequest(request: WithdrawalRequest) {
    const userRequests = this.withdrawalRequests.get(request.userId) || [];
    userRequests.push(request);
    this.withdrawalRequests.set(request.userId, userRequests);
    this.saveRequestsToStorage();
  }

  public getAllRequests(): WithdrawalRequest[] {
    const allRequests: WithdrawalRequest[] = [];
    this.withdrawalRequests.forEach(requests => {
      allRequests.push(...requests);
    });
    return allRequests.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getUserRequests(userId: string): WithdrawalRequest[] {
    return (this.withdrawalRequests.get(userId) || []).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  public onRequestReceived(callback: (request: WithdrawalRequest) => void) {
    this.eventEmitter.on('requestReceived', callback);
    return () => this.eventEmitter.off('requestReceived', callback);
  }

  public onStatusUpdated(callback: (request: WithdrawalRequest) => void) {
    this.eventEmitter.on('statusUpdated', callback);
    return () => this.eventEmitter.off('statusUpdated', callback);
  }

  private loadRequestsFromStorage(): Map<string, WithdrawalRequest[]> {
    if (typeof window === 'undefined') {
      return new Map();
    }

    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (!storedData) {
      return new Map();
    }

    try {
      const parsedData = JSON.parse(storedData);
      return new Map(Object.entries(parsedData));
    } catch (error) {
      console.error('Error al cargar solicitudes de retiro:', error);
      return new Map();
    }
  }

  private saveRequestsToStorage() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const data = Object.fromEntries(this.withdrawalRequests);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error al guardar solicitudes de retiro:', error);
    }
  }

  // Verificar si un usuario tiene suficiente balance para realizar un retiro
  public checkUserBalance(userId: string, amount: number): boolean {
    // En un caso real, esto consultaría a una API o base de datos
    // Por ahora, simulamos un balance fijo para demostración
    const userBalance = 100; // $100 USD de ejemplo
    return userBalance >= amount;
  }

  // Verificar si el monto de retiro es válido (mayor que cero)
  public validateWithdrawalAmount(amount: number): boolean {
    return amount > 0;
  }

  // Validar una solicitud de retiro (monto válido y balance suficiente)
  public validateWithdrawalRequest(userId: string, amount: number): { valid: boolean; message?: string } {
    if (!this.validateWithdrawalAmount(amount)) {
      return { valid: false, message: 'El monto debe ser mayor que cero' };
    }

    if (!this.checkUserBalance(userId, amount)) {
      return { valid: false, message: 'No tienes suficiente balance disponible para este retiro' };
    }

    return { valid: true };
  }
}

export const withdrawalService = WithdrawalService.getInstance();