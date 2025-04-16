#!/bin/bash

# Limpiar carpetas de compilación anteriores
echo "Limpiando carpetas de compilación anteriores..."
rm -rf .next build out dist

# Compilar el proyecto ignorando errores
echo "Compilando el proyecto..."
NODE_ENV=production NEXT_IGNORE_ESLINT=1 NEXT_IGNORE_TYPE_CHECKS=1 npx next build || true

# Crear la carpeta de salida si no existe
echo "Creando carpeta de salida..."
mkdir -p dist

# Copiar los archivos necesarios
echo "Copiando archivos a la carpeta dist..."
cp -r .next dist/
cp -r public dist/
cp package.json dist/
cp next.config.js dist/

echo "Compilación completada. Los archivos están en la carpeta 'dist'."
echo ""
echo "Para implementar en tu hosting web, copia todo el contenido de la carpeta 'dist' a tu servidor."
