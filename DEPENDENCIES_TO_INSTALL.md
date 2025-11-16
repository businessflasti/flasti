# 📦 Dependencias Necesarias

## Instalar todas las dependencias:

```bash
npm install @prisma/client next-auth bcryptjs
npm install -D prisma @types/bcryptjs
```

## Dependencias Individuales:

### Base de Datos
```bash
npm install @prisma/client
npm install -D prisma
```

### Autenticación
```bash
npm install next-auth
npm install bcryptjs
npm install -D @types/bcryptjs
```

### Verificar instalación:
```bash
npm list @prisma/client next-auth bcryptjs
```

## Generar Cliente de Prisma:
```bash
npx prisma generate
```

## Ejecutar Migración:
```bash
npx prisma migrate dev --name init_investment_system
```
