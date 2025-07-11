'use client';

import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumbs } from '@/components/ui/breadcrumbs';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function SupportPage() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-2 md:px-0 py-8">
      <Breadcrumbs />
      <h1 className="text-2xl font-bold mb-6 text-white">Soporte y Ayuda</h1>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {loading ? (
          <Skeleton className="h-40 w-full mb-6" />
        ) : (
          <Card className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Preguntas frecuentes</h2>
              <ul className="list-disc pl-6 text-[#b0b0b0] mb-4">
                <li>¿Cómo gano recompensas?</li>
                <li>¿Cuándo puedo retirar mi saldo?</li>
                <li>¿Qué hago si una oferta no se acredita?</li>
                <li>¿Cómo contacto al soporte?</li>
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Contacto</h2>
              <p className="text-[#b0b0b0]">Si tienes dudas o problemas, escríbenos a <a href="mailto:soporte@flasti.com" className="text-blue-400 underline">soporte@flasti.com</a></p>
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
