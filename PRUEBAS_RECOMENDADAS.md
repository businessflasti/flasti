# Pruebas Recomendadas - Verificación de Cambios

## 1. Prueba del Banner Editable

### Pasos:
1. Acceder a `/dashboard/admin/banner-config`
2. Cambiar el texto del banner a: "¡Nuevo texto de prueba!"
3. Cambiar el logo a: "/images/logo-test.png" (o cualquier ruta válida)
4. Hacer clic en "Guardar Cambios"
5. Abrir la página principal `/` en otra pestaña
6. Verificar que el banner muestra el nuevo texto y logo
7. Desactivar el banner desde admin
8. Verificar que el banner desaparece de la página principal

### Resultado Esperado:
- ✅ Los cambios se reflejan inmediatamente sin recargar
- ✅ El logo se actualiza correctamente
- ✅ El banner se puede activar/desactivar

## 2. Prueba del Bono de Bienvenida

### Pasos:
1. Crear un usuario nuevo o usar uno que no haya reclamado el bono
2. Acceder al dashboard
3. Verificar que el bloque de bienvenida aparece
4. Hacer clic en "Iniciar"
5. Completar la palabra "AVANZA33"
6. Esperar a que se acredite el bono

### Verificaciones:
- ✅ Balance aumenta en $0.75
- ✅ Estadística "Hoy" muestra $0.75
- ✅ Estadística "Esta semana" muestra $0.75
- ✅ Estadística "Total ganado" muestra $0.75
- ✅ Estadística "Completadas" muestra 1
- ✅ En `/dashboard/withdrawals` el "Total Ganado" muestra $0.75
- ✅ En `/dashboard/rewards-history` aparece la transacción del bono

### Verificación de No Parpadeo:
1. Recargar la página después de reclamar el bono
2. Verificar que el bloque de bienvenida NO aparece ni un segundo
3. El usuario no debe ver el bloque en ningún momento

## 3. Prueba de Visibilidad de Asesora

### Pasos:
1. Acceder al dashboard
2. Ver el mensaje de la asesora (debe estar sin leer)
3. Hacer clic en "Gracias" o "Me gusta"
4. Verificar que el mensaje cambia a gris

### Verificaciones:
- ✅ La burbuja en gris es visible y legible
- ✅ La etiqueta "Asesora" en gris se diferencia del fondo
- ✅ El texto del mensaje es legible en gris
- ✅ Hay suficiente contraste para distinguir el estado leído

## 4. Prueba de Mensaje de Error en Withdrawals

### Pasos:
1. Acceder a `/dashboard/withdrawals`
2. Intentar retirar $0.50 (menos del mínimo)
3. Verificar el mensaje de error

### Resultado Esperado:
- ✅ Mensaje: "No puedes retirar menos del mínimo permitido. Debes alcanzar al menos $1.00 USD para solicitar un retiro."
- ✅ El mensaje es claro y descriptivo

## 5. Prueba de Consistencia de Datos

### Consultas SQL para Verificar:

```sql
-- Verificar que el bono se registró correctamente
SELECT * FROM cpalead_transactions 
WHERE offer_id = 'welcome_bonus' 
ORDER BY created_at DESC 
LIMIT 5;

-- Verificar que el balance se actualizó
SELECT user_id, balance, total_earnings, welcome_bonus_claimed 
FROM user_profiles 
WHERE welcome_bonus_claimed = true 
ORDER BY updated_at DESC 
LIMIT 5;

-- Verificar configuración del banner
SELECT * FROM banner_config;
```

### Verificaciones:
- ✅ La transacción tiene status 'approved'
- ✅ La transacción tiene metadata con offer_name, description, campaign_name
- ✅ El balance y total_earnings aumentaron en 0.75
- ✅ welcome_bonus_claimed está en true
- ✅ La configuración del banner existe y es editable

## 6. Prueba de Tiempo Real

### Pasos:
1. Abrir dos pestañas del navegador
2. En la primera, acceder a `/dashboard/admin/banner-config`
3. En la segunda, abrir la página principal `/`
4. Cambiar el texto del banner en admin
5. Verificar que el cambio se refleja automáticamente en la segunda pestaña

### Resultado Esperado:
- ✅ Los cambios aparecen sin necesidad de recargar manualmente
- ✅ La suscripción en tiempo real funciona correctamente

## 7. Prueba de Rendimiento

### Verificaciones:
1. El bloque de bienvenida no causa parpadeos
2. La carga del banner es instantánea
3. No hay errores en la consola del navegador
4. Las estadísticas se cargan rápidamente

### Herramientas:
- Chrome DevTools > Network
- Chrome DevTools > Console
- Chrome DevTools > Performance

## Checklist Final

- [ ] Banner editable funciona correctamente
- [ ] Bono de bienvenida se acredita en todas las estadísticas
- [ ] Bloque de bienvenida no aparece después de reclamado
- [ ] Asesora en gris es visible y legible
- [ ] Mensaje de error en withdrawals es claro
- [ ] Tiempo real funciona en el banner
- [ ] No hay errores en consola
- [ ] Todas las migraciones se aplicaron correctamente
- [ ] Los índices de base de datos están creados
- [ ] La documentación está actualizada

## Comandos Útiles

```bash
# Aplicar migraciones
supabase migration up

# Verificar estado de migraciones
supabase migration list

# Ver logs en tiempo real
supabase logs --follow

# Reiniciar base de datos local (si es necesario)
supabase db reset
```

## Notas Importantes

1. **Backup**: Antes de aplicar en producción, hacer backup de la base de datos
2. **Testing**: Probar primero en ambiente de desarrollo
3. **Monitoreo**: Verificar logs después de desplegar
4. **Rollback**: Tener plan de rollback si algo falla
