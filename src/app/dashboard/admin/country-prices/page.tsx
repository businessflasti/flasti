'use client';

import { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CountryPriceService, type CountryPrice } from '@/lib/country-price-service';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [prices, setPrices] = useState<CountryPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Cargar precios al montar el componente
  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async () => {
    setLoading(true);
    const data = await CountryPriceService.getAllCountryPrices();
    setPrices(data);
    setLoading(false);
  };



  // Manejar cambios en los precios
  const handlePriceChange = (countryCode: string, newPrice: string) => {
    setPrices(currentPrices =>
      currentPrices.map(price =>
        price.country_code === countryCode
          ? { ...price, price: parseFloat(newPrice) || 0 }
          : price
      )
    );
  };

  // Guardar cambios
  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await CountryPriceService.updateMultipleCountryPrices(
        prices.map(p => ({
          country_code: p.country_code,
          price: p.price
        }))
      );

      if (success) {
        toast.success('Precios actualizados correctamente');
        loadPrices(); // Recargar precios para obtener timestamps actualizados
      } else {
        toast.error('Error al actualizar los precios');
      }
    } catch (error) {
      console.error('Error al guardar precios:', error);
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin text-primary mr-2">⟳</div>
      <span>Cargando precios...</span>
    </div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administrar Precios por País</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {prices.map(price => (
          <Card key={price.country_code} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <span className="text-2xl mr-2">
                  {price.country_code === 'AR' ? '🇦🇷' :
                   price.country_code === 'CO' ? '🇨🇴' :
                   price.country_code === 'PE' ? '🇵🇪' :
                   price.country_code === 'MX' ? '🇲🇽' :
                   price.country_code === 'PA' ? '🇵🇦' :
                   price.country_code === 'GT' ? '🇬🇹' :
                   price.country_code === 'DO' ? '🇩🇴' :
                   price.country_code === 'PY' ? '🇵🇾' :
                   price.country_code === 'ES' ? '🇪🇸' :
                   price.country_code === 'CR' ? '🇨🇷' :
                   price.country_code === 'CL' ? '🇨🇱' :
                   price.country_code === 'UY' ? '🇺🇾' :
                   price.country_code === 'BO' ? '🇧🇴' :
                   price.country_code === 'HN' ? '🇭🇳' : '🌎'}
                </span>
                <div>
                  <h3 className="font-medium">{price.country_name}</h3>
                  <p className="text-sm text-muted-foreground">{price.currency_code}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-medium">{price.currency_symbol}</span>
              <Input
                type="number"
                value={price.country_code === 'CO' || price.country_code === 'PY' ? 
                  price.price.toFixed(3) : 
                  price.price.toString()}
                onChange={(e) => handlePriceChange(price.country_code, e.target.value)}
                className="w-full"
                min="0"
                step={price.country_code === 'CO' || price.country_code === 'PY' ? "0.001" : "0.01"}
              />
            </div>
            
            <p className="text-xs text-muted-foreground mt-2">
              Última actualización: {new Date(price.updated_at).toLocaleString()}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
