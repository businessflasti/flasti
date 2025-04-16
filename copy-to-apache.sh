#!/bin/bash

# Verificar si el directorio /var/www/html existe
if [ ! -d "/var/www/html" ]; then
  echo "Error: El directorio /var/www/html no existe."
  exit 1
fi

# Limpiar el directorio de destino
echo "Limpiando el directorio de destino..."
sudo rm -rf /var/www/html/*

# Copiar todos los archivos del proyecto al directorio de Apache
echo "Copiando archivos al directorio de Apache..."
sudo cp -r * /var/www/html/
sudo cp -r .next /var/www/html/ 2>/dev/null || echo "No se encontró la carpeta .next"
sudo cp -r .env* /var/www/html/ 2>/dev/null || echo "No se encontraron archivos .env"

# Establecer permisos correctos
echo "Estableciendo permisos..."
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

echo "¡Implementación completada! El sitio está disponible en tu servidor Apache."
echo ""
echo "IMPORTANTE: Para que el sitio funcione correctamente, debes configurar Apache para redirigir al servidor Next.js."
echo ""
echo "1. Habilita los módulos necesarios:"
echo "   sudo a2enmod proxy proxy_http"
echo "   sudo systemctl restart apache2"
echo ""
echo "2. Crea un archivo de configuración en /etc/apache2/sites-available/nextjs.conf:"
echo ""
echo "<VirtualHost *:80>"
echo "    ServerAdmin webmaster@localhost"
echo "    DocumentRoot /var/www/html"
echo ""
echo "    ProxyPreserveHost On"
echo "    ProxyPass / http://localhost:3000/"
echo "    ProxyPassReverse / http://localhost:3000/"
echo ""
echo "    ErrorLog \${APACHE_LOG_DIR}/error.log"
echo "    CustomLog \${APACHE_LOG_DIR}/access.log combined"
echo "</VirtualHost>"
echo ""
echo "3. Habilita la configuración y reinicia Apache:"
echo "   sudo a2ensite nextjs.conf"
echo "   sudo systemctl restart apache2"
echo ""
echo "4. Inicia el servidor Next.js:"
echo "   cd /var/www/html"
echo "   npm install"
echo "   npm run dev"
