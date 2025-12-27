"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./PageLoader.module.css";

/**
 * AppLoader - Loader inteligente que espera a que los datos estén listos
 * Solo se oculta cuando:
 * 1. La página ha cargado completamente (document.readyState === 'complete')
 * 2. Los datos de autenticación están listos (dataReady === true)
 * 3. Se da un tiempo adicional para que los componentes carguen sus datos
 * 
 * Esto evita que el usuario vea datos en 0 o vacíos mientras carga Supabase
 */
const AppLoader = () => {
  const [visible, setVisible] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const hideAttempted = useRef(false);
  const pathname = usePathname();
  
  // Obtener el estado de datos listos del AuthContext
  let dataReady = false;
  try {
    const auth = useAuth();
    dataReady = auth?.dataReady ?? false;
  } catch {
    // Si no hay AuthProvider, consideramos que no necesitamos esperar datos
    dataReady = true;
  }
  
  // Detectar si estamos en páginas que no requieren autenticación
  const isPublicPage = pathname === '/' || 
                       pathname === '/login' || 
                       pathname === '/register' || 
                       pathname === '/reset-password' ||
                       pathname?.startsWith('/legal');
  
  // Detectar si estamos en el dashboard (necesita más tiempo para cargar stats)
  const isDashboardPage = pathname === '/dashboard' || pathname === '/dashboard/';
  
  // Detectar si estamos en la página upgrade/checkout para usar tema oscuro
  const isDarkPage = pathname?.includes('/upgrade') || pathname?.includes('/checkout');

  // Detectar cuando la página ha cargado
  useEffect(() => {
    if (document.readyState === "complete") {
      setPageLoaded(true);
    } else {
      const onLoad = () => setPageLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Lógica para ocultar el loader
  useEffect(() => {
    if (hideAttempted.current) return;
    
    // Para páginas públicas, solo esperar a que la página cargue
    if (isPublicPage && pageLoaded) {
      hideAttempted.current = true;
      setVisible(false);
      return;
    }
    
    // Para páginas protegidas, esperar a que la página cargue Y los datos estén listos
    if (pageLoaded && dataReady) {
      hideAttempted.current = true;
      
      // Para el dashboard, dar tiempo extra para que carguen las estadísticas
      const extraDelay = isDashboardPage ? 800 : 300;
      
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, extraDelay);
      
      return () => clearTimeout(hideTimer);
    }
  }, [pageLoaded, dataReady, isPublicPage, isDashboardPage]);

  // Timer para mostrar botón de retry después de 6 segundos
  useEffect(() => {
    const retryTimer = setTimeout(() => {
      if (visible) {
        setShowRetry(true);
      }
    }, 6000);

    return () => clearTimeout(retryTimer);
  }, [visible]);

  // Timer de seguridad: forzar ocultar después de 15 segundos
  useEffect(() => {
    const forceHideTimer = setTimeout(() => {
      if (visible) {
        console.warn('AppLoader: Forzando ocultamiento después de 15 segundos');
        setVisible(false);
      }
    }, 15000);

    return () => clearTimeout(forceHideTimer);
  }, [visible]);

  const handleReload = () => {
    window.location.reload();
  };

  const wrapperClass = `${styles.loaderWrapper} ${isDarkPage ? styles.dark : ''} ${visible ? '' : styles.hide}`;

  return (
    <div
      className={wrapperClass}
      aria-hidden={!visible}
    >
      <div className={styles.loaderContent}>
        <div className={`${styles.spinner} ${isDarkPage ? styles.spinnerDark : ''}`}></div>
        
        {showRetry && (
          <div className={`${styles.retryContainer} ${isDarkPage ? styles.retryDark : ''}`}>
            <p className={styles.retryText}>
              La carga está tardando más de lo esperado
            </p>
            <button 
              onClick={handleReload}
              className={`${styles.retryButton} ${isDarkPage ? styles.retryButtonDark : ''}`}
            >
              Recargar página
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppLoader;
