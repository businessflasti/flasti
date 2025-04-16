'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertCircle, Database, RefreshCw } from "lucide-react";
import { toast } from 'sonner';

interface ChatTablesErrorProps {
  onRetry: () => void;
}

export function ChatTablesError({ onRetry }: ChatTablesErrorProps) {
  const [loading, setLoading] = useState(false);

  const handleRetry = async () => {
    setLoading(true);
    try {
      // Primero verificar si las tablas existen
      const checkResponse = await fetch('/api/check-chat-tables');
      const checkData = await checkResponse.json();

      if (checkData.exists) {
        // Las tablas ya existen, solo recargar
        await onRetry();
        toast.success('Tablas verificadas correctamente');
        setLoading(false);
        return;
      }

      // Intentar crear las tablas
      const createResponse = await fetch('/api/create-chat-tables');
      const createData = await createResponse.json();

      if (createData.success) {
        toast.success('Tablas creadas correctamente');
        // Esperar un momento antes de verificar
        setTimeout(async () => {
          try {
            await onRetry();
            toast.success('Tablas verificadas correctamente');
          } catch (error) {
            console.error('Error al verificar tablas:', error);
            toast.error('Error al verificar tablas');
          } finally {
            setLoading(false);
          }
        }, 2000);
      } else {
        console.error('Error al crear tablas:', createData.error);
        toast.error('Error al crear tablas: ' + createData.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error al crear tablas:', error);
      toast.error('Error al crear tablas');
      setLoading(false);
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Database className="text-destructive" size={24} />
        </div>

        <h2 className="text-xl font-semibold mb-2">Error en la base de datos</h2>

        <p className="text-muted-foreground mb-4">
          No se pudieron cargar las conversaciones porque las tablas necesarias no existen en la base de datos.
        </p>

        <div className="bg-muted p-4 rounded-md text-sm mb-6 text-left w-full">
          <p className="font-medium mb-2 flex items-center">
            <AlertCircle size={16} className="mr-2 text-destructive" />
            Solución:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Haz clic en el botón "Crear tablas" para crear las tablas necesarias</li>
            <li>Si el problema persiste, contacta al administrador del sistema</li>
          </ol>
        </div>

        <Button
          onClick={handleRetry}
          className="w-full"
          disabled={loading}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <RefreshCw size={16} className="mr-2" />
              Crear tablas
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
