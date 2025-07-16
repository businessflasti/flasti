"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PageLoader.module.css";

interface PageLoaderProps {
  enabled?: boolean;
}

const PageLoader = ({ enabled = false }: PageLoaderProps) => {
  const [visible, setVisible] = useState(enabled);

  useEffect(() => {
    // Timer de 7 segundos máximo
    const maxTimer = setTimeout(() => setVisible(false), 7000);

    // También ocultar cuando la página cargue si es antes de los 7 segundos
    if (document.readyState === "complete") {
      setVisible(false);
    } else {
      const onLoad = () => setVisible(false);
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(maxTimer);
      };
    }
  }, []);

  return (
    <div
      className={styles.loaderWrapper + (visible ? "" : " " + styles.hide)}
      aria-hidden={!visible}
    >
      <div className={styles.loader}>
        <div className={styles.box}>
          <div className={styles.logo}>
            <Image
              src="/logo/isotipo.svg"
              alt="Logo"
              width={80}
              height={80}
              priority
              className={styles.logoImg}
            />
          </div>
        </div>
        <div className={styles.box} />
        <div className={styles.box} />
        <div className={styles.box} />
        <div className={styles.box} />
      </div>
    </div>
  );
};

export default PageLoader;
