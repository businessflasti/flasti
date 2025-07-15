"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Temporizador de 10 segundos para ocultar el loader
    const timeout = setTimeout(() => {
      setVisible(false);
    }, 10000);

    // También ocultar cuando la página esté lista (lo que ocurra primero)
    if (document.readyState === "complete") {
      setVisible(false);
    } else {
      const onLoad = () => setVisible(false);
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(timeout);
      };
    }

    // Limpiar el temporizador si el componente se desmonta
    return () => clearTimeout(timeout);
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
