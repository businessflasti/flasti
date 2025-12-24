'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CountryPriceService, type CountryPrice } from '@/lib/country-price-service';
import { toast } from 'sonner';
import { DollarSign, RefreshCw } from 'lucide-react';
import CountryFlag from '@/components/ui/CountryFlag';

export default function CountryPricesPage() {
  const [prices, setPrices] = useState<CountryPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lockedPrices, setLockedPrices] = useState<Set<string>>(new Set());

  // Precio base oficial en USD
  const BASE_PRICE_USD = 10.00;

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

  const handleExchangeRateChange = (countryCode: string, newRate: string) => {
    if (lockedPrices.has(countryCode)) {
      toast.error('Este precio está bloqueado');
      return;
    }
    
    setPrices(currentPrices =>
      currentPrices.map(price =>
        price.country_code === countryCode
          ? { ...price, usd_exchange_rate: newRate === '' ? 1 : Number(newRate) }
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
          usd_exchange_rate: p.usd_exchange_rate,
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

  // Calcular precio local basado en tipo de cambio
  const getLocalPrice = (exchangeRate: number) => {
    return BASE_PRICE_USD * exchangeRate;
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

            {/* Info del precio base */}
            <Card className="bg-[#121212] border-0">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500/20">
                    <DollarSign className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Precio base oficial</p>
                    <p className="text-white text-2xl font-bold">${BASE_PRICE_USD.toFixed(2)} USD</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Precios - Con tipo de cambio */}
            <Card className="bg-[#121212] border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    Precios por país (USD principal + divisa local)
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {prices.map(price => {
                      // Abreviar nombres largos
                      const shortName = price.country_name.length > 12 
                        ? price.country_name.substring(0, 12) + '...' 
                        : price.country_name;
                      
                      const isLocked = lockedPrices.has(price.country_code);
                      const isUSD = price.currency_code === 'USD';
                      const localPrice = getLocalPrice(price.usd_exchange_rate || 1);
                      
                      return (
                        <div 
                          key={price.country_code}
                          className="flex items-center gap-2 bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 hover:border-blue-500/30 transition-all"
                        >
                          {/* Bandera */}
                          <CountryFlag countryCode={price.country_code} size="sm" />
                          
                          {/* Nombre del país - ancho fijo */}
                          <div className="w-[80px]">
                            <h3 className="font-bold text-white text-xs truncate" title={price.country_name}>
                              {shortName}
                            </h3>
                          </div>
                          
                          {/* Precio USD (principal) */}
                          <div className="flex items-center gap-1 bg-green-500/10 px-2 py-1 rounded">
                            <span className="text-green-400 font-bold text-sm">$</span>
                            <span className="text-green-400 font-bold text-sm">{BASE_PRICE_USD.toFixed(2)}</span>
                            <span className="text-green-400/60 text-xs">USD</span>
                          </div>
                          
                          {/* Separador */}
                          <span className="text-gray-500">=</span>
                          
                          {/* Precio en moneda local */}
                          <div className="flex items-center gap-1">
                            <span className="text-white font-bold text-sm">
                              {price.currency_symbol}
                            </span>
                            <Input
                              type="number"
                              value={isUSD ? BASE_PRICE_USD.toFixed(2) : (price.price || localPrice).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                              onChange={(e) => handlePriceChange(price.country_code, e.target.value)}
                              disabled={isLocked || isUSD}
                              className={`bg-[#121212] border-white/10 text-white font-bold h-8 text-xs w-[90px] ${
                                isLocked || isUSD ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              min="0"
                              step="any"
                            />
                            <span className="text-gray-400 text-xs w-[30px]">
                              {price.currency_code}
                            </span>
                          </div>
                          
                          {/* Input tipo de cambio USD (solo si no es USD) */}
                          {!isUSD && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">TC:</span>
                              <Input
                                type="number"
                                value={price.usd_exchange_rate || 1}
                                onChange={(e) => handleExchangeRateChange(price.country_code, e.target.value)}
                                disabled={isLocked}
                                className={`bg-[#121212] border-white/10 text-blue-400 font-bold h-8 text-xs w-[60px] ${
                                  isLocked ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                min="0.01"
                                step="0.01"
                                title="Tipo de cambio: 1 USD = X moneda local"
                              />
                            </div>
                          )}
                          
                          {/* Botón de bloqueo/desbloqueo */}
                          <button
                            onClick={() => toggleLock(price.country_code)}
                            className="text-gray-400 hover:text-white transition-colors ml-auto"
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
