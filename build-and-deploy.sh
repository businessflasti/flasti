#!/bin/bash

# Compilar el proyecto
echo "Compilando el proyecto..."
npm run build

# Verificar si la compilación fue exitosa
if [ $? -ne 0 ]; then
  echo "Error: La compilación falló."
  exit 1
fi

# Verificar si el directorio /var/www/html existe
if [ ! -d "/var/www/html" ]; then
  echo "Error: El directorio /var/www/html no existe."
  exit 1
fi

# Limpiar el directorio de destino
echo "Limpiando el directorio de destino..."
sudo rm -rf /var/www/html/*

# Copiar los archivos al directorio de Apache
echo "Copiando archivos al directorio de Apache..."
sudo cp -r .next/standalone/* /var/www/html/
sudo cp -r .next/static /var/www/html/.next/
sudo cp -r public /var/www/html/

# Establecer permisos correctos
echo "Estableciendo permisos..."
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

echo "¡Implementación completada! El sitio está disponible en tu servidor Apache."
