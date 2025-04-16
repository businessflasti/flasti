"use client";

import { useEffect, useRef } from "react";

const DashboardPreview = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Establecer dimensiones
    canvas.width = 1200;
    canvas.height = 675;

    // Fondo oscuro
    ctx.fillStyle = "#111827";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Barra lateral
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(0, 0, 220, canvas.height);

    // Barra superior
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(220, 0, canvas.width - 220, 60);

    // Logo en la barra lateral
    ctx.fillStyle = "#8b5cf6";
    ctx.fillRect(20, 20, 40, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Flasti", 70, 45);

    // Elementos de menú en la barra lateral
    const menuItems = ["Inicio", "Estadísticas", "Retiros", "Referidos", "Configuración"];
    menuItems.forEach((item, index) => {
      const y = 100 + index * 50;

      // Elemento activo (el primero)
      if (index === 0) {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, y - 10, 220, 40);
        ctx.fillStyle = "#8b5cf6";
        ctx.fillRect(0, y - 10, 4, 40);
      }

      ctx.fillStyle = index === 0 ? "#ffffff" : "#9ca3af";
      ctx.font = index === 0 ? "bold 16px Arial" : "16px Arial";
      ctx.fillText(item, 20, y + 10);
    });

    // Título de la página
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Panel de Control", 250, 40);

    // Tarjetas de estadísticas
    const cards = [
      { title: "Balance Total", value: "$125.50", color: "#8b5cf6" },
      { title: "Ganancias Hoy", value: "$12.75", color: "#10b981" },
      { title: "Referidos", value: "8", color: "#3b82f6" },
      { title: "Tareas Completadas", value: "42", color: "#f59e0b" }
    ];

    cards.forEach((card, index) => {
      const x = 250 + (index % 2) * 320;
      const y = 80 + Math.floor(index / 2) * 120;

      // Fondo de la tarjeta
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(x, y, 300, 100);

      // Borde superior de color
      ctx.fillStyle = card.color;
      ctx.fillRect(x, y, 300, 4);

      // Título de la tarjeta
      ctx.fillStyle = "#9ca3af";
      ctx.font = "16px Arial";
      ctx.fillText(card.title, x + 20, y + 30);

      // Valor de la tarjeta
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 28px Arial";
      ctx.fillText(card.value, x + 20, y + 70);
    });

    // Gráfico de actividad
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(250, 320, 620, 300);

    // Título del gráfico
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Actividad Reciente", 270, 350);

    // Ejes del gráfico
    ctx.strokeStyle = "#4b5563";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(270, 550);
    ctx.lineTo(850, 550);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(270, 380);
    ctx.lineTo(270, 550);
    ctx.stroke();

    // Datos del gráfico
    const data = [15, 25, 18, 30, 22, 35, 28, 40, 32, 45, 38, 50];
    const barWidth = 40;
    const barSpacing = 10;
    const maxValue = Math.max(...data);

    data.forEach((value, index) => {
      const x = 290 + index * (barWidth + barSpacing);
      const barHeight = (value / maxValue) * 150;
      const y = 550 - barHeight;

      // Gradiente para las barras
      const gradient = ctx.createLinearGradient(x, y, x, 550);
      gradient.addColorStop(0, "#8b5cf6");
      gradient.addColorStop(1, "#6d28d9");

      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);

      // Etiquetas del eje X
      ctx.fillStyle = "#9ca3af";
      ctx.font = "12px Arial";
      ctx.fillText(`Día ${index + 1}`, x, 570);
    });

    // Panel lateral derecho
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(890, 80, 280, 540);

    // Título del panel
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial";
    ctx.fillText("Últimos Pagos", 910, 110);

    // Lista de pagos
    const payments = [
      { date: "Hoy, 14:30", amount: "+$25.00", status: "Completado" },
      { date: "Ayer, 10:15", amount: "+$18.50", status: "Completado" },
      { date: "12/04, 16:45", amount: "+$32.00", status: "Completado" },
      { date: "10/04, 09:20", amount: "+$15.75", status: "Completado" },
      { date: "05/04, 11:30", amount: "+$40.00", status: "Completado" }
    ];

    payments.forEach((payment, index) => {
      const y = 140 + index * 70;

      // Separador
      if (index > 0) {
        ctx.strokeStyle = "#374151";
        ctx.beginPath();
        ctx.moveTo(910, y - 15);
        ctx.lineTo(1150, y - 15);
        ctx.stroke();
      }

      // Fecha
      ctx.fillStyle = "#9ca3af";
      ctx.font = "14px Arial";
      ctx.fillText(payment.date, 910, y);

      // Monto
      ctx.fillStyle = "#10b981";
      ctx.font = "bold 16px Arial";
      ctx.fillText(payment.amount, 910, y + 25);

      // Estado
      ctx.fillStyle = "#10b981";
      ctx.font = "12px Arial";
      ctx.fillText(payment.status, 1050, y + 25);

      // Indicador de estado
      ctx.fillStyle = "#10b981";
      ctx.beginPath();
      ctx.arc(1040, y + 21, 4, 0, Math.PI * 2);
      ctx.fill();
    });

    // Exportar como imagen
    const dataURL = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "dashboard-preview.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return <canvas ref={canvasRef} style={{ display: "none" }} />;
};

export default DashboardPreview;
