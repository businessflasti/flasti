'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link2, DollarSign, Users, ArrowRight, CheckCircle } from 'lucide-react';

export default function AffiliateHowItWorks() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cómo funciona el programa de afiliados</CardTitle>
        <CardDescription>
          Gana dinero promocionando nuestras apps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Link2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-medium">1. Comparte tu enlace</h3>
                <p className="text-sm text-muted-foreground">
                  Comparte tu enlace de afiliado en redes sociales, blogs, email o donde prefieras.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-medium">2. Tus referidos compran</h3>
                <p className="text-sm text-muted-foreground">
                  Cuando alguien compra a través de tu enlace, se registra automáticamente como tu referido.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-medium">3. Ganas comisiones</h3>
                <p className="text-sm text-muted-foreground">
                  Recibes una comisión por cada venta que generes. Las comisiones se acreditan automáticamente.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <ArrowRight className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 font-medium">4. Cobra tus ganancias</h3>
                <p className="text-sm text-muted-foreground">
                  Solicita el pago de tus comisiones cuando alcances el mínimo requerido.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8 rounded-lg bg-primary/5 p-6 border border-primary/10">
          <h3 className="text-lg font-medium mb-4">Ventajas de nuestro programa de afiliados</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Comisiones competitivas</h4>
                <p className="text-sm text-muted-foreground">
                  Gana hasta un 30% por cada venta que generes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Sin límite de ganancias</h4>
                <p className="text-sm text-muted-foreground">
                  Cuantas más ventas generes, más ganas. No hay tope máximo.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Seguimiento en tiempo real</h4>
                <p className="text-sm text-muted-foreground">
                  Monitorea tus clics, ventas y comisiones en tiempo real.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Múltiples métodos de pago</h4>
                <p className="text-sm text-muted-foreground">
                  Recibe tus pagos vía PayPal, transferencia bancaria o criptomonedas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
