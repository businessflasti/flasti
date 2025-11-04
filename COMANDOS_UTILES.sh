#!/bin/bash

# ============================================
# COMANDOS ÚTILES PARA DESPLIEGUE
# ============================================

echo "🚀 Script de Ayuda para Despliegue"
echo "=================================="
echo ""

# ============================================
# 1. MIGRACIONES DE BASE DE DATOS
# ============================================

echo "📊 1. MIGRACIONES DE BASE DE DATOS"
echo "-----------------------------------"
echo ""
echo "# Aplicar todas las migraciones pendientes:"
echo "supabase migration up"
echo ""
echo "# Aplicar una migración específica:"
echo "supabase migration up --file create_banner_config_table.sql"
echo "supabase migration up --file verify_cpalead_transactions_structure.sql"
echo ""
echo "# Ver estado de migraciones:"
echo "supabase migration list"
echo ""
echo "# Crear nueva migración (si es necesario):"
echo "supabase migration new nombre_de_migracion"
echo ""

# ============================================
# 2. VERIFICACIÓN DE BASE DE DATOS
# ============================================

echo "🔍 2. VERIFICACIÓN DE BASE DE DATOS"
echo "-----------------------------------"
echo ""
echo "# Conectar a la base de datos:"
echo "supabase db connect"
echo ""
echo "# Ejecutar consultas de verificación:"
cat << 'EOF'

-- Verificar tabla banner_config
SELECT * FROM banner_config;

-- Verificar columnas de cpalead_transactions
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cpalead_transactions'
AND column_name IN ('metadata', 'transaction_id', 'currency');

-- Verificar índices
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('banner_config', 'cpalead_transactions');

-- Verificar políticas RLS
SELECT * FROM pg_policies 
WHERE tablename = 'banner_config';

-- Verificar bonos de bienvenida
SELECT * FROM cpalead_transactions 
WHERE offer_id = 'welcome_bonus' 
ORDER BY created_at DESC 
LIMIT 5;

EOF
echo ""

# ============================================
# 3. DESARROLLO LOCAL
# ============================================

echo "💻 3. DESARROLLO LOCAL"
echo "-----------------------------------"
echo ""
echo "# Iniciar Supabase local:"
echo "supabase start"
echo ""
echo "# Detener Supabase local:"
echo "supabase stop"
echo ""
echo "# Reiniciar base de datos local:"
echo "supabase db reset"
echo ""
echo "# Iniciar servidor de desarrollo:"
echo "npm run dev"
echo ""
echo "# Build de producción:"
echo "npm run build"
echo ""

# ============================================
# 4. LOGS Y MONITOREO
# ============================================

echo "📝 4. LOGS Y MONITOREO"
echo "-----------------------------------"
echo ""
echo "# Ver logs de Supabase en tiempo real:"
echo "supabase logs --follow"
echo ""
echo "# Ver logs de una función específica:"
echo "supabase logs --function nombre_funcion"
echo ""
echo "# Ver logs de Next.js (si aplica):"
echo "npm run logs"
echo ""

# ============================================
# 5. PRUEBAS
# ============================================

echo "🧪 5. PRUEBAS"
echo "-----------------------------------"
echo ""
echo "# Ejecutar pruebas (si existen):"
echo "npm test"
echo ""
echo "# Ejecutar linter:"
echo "npm run lint"
echo ""
echo "# Verificar tipos TypeScript:"
echo "npm run type-check"
echo ""

# ============================================
# 6. GIT Y CONTROL DE VERSIONES
# ============================================

echo "📦 6. GIT Y CONTROL DE VERSIONES"
echo "-----------------------------------"
echo ""
echo "# Ver estado de cambios:"
echo "git status"
echo ""
echo "# Ver diferencias:"
echo "git diff"
echo ""
echo "# Agregar archivos modificados:"
echo "git add ."
echo ""
echo "# Commit con mensaje descriptivo:"
echo 'git commit -m "feat: implementar banner editable y mejoras de UX"'
echo ""
echo "# Push a repositorio:"
echo "git push origin main"
echo ""
echo "# Crear tag de versión:"
echo "git tag -a v1.0.0 -m 'Release v1.0.0: Banner editable y mejoras'"
echo "git push origin v1.0.0"
echo ""

