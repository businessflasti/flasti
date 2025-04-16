# Instrucciones para migrar a la carpeta definitiva

Este documento explica cómo mover los archivos de la carpeta `imagesdos` a la carpeta definitiva `images` para su despliegue en producción.

## Pasos para la migración

1. **Crear la carpeta de destino**:
   ```
   mkdir -p src/app/images
   ```

2. **Copiar todos los archivos**:
   ```
   cp -r src/app/imagesdos/* src/app/images/
   ```

3. **Verificar que todos los archivos se hayan copiado correctamente**:
   ```
   ls -la src/app/images
   ```

## Verificación después de la migración

Después de mover los archivos, verifica que:

1. **Las páginas se carguen correctamente** en las nuevas URLs:
   - `https://flasti.com/images`
   - `https://flasti.com/images/checkout`

2. **El sistema de seguimiento de afiliados funcione correctamente**:
   - Prueba un enlace de afiliado: `https://flasti.com/images?ref=ID_DE_PRUEBA`
   - Verifica que el parámetro `ref` se capture y se preserve al navegar a checkout

3. **El formulario de Hotmart se cargue correctamente** y reciba el parámetro de afiliado

## Configuración del servidor

Si estás utilizando Next.js como servidor, asegúrate de que:

1. **La carpeta `images` esté configurada como una ruta de aplicación**
2. **El endpoint de webhook para Hotmart esté correctamente configurado**:
   - URL: `https://flasti.com/api/payment/hotmart-webhook`

## Actualización de enlaces externos

Si tienes enlaces desde otras partes de tu aplicación que apuntan a `imagesdos`, actualízalos para que apunten a `images`:

- Cambiar `https://flasti.com/imagesdos` a `https://flasti.com/images`
- Cambiar `https://flasti.com/imagesdos/checkout.html` a `https://flasti.com/images/checkout`

## Actualización de la configuración de Hotmart

Actualiza la URL del webhook en la configuración de Hotmart:

1. Inicia sesión en tu cuenta de Hotmart
2. Ve a "Configuraciones" > "Webhooks"
3. Actualiza la URL del webhook a `https://flasti.com/api/payment/hotmart-webhook`

## Notas importantes

- El sistema de seguimiento de afiliados está configurado para funcionar con las URLs definitivas
- No es necesario modificar el código después de la migración, ya que todos los ajustes ya se han realizado
- Si encuentras algún problema, verifica los logs del servidor y la consola del navegador para identificar posibles errores
