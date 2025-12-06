"use client";
import React, { useEffect, useState } from "react";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Timer de 7 segundos para forzar el desvanecimiento
    const forceHideTimer = setTimeout(() => {
      setVisible(false);
    }, 7000);

    // Desvanecimiento inmediato cuando la página cargue completamente
    if (document.readyState === "complete") {
      setVisible(false);
      clearTimeout(forceHideTimer);
    } else {
      const onLoad = () => {
        setVisible(false);
        clearTimeout(forceHideTimer);
      };
      window.addEventListener("load", onLoad);
      return () => {
        window.removeEventListener("load", onLoad);
        clearTimeout(forceHideTimer);
      };
    }
  }, []);

  return (
    <div
      className={styles.loaderWrapper + (visible ? "" : " " + styles.hide)}
      aria-hidden={!visible}
    >
      <div className={styles.spinner}></div>
    </div>
  );
};

export default PageLoader;
