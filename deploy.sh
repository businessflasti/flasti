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
sudo cp -r dist/.next /var/www/html/
sudo cp -r dist/public /var/www/html/
sudo cp dist/package.json /var/www/html/
sudo cp dist/next.config.js /var/www/html/

# Crear un archivo server.js para iniciar el servidor
echo "Creando archivo server.js..."
cat > /var/www/html/server.js << 'EOF'
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
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

# Instalar dependencias
echo "Instalando dependencias..."
cd /var/www/html
sudo npm install --production

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

sudo mv /tmp/nextjs.conf /etc/apache2/sites-available/nextjs.conf
sudo a2ensite nextjs.conf
sudo a2enmod proxy proxy_http
sudo systemctl restart apache2

# Iniciar el servidor Next.js como un servicio
echo "Configurando el servicio Next.js..."
cat > /tmp/nextjs.service << 'EOF'
[Unit]
Description=Next.js Server
After=network.target

[Service]
ExecStart=/usr/bin/npm start
WorkingDirectory=/var/www/html
Restart=always
User=www-data
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

sudo mv /tmp/nextjs.service /etc/systemd/system/nextjs.service
sudo systemctl daemon-reload
sudo systemctl enable nextjs.service
sudo systemctl start nextjs.service

echo "Implementación completada. El sitio está disponible en http://localhost."
