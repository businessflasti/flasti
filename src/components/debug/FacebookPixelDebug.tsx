"use client";

import { useEffect, useState } from 'react';
import unifiedTrackingService from '@/lib/unified-tracking-service';

interface FacebookPixelDebugProps {
  isVisible?: boolean;
}

const FacebookPixelDebug = ({ isVisible = false }: FacebookPixelDebugProps) => {
  const [pixelStatus, setPixelStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    // Verificar si Facebook Pixel está cargado
    const checkPixelStatus = () => {
      if (typeof window !== 'undefined') {
        if (window.fbq) {
          setPixelStatus('loaded');
          console.log('✅ Facebook Pixel está cargado y funcionando');
        } else {
          setPixelStatus('error');
          console.log('❌ Facebook Pixel no está cargado');
        }
      }
    };

    // Verificar inmediatamente
    checkPixelStatus();

    // Verificar cada segundo durante los primeros 10 segundos
    const interval = setInterval(checkPixelStatus, 1000);
    setTimeout(() => clearInterval(interval), 10000);

    return () => clearInterval(interval);
  }, []);

  const testEvents = [
    {
      name: 'PageView',
      action: () => {
        unifiedTrackingService.trackPageView();
        addEvent('PageView enviado');
      }
    },
    {
      name: 'InitiateCheckout',
      action: () => {
        unifiedTrackingService.trackInitiateCheckout();
        addEvent('InitiateCheckout enviado');
      }
    },
    {
      name: 'AddPaymentInfo',
      action: () => {
        unifiedTrackingService.trackAddPaymentInfo('test');
        addEvent('AddPaymentInfo enviado');
      }
    },
    {
      name: 'Purchase',
      action: () => {
        unifiedTrackingService.trackPurchase({
          transaction_id: 'test_' + Date.now(),
          value: 10,
          currency: 'USD',
          payment_method: 'test',
          content_name: 'Test Product'
        });
        addEvent('Purchase enviado');
      }
    },
    {
      name: 'Lead',
      action: () => {
        unifiedTrackingService.trackLead({
          content_name: 'Test Lead',
          value: 10,
          currency: 'USD'
        });
        addEvent('Lead enviado');
      }
    }
  ];

  const addEvent = (eventName: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setEvents(prev => [`${timestamp}: ${eventName}`, ...prev.slice(0, 9)]);
  };

  const clearEvents = () => {
    setEvents([]);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700 z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold">Facebook Pixel Debug</h3>
        <div className={`w-3 h-3 rounded-full ${
          pixelStatus === 'loaded' ? 'bg-green-500' : 
          pixelStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
        }`}></div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-400 mb-1">Estado:</p>
        <p className={`text-xs ${
          pixelStatus === 'loaded' ? 'text-green-400' : 
          pixelStatus === 'error' ? 'text-red-400' : 'text-yellow-400'
        }`}>
          {pixelStatus === 'loaded' ? '✅ Pixel cargado' : 
           pixelStatus === 'error' ? '❌ Pixel no encontrado' : '⏳ Cargando...'}
        </p>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-400 mb-2">Eventos de prueba:</p>
        <div className="grid grid-cols-2 gap-1">
          {testEvents.map((event) => (
            <button
              key={event.name}
              onClick={event.action}
              className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded transition-colors"
              disabled={pixelStatus !== 'loaded'}
            >
              {event.name}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-gray-400">Eventos enviados:</p>
          <button
            onClick={clearEvents}
            className="text-xs text-gray-500 hover:text-white"
          >
            Limpiar
          </button>
        </div>
        <div className="max-h-32 overflow-y-auto bg-gray-800 p-2 rounded text-xs">
          {events.length === 0 ? (
            <p className="text-gray-500">No hay eventos</p>
          ) : (
            events.map((event, index) => (
              <div key={index} className="text-green-400 mb-1">
                {event}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500">
        <p>Pixel ID: 2198693197269102</p>
        <p>Abre DevTools → Network para ver requests</p>
      </div>
    </div>
  );
};

export default FacebookPixelDebug;
