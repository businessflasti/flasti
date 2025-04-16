# Instrucciones de implementación

Este paquete contiene todo lo necesario para implementar la aplicación Next.js en un servidor Apache.

## Requisitos previos

- Node.js 18 o superior
- npm
- Apache 2.4 o superior
- Permisos de sudo

## Pasos para la implementación

1. **Copiar los archivos al servidor**

   Copia todos los archivos de este paquete al directorio `/var/www/html` en tu servidor:

   ```bash
   sudo rm -rf /var/www/html/*
   sudo cp -r * /var/www/html/
   sudo cp -r .env* /var/www/html/
   ```

2. **Ejecutar el script de configuración**

   ```bash
   cd /var/www/html
   sudo chmod +x setup.sh
   ./setup.sh
   ```

   Este script realizará las siguientes acciones:
   - Instalará las dependencias de Node.js
   - Configurará Apache como proxy inverso
   - Creará un servicio systemd para mantener el servidor Next.js en ejecución

3. **Verificar la implementación**

   Abre tu navegador y visita tu sitio web (usando la dirección IP del servidor o el nombre de dominio).

## Solución de problemas

- **Verificar el estado del servicio Next.js**:
  ```bash
  sudo systemctl status nextjs.service
  ```

- **Ver los logs del servicio Next.js**:
  ```bash
  sudo journalctl -u nextjs.service -f
  ```

- **Reiniciar el servicio Next.js**:
  ```bash
  sudo systemctl restart nextjs.service
  ```

- **Verificar los logs de Apache**:
  ```bash
  sudo tail -f /var/log/apache2/error.log
  ```
