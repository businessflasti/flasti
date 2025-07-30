"use client";

import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: Date;
  }
}

// ID de tu cuenta de Tawk.to
const TAWK_TO_ID = '6281726e7b967b11798f79e1/1g34qe1tb'; // ID correcto de Tawk.to para Flasti

export const useTawkTo = (showBubble = true) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Agregar estilos personalizados
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = '/styles/tawk.css';
    document.head.appendChild(style);

    if (document.getElementById('tawkto-script')) {
      return;
    }

    // Configuración inicial de Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Crear y configurar el script
    const script = document.createElement('script');
    script.id = 'tawkto-script';
    script.async = true;
    script.src = `https://embed.tawk.to/${TAWK_TO_ID}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

export default useTawkTo;
