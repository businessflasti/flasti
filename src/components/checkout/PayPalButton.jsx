"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

export default function PayPalButtonCheckout() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!window.paypal) return;
      clearInterval(interval);

      try {
        window.paypal
          .Buttons({
            style: {
              layout: "vertical",
              color: "white",
              shape: "pill",
              label: "pay",
              height: 50,
            },
            createOrder() {
              // Leer valores del localStorage solo para enviar al servidor
              // El servidor calcula el precio final de forma segura
              const useBalance = localStorage.getItem('useBalanceForPayment') === 'true';
              const balanceDiscount = parseFloat(localStorage.getItem('balanceDiscountAmount') || '0');
              
              return fetch("/api/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ useBalance, balanceDiscount }),
              })
                .then((res) => res.json())
                .then((data) => {
                  if (data.error) {
                    throw new Error(data.error);
                  }
                  return data.orderID;
                });
            },
            onApprove(data) {
              return fetch("/api/capture-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderID: data.orderID }),
              })
                .then((res) => res.json())
                .then((result) => {
                  if (result.error) {
                    throw new Error(result.error);
                  }
                  // Limpiar localStorage después del pago exitoso
                  localStorage.removeItem('useBalanceForPayment');
                  localStorage.removeItem('balanceDiscountAmount');
                  window.location.href = "/dashboard";
                });
            },
            onError(err) {
              console.error("PayPal error:", err);
              setError("Error al procesar el pago. Por favor, intenta de nuevo.");
            },
          })
          .render("#paypal-button-container")
          .then(() => {
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Error al renderizar botón:", err);
            setError("Error al cargar el botón de pago");
            setIsLoading(false);
          });
      } catch (err) {
        console.error("Error al inicializar PayPal:", err);
        setError("Error al inicializar PayPal");
        setIsLoading(false);
      }
    }, 400);

    return () => {
      clearInterval(interval);
      // Limpiar el contenedor de PayPal al desmontar
      const container = document.getElementById("paypal-button-container");
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);

  return (
    <div style={{ width: "100%", position: "relative", minHeight: "100px" }}>
      <Script
        src="https://www.paypal.com/sdk/js?client-id=Aa2g70kJsc_YkhVb6tRb-rI-Ot46EY1Jlt6fmVQeKmkUcZESdOpCHmjUEq7kg9vExa1hialDQadTH-oQ&currency=USD&disable-funding=paylater,venmo"
        strategy="afterInteractive"
        onError={() => {
          setError("Error al cargar PayPal");
          setIsLoading(false);
        }}
      />
      {error && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#ff4444" }}>
          {error}
        </div>
      )}
      {isLoading && !error && (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          padding: "2rem" 
        }}>
          <div style={{
            width: "40px",
            height: "40px",
            border: "3px solid rgba(255, 255, 255, 0.1)",
            borderTop: "3px solid #ffffff",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite"
          }}></div>
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <div id="paypal-button-container" style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: "500px", margin: "0 auto" }}></div>
      
      {/* Imagen de métodos de pago - Superpuesta al iframe */}
      <div style={{ 
        position: "absolute",
        bottom: "18px",
        left: 0,
        right: 0,
        display: "flex", 
        justifyContent: "center",
        background: "#252525",
        padding: "0.5rem 0",
        zIndex: 9999
      }}>
        <img 
          src="/images/pagospay.svg" 
          alt="Métodos de pago" 
          style={{ 
            height: "24px",
            width: "auto"
          }}
        />
      </div>
      
      {/* Mensaje de seguridad - Debajo de la imagen */}
      <div className="flex items-center justify-center text-xs mt-4" style={{ color: '#9CA3AF' }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
        Pago 100% seguro, protegemos tus datos.
      </div>
    </div>
  );
}
