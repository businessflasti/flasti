"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./PageLoader.module.css";

const PageLoader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Desaparecer inmediatamente cuando la página esté lista
    if (document.readyState === "complete") {
      setVisible(false);
    } else {
      const onLoad = () => setVisible(false);
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
