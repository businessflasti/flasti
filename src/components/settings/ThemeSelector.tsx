'use client';

import React from 'react';
import { useThemes } from '@/contexts/ThemesContext';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Check, Moon, Sun } from 'lucide-react';

export default function ThemeSelector() {
  const { themes, currentTheme, loading, setUserTheme } = useThemes();

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Separar temas del sistema y personalizados
  const systemThemes = themes.filter(theme => theme.is_system);
  const customThemes = themes.filter(theme => !theme.is_system);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Temas del Sistema</h2>
        <p className="text-foreground/70">
          Selecciona entre los temas oficiales de Flasti
        </p>
      </div>

      <RadioGroup 
        value={currentTheme?.id.toString()} 
        onValueChange={(value) => setUserTheme(parseInt(value))}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
      >
        {systemThemes.map((theme) => (
          <div key={theme.id} className="relative">
            <RadioGroupItem 
              value={theme.id.toString()} 
              id={`theme-${theme.id}`} 
              className="sr-only"
            />
            <Label 
              htmlFor={`theme-${theme.id}`}
              className="cursor-pointer"
            >
              <Card 
                className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                  currentTheme?.id === theme.id ? 'ring-2 ring-accent-color' : ''
                }`}
              >
                <div 
                  className="h-24 w-full" 
                  style={{ 
                    background: `linear-gradient(to right, ${theme.primary_color}, ${theme.secondary_color})`,
                    borderBottom: `3px solid ${theme.accent_color}`
                  }}
                >
                  <div className="flex justify-between items-start p-2">
                    <Badge 
                      variant="outline" 
                      className="bg-background/80 backdrop-blur-sm"
                    >
                      {theme.is_dark ? (
                        <Moon className="h-3 w-3 mr-1" />
                      ) : (
                        <Sun className="h-3 w-3 mr-1" />
                      )}
                      {theme.is_dark ? 'Oscuro' : 'Claro'}
                    </Badge>
                    
                    {currentTheme?.id === theme.id && (
                      <Badge className="bg-accent-color">
                        <Check className="h-3 w-3 mr-1" />
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="font-medium">{theme.name}</div>
                </CardContent>
              </Card>
            </Label>
          </div>
        ))}
      </RadioGroup>

      {customThemes.length > 0 && (
        <>
          <div className="mt-8">
            <h2 className="text-2xl font-bold">Temas Personalizados</h2>
            <p className="text-foreground/70">
              Otros temas disponibles para personalizar tu experiencia
            </p>
          </div>

          <RadioGroup 
            value={currentTheme?.id.toString()} 
            onValueChange={(value) => setUserTheme(parseInt(value))}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
          >
            {customThemes.map((theme) => (
              <div key={theme.id} className="relative">
                <RadioGroupItem 
                  value={theme.id.toString()} 
                  id={`theme-${theme.id}`} 
                  className="sr-only"
                />
                <Label 
                  htmlFor={`theme-${theme.id}`}
                  className="cursor-pointer"
                >
                  <Card 
                    className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
                      currentTheme?.id === theme.id ? 'ring-2 ring-accent-color' : ''
                    }`}
                  >
                    <div 
                      className="h-24 w-full" 
                      style={{ 
                        background: `linear-gradient(to right, ${theme.primary_color}, ${theme.secondary_color})`,
                        borderBottom: `3px solid ${theme.accent_color}`
                      }}
                    >
                      <div className="flex justify-between items-start p-2">
                        <Badge 
                          variant="outline" 
                          className="bg-background/80 backdrop-blur-sm"
                        >
                          {theme.is_dark ? (
                            <Moon className="h-3 w-3 mr-1" />
                          ) : (
                            <Sun className="h-3 w-3 mr-1" />
                          )}
                          {theme.is_dark ? 'Oscuro' : 'Claro'}
                        </Badge>
                        
                        {currentTheme?.id === theme.id && (
                          <Badge className="bg-accent-color">
                            <Check className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <div className="font-medium">{theme.name}</div>
                    </CardContent>
                  </Card>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </>
      )}
    </div>
  );
}
