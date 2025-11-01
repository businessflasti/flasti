'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface RecordedAction {
  type: 'click' | 'input' | 'scroll' | 'wait';
  timestamp: number;
  target?: string;
  value?: string;
  x?: number;
  y?: number;
  scrollY?: number;
}

interface CountryPrice {
  country_code: string;
  country_name: string;
  price: number;
  currency: string;
}

export default function CountryPricesPage() {
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordedActions, setRecordedActions] = useState<RecordedAction[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [countries, setCountries] = useState<CountryPrice[]>([]);
  const [showRecorder, setShowRecorder] = useState(false);
  const recordingRef = useRef<RecordedAction[]>([]);

  // Cargar precios
  useEffect(() => {
    loadCountries();
    loadRecording();
  }, []);

  const loadCountries = async () => {
    // Aquí cargarías los países desde tu API
    const mockCountries: CountryPrice[] = [
      { country_code: 'AR', country_name: 'Argentina', price: 47.00, currency: 'USD' },
      { country_code: 'CO', country_name: 'Colombia', price: 97.00, currency: 'USD' },
      { country_code: 'PE', country_name: 'Perú', price: 97.00, currency: 'USD' },
      { country_code: 'MX', country_name: 'México', price: 97.00, currency: 'USD' },
      { country_code: 'CL', country_name: 'Chile', price: 97.00, currency: 'USD' },
    ];
    setCountries(mockCountries);
  };

  const loadRecording = () => {
    const saved = localStorage.getItem('price_recorder_actions');
    if (saved) {
      setRecordedActions(JSON.parse(saved));
    }
  };

  const saveRecording = (actions: RecordedAction[]) => {
    localStorage.setItem('price_recorder_actions', JSON.stringify(actions));
    setRecordedActions(actions);
  };

  // Iniciar grabación
  const startRecording = () => {
    setIsRecording(true);
    setStartTime(Date.now());
    recordingRef.current = [];
    
    // Capturar clics
    document.addEventListener('click', captureClick, true);
    // Capturar inputs
    document.addEventListener('input', captureInput, true);
    // Capturar scroll
    document.addEventListener('scroll', captureScroll, true);
  };

  // Detener grabación
  const stopRecording = () => {
    setIsRecording(false);
    
    // Remover listeners
    document.removeEventListener('click', captureClick, true);
    document.removeEventListener('input', captureInput, true);
    document.removeEventListener('scroll', captureScroll, true);
    
    // Guardar
    saveRecording(recordingRef.current);
    alert(`✅ Grabación guardada: ${recordingRef.current.length} acciones`);
  };

  // Capturar clic
  const captureClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const selector = getSelector(target);
    
    const action: RecordedAction = {
      type: 'click',
      timestamp: Date.now() - startTime,
      target: selector,
      x: e.clientX,
      y: e.clientY,
    };
    
    recordingRef.current.push(action);
    showVisualFeedback(e.clientX, e.clientY);
  };

  // Capturar input
  const captureInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const selector = getSelector(target);
    
    const action: RecordedAction = {
      type: 'input',
      timestamp: Date.now() - startTime,
      target: selector,
      value: target.value,
    };
    
    recordingRef.current.push(action);
  };

  // Capturar scroll
  const captureScroll = (e: Event) => {
    const action: RecordedAction = {
      type: 'scroll',
      timestamp: Date.now() - startTime,
      scrollY: window.scrollY,
    };
    
    recordingRef.current.push(action);
  };

  // Obtener selector CSS del elemento
  const getSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter(c => c).join('.');
      return `.${classes}`;
    }
    return element.tagName.toLowerCase();
  };

  // Feedback visual al grabar
  const showVisualFeedback = (x: number, y: number) => {
    const dot = document.createElement('div');
    dot.style.position = 'fixed';
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.style.width = '20px';
    dot.style.height = '20px';
    dot.style.borderRadius = '50%';
    dot.style.backgroundColor = 'red';
    dot.style.opacity = '0.7';
    dot.style.pointerEvents = 'none';
    dot.style.zIndex = '9999';
    dot.style.transform = 'translate(-50%, -50%)';
    document.body.appendChild(dot);
    
    setTimeout(() => {
      dot.style.transition = 'all 0.5s';
      dot.style.opacity = '0';
      dot.style.transform = 'translate(-50%, -50%) scale(2)';
      setTimeout(() => dot.remove(), 500);
    }, 100);
  };

  // Reproducir grabación
  const playRecording = async () => {
    if (recordedActions.length === 0) {
      alert('❌ No hay acciones grabadas');
      return;
    }

    setIsPlaying(true);
    
    for (let i = 0; i < recordedActions.length; i++) {
      const action = recordedActions[i];
      const nextAction = recordedActions[i + 1];
      
      // Ejecutar acción
      await executeAction(action);
      
      // Esperar hasta la siguiente acción
      if (nextAction) {
        const delay = nextAction.timestamp - action.timestamp;
        await wait(delay);
      }
    }
    
    setIsPlaying(false);
    alert('✅ Reproducción completada');
  };

  // Ejecutar una acción
  const executeAction = async (action: RecordedAction) => {
    switch (action.type) {
      case 'click':
        if (action.target) {
          const element = document.querySelector(action.target) as HTMLElement;
          if (element) {
            element.click();
            if (action.x && action.y) {
              showVisualFeedback(action.x, action.y);
            }
          }
        }
        break;
        
      case 'input':
        if (action.target && action.value) {
          const element = document.querySelector(action.target) as HTMLInputElement;
          if (element) {
            element.value = action.value;
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        break;
        
      case 'scroll':
        if (action.scrollY !== undefined) {
          window.scrollTo({ top: action.scrollY, behavior: 'smooth' });
        }
        break;
    }
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  // Limpiar grabación
  const clearRecording = () => {
    if (confirm('¿Seguro que quieres eliminar la grabación?')) {
      setRecordedActions([]);
      localStorage.removeItem('price_recorder_actions');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      {/* Indicador de grabación */}
      {isRecording && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3 animate-pulse">
          <div className="w-4 h-4 bg-white rounded-full animate-ping"></div>
          <span className="font-bold">🔴 GRABANDO...</span>
        </div>
      )}

      {/* Indicador de reproducción */}
      {isPlaying && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-3">
          <div className="w-4 h-4 bg-white rounded-full"></div>
          <span className="font-bold">▶️ REPRODUCIENDO...</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                💰 Gestión de Precios por País
              </h1>
              <p className="text-purple-200">
                Actualiza los precios de Hotmart para cada país
              </p>
            </div>
            <button
              onClick={() => router.push('/admin-access')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
            >
              ← Volver
            </button>
          </div>
        </div>

        {/* Panel de Grabación */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">🎬 Grabador de Acciones</h2>
            <button
              onClick={() => setShowRecorder(!showRecorder)}
              className="text-white hover:text-purple-200 transition"
            >
              {showRecorder ? '▼ Ocultar' : '▶ Mostrar'}
            </button>
          </div>

          {showRecorder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={startRecording}
                  disabled={isRecording || isPlaying}
                  className="px-6 py-4 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white rounded-xl font-bold transition"
                >
                  🔴 Grabar
                </button>

                <button
                  onClick={stopRecording}
                  disabled={!isRecording}
                  className="px-6 py-4 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 text-white rounded-xl font-bold transition"
                >
                  ⏹️ Detener
                </button>

                <button
                  onClick={playRecording}
                  disabled={isRecording || isPlaying || recordedActions.length === 0}
                  className="px-6 py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-500 text-white rounded-xl font-bold transition"
                >
                  ▶️ Reproducir
                </button>

                <button
                  onClick={clearRecording}
                  disabled={isRecording || isPlaying}
                  className="px-6 py-4 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white rounded-xl font-bold transition"
                >
                  🗑️ Limpiar
                </button>
              </div>

              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-white text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Acciones grabadas:</span>
                    <span className="font-bold">{recordedActions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado:</span>
                    <span className="font-bold">
                      {isRecording ? '🔴 Grabando' : isPlaying ? '▶️ Reproduciendo' : '⚪ Detenido'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-500/20 border border-blue-400 rounded-lg p-4">
                <p className="text-blue-100 text-sm">
                  <strong>💡 Cómo usar:</strong><br/>
                  1. Haz clic en "🔴 Grabar"<br/>
                  2. Realiza las acciones que quieres automatizar (clics, escribir, scroll)<br/>
                  3. Haz clic en "⏹️ Detener" cuando termines<br/>
                  4. Haz clic en "▶️ Reproducir" para ejecutar automáticamente
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tabla de Precios */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">📊 Precios Actuales</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left text-white font-semibold p-3">País</th>
                  <th className="text-left text-white font-semibold p-3">Código</th>
                  <th className="text-left text-white font-semibold p-3">Precio</th>
                  <th className="text-left text-white font-semibold p-3">Moneda</th>
                  <th className="text-left text-white font-semibold p-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {countries.map((country) => (
                  <tr key={country.country_code} className="border-b border-white/10 hover:bg-white/5 transition">
                    <td className="text-white p-3">{country.country_name}</td>
                    <td className="text-purple-200 p-3">{country.country_code}</td>
                    <td className="text-white p-3">
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={country.price}
                        className="bg-white/10 border border-white/20 rounded px-3 py-1 text-white w-24"
                      />
                    </td>
                    <td className="text-purple-200 p-3">{country.currency}</td>
                    <td className="p-3">
                      <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition">
                        Actualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
