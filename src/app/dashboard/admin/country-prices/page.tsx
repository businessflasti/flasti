'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CountryPriceService, type CountryPrice } from '@/lib/country-price-service';
import { toast } from 'sonner';
import CountryFlag from '@/components/ui/CountryFlag';

export default function CountryPricesPage() {
  const [prices, setPrices] = useState<CountryPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
    setLoading(false);
  };

  const handleExchangeRateChange = (countryCode: string, newRate: string) => {
    setPrices(currentPrices =>
      currentPrices.map(price =>
        price.country_code === countryCode
          ? { ...price, usd_exchange_rate: newRate === '' ? 1 : Number(newRate) }
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
          is_locked: false
        }))
      );

      if (success) {
        toast.success('Tipos de cambio actualizados correctamente');
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
        <Card className="bg-[#121212] border-0">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {prices.map(price => {
                // Abreviar nombres largos
                const shortName = price.country_name.length > 12 
                  ? price.country_name.substring(0, 12) + '...' 
                  : price.country_name;
                
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
                    
                    {/* Precio en moneda local (calculado automáticamente) */}
                    <div className="flex items-center gap-1">
                      <span className="text-white font-bold text-sm">
                        {price.currency_symbol}
                      </span>
                      <span className="text-white font-bold text-sm w-[90px]">
                        {isUSD ? BASE_PRICE_USD.toFixed(2) : localPrice.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                      </span>
                      <span className="text-gray-400 text-xs w-[30px]">
                        {price.currency_code}
                      </span>
                    </div>
                    
                    {/* Input tipo de cambio USD (solo si no es USD) */}
                    {!isUSD && (
                      <div className="flex items-center gap-1 ml-auto">
                        <span className="text-xs text-gray-500">TC:</span>
                        <Input
                          type="number"
                          value={price.usd_exchange_rate || 1}
                          onChange={(e) => handleExchangeRateChange(price.country_code, e.target.value)}
                          className="bg-[#121212] border-white/10 text-blue-400 font-bold h-8 text-xs w-[70px]"
                          min="0.01"
                          step="0.01"
                          title="Tipo de cambio: 1 USD = X moneda local"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
