'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CountryPriceService, type CountryPrice } from '@/lib/country-price-service';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';

export default function CountryPricesPage() {
  const [prices, setPrices] = useState<CountryPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lockedPrices, setLockedPrices] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadPrices();
  }, []);

  // Escuchar evento del botón en el header
  useEffect(() => {
    const handleSaveEvent = () => {
      handleSave();
    };

    window.addEventListener('saveCountryPrices', handleSaveEvent);
    return () => window.removeEventListener('saveCountryPrices', handleSaveEvent);
  }, [prices, saving]);

  const loadPrices = async () => {
    setLoading(true);
    const data = await CountryPriceService.getAllCountryPrices();
    setPrices(data);
    
    // Cargar estados de bloqueo desde la base de datos
    const locked = new Set<string>();
    data.forEach(price => {
      if (price.is_locked) {
        locked.add(price.country_code);
      }
    });
    setLockedPrices(locked);
    
    setLoading(false);
  };

  const handlePriceChange = (countryCode: string, newPrice: string) => {
    if (lockedPrices.has(countryCode)) {
      toast.error('Este precio está bloqueado');
      return;
    }
    
    setPrices(currentPrices =>
      currentPrices.map(price =>
        price.country_code === countryCode
          ? { ...price, price: newPrice === '' ? 0 : Number(newPrice) }
          : price
      )
    );
  };

  const toggleLock = (countryCode: string) => {
    setLockedPrices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(countryCode)) {
        newSet.delete(countryCode);
        toast.success('Precio desbloqueado');
      } else {
        newSet.add(countryCode);
        toast.success('Precio bloqueado');
      }
      return newSet;
    });

    // Actualizar también en el array de precios
    setPrices(currentPrices =>
      currentPrices.map(price =>
        price.country_code === countryCode
          ? { ...price, is_locked: !lockedPrices.has(countryCode) }
          : price
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await CountryPriceService.updateMultipleCountryPrices(
        prices.map(p => ({
          country_code: p.country_code,
          price: p.price,
          is_locked: p.is_locked || false
        }))
      );

      if (success) {
        toast.success('Precios y bloqueos actualizados correctamente');
        loadPrices();
      } else {
        toast.error('Error al actualizar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar');
    } finally {
      setSaving(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-white">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
        <div className="max-w-[1800px] mx-auto">
          <div className="space-y-6">

            {/* Lista de Precios - Súper Compacta (2 por línea) */}
            <Card className="bg-[#121212] border-0">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prices.map(price => {
                      // Abreviar nombres largos
                      const shortName = price.country_name.length > 12 
                        ? price.country_name.substring(0, 12) + '...' 
                        : price.country_name;
                      
                      const isLocked = lockedPrices.has(price.country_code);
                      
                      return (
                        <div 
                          key={price.country_code}
                          className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 hover:border-blue-500/30 transition-all"
                        >
                          {/* Bandera */}
                          <CountryFlag countryCode={price.country_code} size="sm" />
                          
                          {/* Nombre del país - ancho fijo */}
                          <div className="w-[90px]">
                            <h3 className="font-bold text-white text-xs truncate" title={price.country_name}>
                              {shortName}
                            </h3>
                          </div>
                          
                          {/* Código de moneda - ancho fijo */}
                          <div className="text-xs text-gray-400 w-[35px]">
                            {price.currency_code}
                          </div>
                          
                          {/* Símbolo - ancho fijo */}
                          <span className="text-white font-bold text-sm w-[20px]">
                            {price.currency_symbol}
                          </span>
                          
                          {/* Input precio - ancho fijo para todos */}
                          <Input
                            type="number"
                            value={
                              // Solo aplicar .toFixed(2) a los nuevos países USD
                              ['US', 'VE', 'SV', 'EC', 'PR'].includes(price.country_code)
                                ? price.price.toFixed(2)
                                : price.price
                            }
                            onChange={(e) => handlePriceChange(price.country_code, e.target.value)}
                            disabled={isLocked}
                            className={`bg-[#121212] border-white/10 text-white font-bold h-8 text-xs w-[100px] ${
                              isLocked ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            min="0"
                            step={
                              // Step de 0.01 solo para los nuevos países
                              ['US', 'VE', 'SV', 'EC', 'PR'].includes(price.country_code)
                                ? "0.01"
                                : "any"
                            }
                          />
                          
                          {/* Botón de bloqueo/desbloqueo */}
                          <button
                            onClick={() => toggleLock(price.country_code)}
                            className="text-gray-400 hover:text-white transition-colors"
                            title={isLocked ? 'Desbloquear precio' : 'Bloquear precio'}
                          >
                            {isLocked ? (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-green-400">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                              </svg>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
