#!/bin/bash

echo "🚀 Ejecutando Migraciones para Flasti"
echo "======================================"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Paso 1: Crear tabla de configuración del banner${NC}"
echo "Ejecutando: create_banner_config_table.sql"
echo ""

# Ejecutar primera migración
supabase migration up --file create_banner_config_table.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Tabla banner_config creada exitosamente${NC}"
else
    echo -e "${YELLOW}⚠️  Error al crear tabla banner_config${NC}"
    echo "Puedes ejecutar manualmente en SQL Editor de Supabase"
fi

echo ""
echo -e "${BLUE}📊 Paso 2: Verificar estructura de cpalead_transactions${NC}"
echo "Ejecutando: verify_cpalead_transactions_structure.sql"
echo ""

# Ejecutar segunda migración
supabase migration up --file verify_cpalead_transactions_structure.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Estructura de cpalead_transactions verificada${NC}"
else
    echo -e "${YELLOW}⚠️  Error al verificar estructura${NC}"
    echo "Puedes ejecutar manualmente en SQL Editor de Supabase"
fi

echo ""
echo "======================================"
echo -e "${GREEN}✅ Migraciones completadas${NC}"
echo "======================================"
echo ""

echo "📋 Próximos pasos:"
echo ""
echo "1. Verifica que las tablas se crearon:"
echo "   supabase db connect"
echo "   SELECT * FROM banner_config;"
echo ""
echo "2. Accede a la configuración del banner:"
echo "   https://tu-dominio.com/dashboard/admin/banner-config"
echo ""
echo "3. Configura el texto y logo del banner"
echo ""
echo "4. Prueba el bono de bienvenida con un usuario nuevo"
echo ""
echo "5. Verifica que la asesora tiene mejor contraste visual"
echo ""

echo "📚 Documentación disponible:"
echo "   - RESUMEN_FINAL.md"
echo "   - EJECUTAR_MIGRACIONES.md"
echo "   - PRUEBAS_RECOMENDADAS.md"
echo ""

echo "🎉 ¡Listo para usar!"
