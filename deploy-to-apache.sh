#!/bin/bash

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
sudo cp -r * /var/www/html/
sudo cp -r .next /var/www/html/
sudo cp -r node_modules /var/www/html/

# Crear un archivo server.js para iniciar el servidor
echo "Creando archivo server.js..."
cat > /var/www/html/server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const app = next({ dev });
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

# Crear un archivo de servicio systemd
echo "Creando archivo de servicio systemd..."
cat > /tmp/nextjs.service << 'EOF'
[Unit]
Description=Next.js Server
After=network.target

[Service]
ExecStart=/usr/bin/node /var/www/html/server.js
WorkingDirectory=/var/www/html
Restart=always
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Mover el archivo de servicio a la ubicación correcta
sudo mv /tmp/nextjs.service /etc/systemd/system/nextjs.service

# Configurar Apache para redirigir al servidor Next.js
echo "Configurando Apache..."
cat > /tmp/nextjs.conf << 'EOF'
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Mover el archivo de configuración de Apache a la ubicación correcta
sudo mv /tmp/nextjs.conf /etc/apache2/sites-available/nextjs.conf

# Habilitar el sitio y los módulos necesarios
sudo a2ensite nextjs.conf
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2

# Establecer permisos correctos
echo "Estableciendo permisos..."
sudo chown -R www-data:www-data /var/www/html/
sudo chmod -R 755 /var/www/html/

# Iniciar el servicio Next.js
echo "Iniciando el servicio Next.js..."
sudo systemctl daemon-reload
sudo systemctl enable nextjs.service
sudo systemctl start nextjs.service

echo "¡Implementación completada! El sitio está disponible en tu servidor Apache."