# ============================================
# 7. BACKUP Y RESTAURACIÓN
# ============================================

echo "💾 7. BACKUP Y RESTAURACIÓN"
echo "-----------------------------------"
echo ""
echo "# Crear backup de base de datos:"
echo "supabase db dump > backup_$(date +%Y%m%d_%H%M%S).sql"
echo ""
echo "# Restaurar desde backup:"
echo "supabase db restore backup_YYYYMMDD_HHMMSS.sql"
echo ""

# ============================================
# 8. COMANDOS DE VERIFICACIÓN RÁPIDA
# ============================================

echo "⚡ 8. VERIFICACIÓN RÁPIDA"
echo "-----------------------------------"
echo ""
echo "# Verificar que todo está funcionando:"
cat << 'EOF'

# 1. Verificar que el servidor está corriendo
curl http://localhost:3000/api/health

# 2. Verificar que Supabase está corriendo
supabase status

# 3. Verificar que la tabla banner_config existe
psql -h localhost -U postgres -d postgres -c "SELECT * FROM banner_config;"

# 4. Verificar que los índices se crearon
psql -h localhost -U postgres -d postgres -c "SELECT indexname FROM pg_indexes WHERE tablename = 'cpalead_transactions';"

EOF
echo ""

# ============================================
# 9. TROUBLESHOOTING
# ============================================

echo "🔧 9. TROUBLESHOOTING"
echo "-----------------------------------"
echo ""
echo "# Si hay problemas con migraciones:"
echo "supabase migration repair"
echo ""
echo "# Si hay problemas con la base de datos:"
echo "supabase db reset"
echo ""
echo "# Si hay problemas con el cache:"
echo "npm run clean"
echo "rm -rf .next"
echo "npm run build"
echo ""
echo "# Ver logs de errores:"
echo "tail -f logs/error.log"
echo ""

# ============================================
# 10. DESPLIEGUE A PRODUCCIÓN
# ============================================

echo "🚀 10. DESPLIEGUE A PRODUCCIÓN"
echo "-----------------------------------"
echo ""
echo "# Antes de desplegar:"
echo "1. Hacer backup de la base de datos"
echo "2. Verificar que todas las pruebas pasan"
echo "3. Revisar el código una última vez"
echo ""
echo "# Desplegar (ejemplo con Vercel):"
echo "vercel --prod"
echo ""
echo "# O con otro servicio:"
echo "npm run deploy"
echo ""

# ============================================
# 11. POST-DESPLIEGUE
# ============================================

echo "✅ 11. POST-DESPLIEGUE"
echo "-----------------------------------"
echo ""
echo "# Verificar que el sitio está funcionando:"
echo "curl https://tu-dominio.com"
echo ""
echo "# Verificar endpoints específicos:"
echo "curl https://tu-dominio.com/api/user/profile"
echo ""
echo "# Monitorear logs en producción:"
echo "# (Depende de tu servicio de hosting)"
echo ""

# ============================================
# 12. ROLLBACK
# ============================================

echo "⏮️  12. ROLLBACK (Si es necesario)"
echo "-----------------------------------"
echo ""
echo "# Revertir al commit anterior:"
echo "git revert HEAD"
echo "git push origin main"
echo ""
echo "# O hacer checkout a un commit específico:"
echo "git checkout <commit-hash>"
echo ""
echo "# Revertir migraciones:"
echo "supabase migration down"
echo ""

echo ""
echo "=================================="
echo "✨ Fin del Script de Ayuda"
echo "=================================="
echo ""
echo "💡 Tip: Guarda este archivo y ejecútalo cuando necesites recordar los comandos"
echo "📚 Para más información, consulta la documentación en los archivos MD"
echo ""
