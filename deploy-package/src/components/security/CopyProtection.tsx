"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function CopyProtection() {
  const pathname = usePathname();

  // Determinar si estamos en la página principal o en páginas públicas
  const isPublicPage = !pathname.includes('/dashboard') &&
                      !pathname.includes('/admin') &&
                      !pathname.includes('/auth');

  useEffect(() => {
    if (!isPublicPage) return;

    // Función para deshabilitar el clic derecho
    const disableRightClick = (e: MouseEvent) => {
      // Solo bloquear si es clic derecho (button 2)
      if (e.button === 2) {
        e.preventDefault();
        // Eliminada la alerta para una mejor experiencia de usuario
      }
    };

    // Función para deshabilitar la selección de texto
    const disableSelection = () => {
      return false;
    };

    // Función para deshabilitar las teclas de copia
    const disableCopyKeys = (e: KeyboardEvent) => {
      // Ctrl+C, Ctrl+X, Ctrl+V, Ctrl+A
      if (
        (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a')) ||
        (e.metaKey && (e.key === 'c' || e.key === 'x' || e.key === 'v' || e.key === 'a'))
      ) {
        e.preventDefault();
        // Eliminada la alerta para una mejor experiencia de usuario
      }
    };

    // Función para deshabilitar el menú contextual
    const disableContextMenu = (e: Event) => {
      e.preventDefault();
    };

    // Función para deshabilitar el arrastrar y soltar
    const disableDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // Función para deshabilitar la copia
    const disableCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      // Eliminada la alerta para una mejor experiencia de usuario
    };

    // Agregar event listeners
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableCopyKeys as EventListener);
    document.addEventListener('dragstart', disableDragStart as EventListener);
    document.addEventListener('copy', disableCopy as EventListener);
    document.addEventListener('cut', disableCopy as EventListener);
    document.addEventListener('mouseup', disableRightClick);

    // Deshabilitar la selección de texto con CSS
    const style = document.createElement('style');
    style.id = 'copy-protection-style';
    style.innerHTML = `
      body {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }

      img {
        -webkit-user-drag: none;
        -khtml-user-drag: none;
        -moz-user-drag: none;
        -o-user-drag: none;
        user-drag: none;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);

    // Limpiar event listeners al desmontar
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableCopyKeys as EventListener);
      document.removeEventListener('dragstart', disableDragStart as EventListener);
      document.removeEventListener('copy', disableCopy as EventListener);
      document.removeEventListener('cut', disableCopy as EventListener);
      document.removeEventListener('mouseup', disableRightClick);

      // Eliminar el estilo
      const styleElement = document.getElementById('copy-protection-style');
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, [isPublicPage, pathname]);

  return null; // Este componente no renderiza nada visible
}
