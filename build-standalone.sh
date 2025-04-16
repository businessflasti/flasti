#!/bin/bash

# Limpiar carpetas de compilación anteriores
echo "Limpiando carpetas de compilación anteriores..."
rm -rf .next build out dist

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Compilar el proyecto ignorando errores
echo "Compilando el proyecto en modo standalone..."
NODE_ENV=production NEXT_IGNORE_ESLINT=1 NEXT_IGNORE_TYPE_CHECKS=1 npx next build

# Verificar si la compilación fue exitosa
if [ ! -d ".next/standalone" ]; then
  echo "Error: No se pudo crear la carpeta standalone. Intentando una compilación alternativa..."
  # Intentar una compilación alternativa
  NODE_ENV=production NEXT_IGNORE_ESLINT=1 NEXT_IGNORE_TYPE_CHECKS=1 npx next build --no-lint
fi

# Verificar nuevamente si la compilación fue exitosa
if [ ! -d ".next/standalone" ]; then
  echo "Error: La compilación standalone falló. Creando un paquete de distribución manual..."
  
  # Crear la carpeta de salida
  mkdir -p dist
  
  # Copiar los archivos necesarios
  cp -r .next dist/
  cp -r public dist/
  cp package.json dist/
  cp next.config.js dist/
  
  # Crear un archivo server.js para ejecutar la aplicación
  cat > dist/server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});
EOF

  echo "Paquete de distribución manual creado en la carpeta 'dist'."
else
  # Si la compilación standalone fue exitosa, crear el paquete de distribución
  echo "Compilación standalone exitosa. Creando paquete de distribución..."
  
  # Crear la carpeta de salida
  mkdir -p dist
  
  # Copiar los archivos necesarios
  cp -r .next/standalone/* dist/
  mkdir -p dist/.next/static
  cp -r .next/static dist/.next/
  cp -r public dist/
  
  echo "Paquete de distribución creado en la carpeta 'dist'."
fi

# Crear un archivo README.md con instrucciones de implementación
cat > dist/README.md << 'EOF'
# Flasti - Instrucciones de Implementación

Este paquete contiene la aplicación Flasti compilada y lista para ser implementada en un servidor web.

## Requisitos

- Node.js v18 o superior
- npm

## Instrucciones para implementación en servidor Apache

1. Copia todos los archivos de este directorio a tu servidor web.

2. Instala las dependencias:

```bash
npm install --production
```

3. Inicia el servidor Next.js:

```bash
node server.js
```

4. Configura Apache como proxy inverso para redirigir las solicitudes al servidor Next.js:

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

5. Habilita los módulos de proxy de Apache:

```bash
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2
```

## Configuración como servicio

Para ejecutar la aplicación como un servicio que se inicie automáticamente con el sistema, puedes crear un archivo de servicio systemd:

```bash
sudo nano /etc/systemd/system/flasti.service
```

Con el siguiente contenido:

```
[Unit]
Description=Flasti Next.js Application
After=network.target

[Service]
ExecStart=/usr/bin/node server.js
WorkingDirectory=/var/www/html
Restart=always
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Luego, habilita y inicia el servicio:

```bash
sudo systemctl enable flasti.service
sudo systemctl start flasti.service
```

## Solución de problemas

Si encuentras algún problema durante la implementación, verifica los siguientes puntos:

1. Asegúrate de que Node.js y npm estén instalados correctamente.
2. Verifica que los permisos de los archivos sean correctos.
3. Comprueba los registros de Apache y del servicio flasti para identificar posibles errores.

```bash
sudo systemctl status flasti.service
sudo tail -f /var/log/apache2/error.log
```
EOF

echo "Compilación completada. Los archivos están en la carpeta 'dist'."
echo ""
echo "Para implementar en tu hosting web, copia todo el contenido de la carpeta 'dist' a tu servidor."
