"use client";

import React, { useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout disableChat={true} showStickyBanner={true}>
      <div style={{ minHeight: "100vh", background: "#FEF9F3" }}>
        <div className="container mx-auto py-20">
          <h1 className="text-4xl font-bold text-center">Página Principal - Modo Debug</h1>
          <p className="text-center mt-4">Si ves esto, el problema está en alguno de los componentes de secciones.</p>
        </div>
      </div>
    </MainLayout>
  );
}