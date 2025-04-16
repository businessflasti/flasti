#!/bin/bash

# Instalar dependencias
echo "Instalando dependencias..."
npm install

# Configurar Apache como proxy inverso
echo "Configurando Apache como proxy inverso..."

# Crear archivo de configuración para Apache
cat > nextjs.conf << 'EOF'
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/html

    # Configuración de proxy mejorada
    ProxyRequests Off
    ProxyPreserveHost On
    
    # Permitir el acceso al proxy
    <Proxy *>
        Require all granted
    </Proxy>
    
    # Configuración de proxy para Next.js
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    # Configuración para WebSockets (necesario para funcionalidades en tiempo real)
    RewriteEngine On
    RewriteCond %{HTTP:Upgrade} =websocket [NC]
    RewriteRule /(.*) ws://localhost:3000/$1 [P,L]

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
EOF

# Mover el archivo de configuración a la ubicación correcta
sudo mv nextjs.conf /etc/apache2/sites-available/

# Habilitar los módulos necesarios y la configuración
sudo a2enmod proxy proxy_http proxy_wstunnel rewrite
sudo a2ensite nextjs.conf
sudo a2dissite 000-default.conf
sudo systemctl restart apache2

# Crear servicio systemd para Next.js
echo "Creando servicio systemd para Next.js..."

# Crear archivo de servicio
cat > nextjs.service << 'EOF'
[Unit]
Description=Next.js Server
After=network.target

[Service]
ExecStart=/usr/bin/npm run dev
WorkingDirectory=/var/www/html
Restart=always
User=flasti_business
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Mover el archivo de servicio a la ubicación correcta
sudo mv nextjs.service /etc/systemd/system/

# Habilitar e iniciar el servicio
sudo systemctl daemon-reload
sudo systemctl enable nextjs.service
sudo systemctl start nextjs.service

echo "¡Implementación completada! El sitio está disponible en tu servidor Apache."
echo "Para verificar el estado del servicio Next.js, ejecuta: sudo systemctl status nextjs.service"
echo "Para ver los logs del servicio Next.js, ejecuta: sudo journalctl -u nextjs.service -f"
