"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Globe, Plus, Trash2, Save, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface CountryMapping {
  id: string;
  user_country: string;
  offer_country: string;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export default function CountryAssignmentsPage() {
  const [mappings, setMappings] = useState<CountryMapping[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Formulario para nueva asignación
  const [newMapping, setNewMapping] = useState({
    user_country: '',
    offer_country: '',
    notes: ''
  });

  // Cargar asignaciones existentes
  const fetchMappings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/country-mappings');
      const data = await response.json();
      
      if (data.success) {
        setMappings(data.data);
      } else {
        toast.error('Error al cargar asignaciones');
      }
    } catch (error) {
      console.error('Error fetching mappings:', error);
      toast.error('Error al cargar asignaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMappings();
  }, []);

  // Crear o actualizar asignación
  const handleSaveMapping = async () => {
    if (!newMapping.user_country || !newMapping.offer_country) {
      toast.error('Debes completar ambos países');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/admin/country-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_country: newMapping.user_country.toUpperCase(),
          offer_country: newMapping.offer_country.toUpperCase(),
          notes: newMapping.notes,
          is_active: true
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setNewMapping({ user_country: '', offer_country: '', notes: '' });
        fetchMappings();
      } else {
        toast.error(data.error || 'Error al guardar');
      }
    } catch (error) {
      console.error('Error saving mapping:', error);
      toast.error('Error al guardar asignación');
    } finally {
      setSaving(false);
    }
  };

  // Eliminar asignación
  const handleDeleteMapping = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta asignación?')) return;

    try {
      const response = await fetch(`/api/admin/country-mappings?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Asignación eliminada');
        fetchMappings();
      } else {
        toast.error(data.error || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error deleting mapping:', error);
      toast.error('Error al eliminar asignación');
    }
  };

  // Toggle activar/desactivar
  const handleToggleActive = async (mapping: CountryMapping) => {
    try {
      const response = await fetch('/api/admin/country-mappings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_country: mapping.user_country,
          offer_country: mapping.offer_country,
          notes: mapping.notes,
          is_active: !mapping.is_active
        })
      });

      const data = await response.json();

      if (data.success) {
        toast.success(mapping.is_active ? 'Asignación desactivada' : 'Asignación activada');
        fetchMappings();
      } else {
        toast.error(data.error || 'Error al actualizar');
      }
    } catch (error) {
      console.error('Error toggling mapping:', error);
      toast.error('Error al actualizar asignación');
    }
  };

  // Helper para obtener nombre del país
  const getCountryName = (code: string) => {
    try {
      const dn = new Intl.DisplayNames(['es'], { type: 'region' });
      return dn.of(code);
    } catch {
      return code;
    }
  };

  return (
    <div className="min-h-screen bg-[#101010] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Globe className="w-8 h-8" />
              Asignación de Países
            </h1>
            <p className="text-gray-400 mt-2">
              Controla qué ofertas se muestran a cada país
            </p>
          </div>
          <Button
            onClick={fetchMappings}
            variant="outline"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>

        {/* Formulario para nueva asignación */}
        <Card className="bg-[#121212] border-white/10">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Nueva Asignación
            </CardTitle>
            <CardDescription>
              Asigna qué país de ofertas mostrar a los usuarios de un país específico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_country" className="text-white">
                  País del Usuario
                </Label>
                <Input
                  id="user_country"
                  placeholder="AR"
                  value={newMapping.user_country}
                  onChange={(e) => setNewMapping({ ...newMapping, user_country: e.target.value.toUpperCase() })}
                  maxLength={2}
                  className="bg-[#101010] border-0 text-white uppercase"
                />
                <p className="text-xs text-gray-500">
                  Código ISO de 2 letras (ej: AR, PE, MX)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="offer_country" className="text-white">
                  Mostrar Ofertas De
                </Label>
                <Input
                  id="offer_country"
                  placeholder="ES"
                  value={newMapping.offer_country}
                  onChange={(e) => setNewMapping({ ...newMapping, offer_country: e.target.value.toUpperCase() })}
                  maxLength={2}
                  className="bg-[#101010] border-0 text-white uppercase"
                />
                <p className="text-xs text-gray-500">
                  Código ISO de 2 letras (ej: ES, CO, US)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">
                  Notas (opcional)
                </Label>
                <Input
                  id="notes"
                  placeholder="Razón de la asignación..."
                  value={newMapping.notes}
                  onChange={(e) => setNewMapping({ ...newMapping, notes: e.target.value })}
                  className="bg-[#101010] border-0 text-white"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSaveMapping}
                disabled={saving || !newMapping.user_country || !newMapping.offer_country}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Guardando...' : 'Guardar Asignación'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de asignaciones */}
        <Card className="bg-[#121212] border-white/10">
          <CardHeader>
            <CardTitle className="text-white">
              Asignaciones Activas ({mappings.length})
            </CardTitle>
            <CardDescription>
              Gestiona las asignaciones de países existentes
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-gray-400">
                Cargando asignaciones...
              </div>
            ) : mappings.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No hay asignaciones configuradas
              </div>
            ) : (
              <div className="space-y-3">
                {mappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className="flex items-center justify-between p-4 bg-[#101010] rounded-lg border border-0 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-900/30 text-blue-300 border-blue-700">
                          {mapping.user_country}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {getCountryName(mapping.user_country)}
                        </span>
                      </div>

                      <span className="text-gray-500">→</span>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-900/30 text-green-300 border-green-700">
                          {mapping.offer_country}
                        </Badge>
                        <span className="text-gray-400 text-sm">
                          {getCountryName(mapping.offer_country)}
                        </span>
                      </div>

                      {mapping.notes && (
                        <span className="text-xs text-gray-500 ml-4">
                          {mapping.notes}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => handleToggleActive(mapping)}
                        variant="ghost"
                        size="sm"
                        className={mapping.is_active ? 'text-green-400 hover:text-green-300' : 'text-gray-500 hover:text-gray-400'}
                      >
                        {mapping.is_active ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <XCircle className="w-5 h-5" />
                        )}
                      </Button>

                      <Button
                        onClick={() => handleDeleteMapping(mapping.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Información adicional */}
        <Card className="bg-[#121212] border-yellow-500/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Globe className="w-5 h-5 text-yellow-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-2">¿Cómo funciona?</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Cuando un usuario de un país asignado visita el dashboard, verá las ofertas del país configurado</li>
                  <li>• Si una asignación está desactivada (❌), el usuario verá las ofertas de su país real</li>
                  <li>• Si no hay asignación para un país, se muestran las ofertas de ese país automáticamente</li>
                  <li>• Los cambios se aplican inmediatamente sin necesidad de reiniciar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
