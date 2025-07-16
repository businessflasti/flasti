"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Espera a que la página esté completamente cargada
    if (document.readyState === "complete") {
      setTimeout(() => setVisible(false), 400); // pequeña pausa para suavidad
    } else {
      const onLoad = () => setTimeout(() => setVisible(false), 400);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
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
