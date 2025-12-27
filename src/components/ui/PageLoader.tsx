"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [visible, setVisible] = useState(true);
  const [showRetry, setShowRetry] = useState(false);
  const pathname = usePathname();
  
  // Detectar si estamos en la página upgrade para usar tema oscuro
  const isDarkPage = pathname?.includes('/upgrade') || pathname?.includes('/checkout');

  useEffect(() => {
    // Timer de 7 segundos para forzar el desvanecimiento
    const forceHideTimer = setTimeout(() => {
      setVisible(false);
    }, 7000);

    // Timer de 5 segundos para mostrar opción de recargar
    const retryTimer = setTimeout(() => {
      if (visible) {
        setShowRetry(true);
      }
    }, 5000);

    // Desvanecimiento inmediato cuando la página cargue completamente
    if (document.readyState === "complete") {
      setVisible(false);
      clearTimeout(forceHideTimer);
      clearTimeout(retryTimer);
    } else {
      const onLoad = () => {
        setVisible(false);
        clearTimeout(forceHideTimer);
        clearTimeout(retryTimer);
      };
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(forceHideTimer);
        clearTimeout(retryTimer);
      };
    }
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

export default PageLoader;
