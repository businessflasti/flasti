# Configuración DNS para evitar que los correos vayan a SPAM

## 🎯 Problema
Los correos enviados desde la aplicación van a spam porque falta autenticación de dominio.

## ✅ Solución: Configurar SPF, DKIM y DMARC

### 1. SPF (Sender Policy Framework)

Agrega este registro TXT en tu DNS de **flasti.com**:

```
Tipo: TXT
Nombre: @
Valor: v=spf1 include:_spf.google.com ~all
TTL: 3600
```

**Explicación:**
- `v=spf1` = Versión de SPF
- `include:_spf.google.com` = Autoriza servidores de Gmail
- `~all` = Soft fail (marca como sospechoso pero no rechaza)

### 2. DKIM (DomainKeys Identified Mail)

**Paso 1:** Generar claves DKIM en Gmail

1. Ve a Google Admin Console: https://admin.google.com
2. Apps → Google Workspace → Gmail → Authenticate email
3. Click en "Generate new record"
4. Copia el registro TXT que te da

**Paso 2:** Agregar registro DNS

```
Tipo: TXT
Nombre: google._domainkey
Valor: [El valor que te dio Google]
TTL: 3600
```

### 3. DMARC (Domain-based Message Authentication)

Agrega este registro TXT en tu DNS:

```
Tipo: TXT
Nombre: _dmarc
Valor: v=DMARC1; p=none; rua=mailto:flasti.business@gmail.com; ruf=mailto:flasti.business@gmail.com; fo=1
TTL: 3600
```

**Explicación:**
- `p=none` = Modo monitor (no rechaza correos)
- `rua` = Email para reportes agregados
- `ruf` = Email para reportes forenses
- `fo=1` = Reportar si falla SPF o DKIM

### 4. Registro MX (si no lo tienes)

```
Tipo: MX
Nombre: @
Valor: ASPMX.L.GOOGLE.COM
Prioridad: 1
TTL: 3600
```

Registros adicionales:
```
Tipo: MX, Prioridad: 5, Valor: ALT1.ASPMX.L.GOOGLE.COM
Tipo: MX, Prioridad: 5, Valor: ALT2.ASPMX.L.GOOGLE.COM
Tipo: MX, Prioridad: 10, Valor: ALT3.ASPMX.L.GOOGLE.COM
Tipo: MX, Prioridad: 10, Valor: ALT4.ASPMX.L.GOOGLE.COM
```

## 📋 Dónde configurar DNS

Depende de dónde tengas tu dominio:

### Si usas Netlify DNS:
1. Ve a Netlify Dashboard
2. Site settings → Domain management → DNS records
3. Add new record

### Si usas Cloudflare:
1. Ve a Cloudflare Dashboard
2. Selecciona tu dominio flasti.com
3. DNS → Add record

### Si usas GoDaddy/Namecheap:
1. Ve al panel de tu registrador
2. DNS Management
3. Add TXT/MX records

## 🧪 Verificar configuración

Después de agregar los registros (espera 24-48 horas para propagación):

### Verificar SPF:
```bash
nslookup -type=txt flasti.com
```

### Verificar DKIM:
```bash
nslookup -type=txt google._domainkey.flasti.com
```

### Verificar DMARC:
```bash
nslookup -type=txt _dmarc.flasti.com
```

### Herramientas online:
- https://mxtoolbox.com/spf.aspx
- https://mxtoolbox.com/dkim.aspx
- https://mxtoolbox.com/dmarc.aspx

## 🎯 Resultado esperado

Una vez configurado correctamente:
- ✅ Los correos llegarán a la bandeja de entrada
- ✅ No irán a spam
- ✅ Gmail mostrará "Verificado por flasti.com"
- ✅ Mejor reputación del dominio

## ⚠️ Importante

1. **No cambies el remitente**: Usa siempre `flasti.business@gmail.com`
2. **Espera propagación**: Los cambios DNS tardan 24-48 horas
3. **Prueba después**: Envía correos de prueba después de la propagación
4. **Monitorea reportes**: Revisa los reportes DMARC en tu email

## 📧 Configuración actual

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=flasti.business@gmail.com
SMTP_PASS=supf mcyp jnip ywgn
```

Esta configuración ya está correcta en el código.

## 🔍 Troubleshooting

### Si los correos siguen yendo a spam:

1. **Verifica que los registros DNS estén activos**
2. **Revisa el contenido del correo**: Evita palabras spam como "gratis", "dinero fácil", etc.
3. **Calienta el dominio**: Envía pocos correos al principio (10-20 por día)
4. **Pide a los usuarios que marquen como "No es spam"**
5. **Usa un servicio profesional**: SendGrid, Mailgun, AWS SES (opcional)

## 💡 Alternativa: Usar SendGrid (Recomendado para producción)

Si los problemas persisten, considera usar SendGrid:

1. Crea cuenta en https://sendgrid.com (100 correos/día gratis)
2. Verifica tu dominio
3. Obtén API Key
4. Actualiza variables de entorno:

```env
SENDGRID_API_KEY=tu_api_key_aqui
```

SendGrid maneja automáticamente SPF, DKIM y DMARC.
