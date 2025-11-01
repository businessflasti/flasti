# Imágenes Externas a Migrar - Página Principal

## 📋 Lista de Imágenes por Sección

### 1. **TeamSection** (Equipo)
**Ubicación**: `src/components/sections/TeamSection.tsx`

- **ben1min.jpg** → `public/images/team/ben1.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben1min.jpg`
  - Descripción: Miembro del equipo 1

- **ben2min.jpg** → `public/images/team/ben2.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben2min.jpg`
  - Descripción: Miembro del equipo 2

- **ben3min.jpg** → `public/images/team/ben3.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben3min.jpg`
  - Descripción: Miembro del equipo 3

- **ben4min.jpg** → `public/images/team/ben4.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/ben4min.jpg`
  - Descripción: Miembro del equipo 4

---

### 2. **StatsSection** (Estadísticas)
**Ubicación**: `src/components/sections/StatsSection.tsx`

- **profile1.jpg** → `public/images/users/profile1.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/profile1.jpg`
  - Descripción: Avatar usuario 1

- **profile2.jpg** → `public/images/users/profile2.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/profile2.jpg`
  - Descripción: Avatar usuario 2

- **profile3.jpg** → `public/images/users/profile3.jpg`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/profile3.jpg`
  - Descripción: Avatar usuario 3

---

### 3. **HowItWorksSection** (Cómo Funciona)
**Ubicación**: `src/components/sections/HowItWorksSection.tsx`

- **paso1-web.webp** → `public/images/steps/paso1.webp`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso1-web.webp`
  - Descripción: Paso 1 - Registro

- **paso2.webp** → `public/images/steps/paso2.webp`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso2.webp`
  - Descripción: Paso 2 - Tareas

- **paso3.webp** → `public/images/steps/paso3.webp`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/paso3.webp`
  - Descripción: Paso 3 - Retiro

---

### 4. **StudiovaHeroSection** (Hero Principal)
**Ubicación**: `src/components/sections/StudiovaHeroSection.tsx`

- **herouno.webp** → `public/images/hero/hero-background.webp`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/herouno.webp`
  - Descripción: Fondo del hero principal

- **soporte.webp** → `public/images/support/maria.webp`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/soporte.webp`
  - Descripción: Avatar María García (soporte)
  - Usado 2 veces en el componente

- **soportedos.webp** → `public/images/support/carlos.webp`
  - URL actual: `https://raw.githubusercontent.com/businessflasti/images/refs/heads/main/soportedos.webp`
  - Descripción: Avatar Carlos Ruiz (soporte)
  - Usado 2 veces en el componente

---

### 5. **CompaniesSection** (Empresas)
**Ubicación**: `src/components/sections/CompaniesSection.tsx`

- **1983974153.png** → `public/images/companies/flow-state-app.png`
  - URL actual: `https://ext.same-assets.com/1330808718/1983974153.png`
  - Descripción: Flow State Mobile App

---

### 6. **CertificationsSection** (Certificaciones)
**Ubicación**: `src/components/sections/CertificationsSection.tsx`

- **3568979742.png** → `public/images/certifications/cert-international.png`
  - URL actual: `https://ext.same-assets.com/1330808718/3568979742.png`
  - Descripción: Certificación Internacional

- **2153885248.png** → `public/images/certifications/cert-cloud.png`
  - URL actual: `https://ext.same-assets.com/1330808718/2153885248.png`
  - Descripción: Certificación Cloud

- **3768643606.png** → `public/images/certifications/cert-security.png`
  - URL actual: `https://ext.same-assets.com/1330808718/3768643606.png`
  - Descripción: Certificación Seguridad

---

### 7. **TeachersSection** (Profesores)
**Ubicación**: `src/components/sections/TeachersSection.tsx`

- **2380069110.png** → `public/images/teachers/alex-rivera.png`
  - URL actual: `https://ext.same-assets.com/1330808718/2380069110.png`
  - Descripción: Alex Rivera

- **3975420034.png** → `public/images/teachers/sophia-chen.png`
  - URL actual: `https://ext.same-assets.com/1330808718/3975420034.png`
  - Descripción: Sophia Chen

- **1593445754.png** → `public/images/teachers/maya-patel.png`
  - URL actual: `https://ext.same-assets.com/1330808718/1593445754.png`
  - Descripción: Maya Patel

- **173221268.png** → `public/images/teachers/julian-mercer.png`
  - URL actual: `https://ext.same-assets.com/1330808718/173221268.png`
  - Descripción: Julian Mercer

---

### 8. **CountriesSection** (Países)
**Ubicación**: `src/components/sections/CountriesSection.tsx`

- **Banderas de países** → Mantener API de flagcdn.com
  - URL: `https://flagcdn.com/w40/{code}.png`
  - **NOTA**: Estas son dinámicas, mejor mantener la API externa

---

## 📁 Estructura de Carpetas a Crear

```
public/images/
├── team/
│   ├── ben1.jpg
│   ├── ben2.jpg
│   ├── ben3.jpg
│   └── ben4.jpg
├── users/
│   ├── profile1.jpg
│   ├── profile2.jpg
│   └── profile3.jpg
├── steps/
│   ├── paso1.webp
│   ├── paso2.webp
│   └── paso3.webp
├── hero/
│   └── hero-background.webp
├── support/
│   ├── maria.webp
│   └── carlos.webp
├── companies/
│   └── flow-state-app.png
├── certifications/
│   ├── cert-international.png
│   ├── cert-cloud.png
│   └── cert-security.png
└── teachers/
    ├── alex-rivera.png
    ├── sophia-chen.png
    ├── maya-patel.png
    └── julian-mercer.png
```

---

## 📊 Resumen

- **Total de imágenes**: 23 imágenes
- **Secciones afectadas**: 7 secciones
- **Banderas**: Mantener API externa (dinámicas)

---

## ✅ Próximos Pasos

1. Descargar todas las imágenes de las URLs actuales
2. Colocarlas en las carpetas indicadas en `public/images/`
3. Actualizar las rutas en los componentes
4. Verificar que todas las imágenes carguen correctamente
