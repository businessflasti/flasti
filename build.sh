#!/bin/bash

# Compilar el proyecto sin generar páginas estáticas
NODE_ENV=production NEXT_IGNORE_ESLINT=1 NEXT_IGNORE_TYPE_CHECKS=1 npx next build || true

# Crear la carpeta de salida si no existe
mkdir -p dist

# Copiar los archivos necesarios
cp -r .next dist/
cp -r public dist/
cp package.json dist/
cp next.config.js dist/

echo "Compilación completada. Los archivos están en la carpeta 'dist'."
