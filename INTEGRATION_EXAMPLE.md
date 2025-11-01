# Ejemplo de Integración del Sistema de Visibilidad

## 📝 Cómo integrar el hook en los componentes

### 1. **DashboardHeader.tsx**

```typescript
import { useElementVisibility } from '@/hooks/useElementVisibility';

export default function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  // Importar el hook para Header
  const { isVisible } = useElementVisibility('header');
  
  // ... resto del código ...
  
  return (
    <header className="...">
      <div className="flex items-center justify-between w-full">
        
        {/* Logo/Avatar - Controlable */}
        {isVisible('logo') && (
          <div className="flex items-center gap-2">
            {isMobile ? (
              <div className="user-avatar">...</div>
            ) : (
              <a href="/dashboard">
                <Image src="/logo/isotipo-web.png" ... />
              </a>
            )}
          </div>
        )}
        
        {/* Título de página - Controlable */}
        {isVisible('page_title') && (
          <div className="text-left">
            <div className="text-xs sm:text-sm md:text-lg font-bold text-white">
              Panel personal
            </div>
          </div>
        )}
        
        {/* Balance en header - Controlable */}
        {isVisible('balance_display') && !isMainDashboard && (
          <div className="user-balance">
            <span>${profile?.balance?.toFixed(2) ?? '0.00'} USD</span>
          </div>
        )}
        
        {/* Badge de país - Controlable */}
        {isVisible('country_badge') && !isCheckoutPage && (
          <div>
            {detectedCountry && detectedCountry !== '--' && (
              <div className="inline-flex items-center gap-2.5">
                <CountryFlag countryCode={detectedCountry} />
                <span>{detectedCountry}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Historias/Testimonios - Controlable */}
        {isVisible('stories') && !isCheckoutPage && stories.length > 0 && (
          <Stories stories={stories} />
        )}
        
        {/* Botón de menú móvil - Controlable */}
        {isVisible('menu_button') && isMobile && (
          <button onClick={onMenuClick}>
            <svg>...</svg>
          </button>
        )}
        
      </div>
    </header>
  );
}
```

### 2. **Dashboard page.tsx**

```typescript
import { useElementVisibility } from '@/hooks/useElementVisibility';

export default function DashboardPage() {
  const { isVisible } = useElementVisibility('dashboard');
  
  return (
    <div className="min-h-screen">
      
      {/* Bono de bienvenida móvil - Controlable */}
      {isVisible('welcome_bonus') && user?.id && (
        <div className="md:hidden">
          <WelcomeBonus userId={user.id} />
        </div>
      )}
      
      {/* Balance móvil - Controlable */}
      {isVisible('balance_display') && user?.id && (
        <div className="md:hidden mb-4">
          <UserBalanceDisplay
            initialBalance={userStats.balance}
            userId={user.id}
          />
        </div>
      )}
      
      {/* Video Tutorial - Controlable */}
      {isVisible('video_tutorial') && user?.id && (
        <div className="md:hidden mb-4">
          <Card>
            <video controls>...</video>
          </Card>
        </div>
      )}
      
      {/* Estadísticas - Controlables individualmente */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {isVisible('stat_today') && (
          <Card>
            <CardContent>
              <p>Ganancias de Hoy</p>
              <p>${userStats.todayEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>
        )}
        
        {isVisible('stat_week') && (
          <Card>
            <CardContent>
              <p>Esta Semana</p>
              <p>${userStats.weekEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>
        )}
        
        {isVisible('stat_total') && (
          <Card>
            <CardContent>
              <p>Total Ganado</p>
              <p>${userStats.totalEarnings.toFixed(2)}</p>
            </CardContent>
          </Card>
        )}
        
        {isVisible('stat_completed') && (
          <Card>
            <CardContent>
              <p>Completadas</p>
              <p>{userStats.totalTransactions}</p>
            </CardContent>
          </Card>
        )}
        
      </div>
      
      {/* Sección de ofertas - Controlable */}
      {isVisible('offers_section') && (
        <Tabs defaultValue="offers">
          <TabsContent value="offers">
            <Card>
              <CardHeader>
                <CardTitle>Microtareas asignadas para ti hoy</CardTitle>
              </CardHeader>
              <CardContent>
                <OffersListNew />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
    </div>
  );
}
```

### 3. **Premium page.tsx**

```typescript
import { useElementVisibility } from '@/hooks/useElementVisibility';

export default function PremiumPage() {
  const { isVisible } = useElementVisibility('premium');
  
  return (
    <div className="min-h-screen">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Columna izquierda */}
        <div className="lg:w-1/2">
          
          {/* Imagen dashboard - Controlable */}
          {isVisible('dashboard_image') && (
            <div className="hidden lg:block mb-4">
              <div className="bg-gradient-to-br from-[#232323] to-[#1a1a1a] rounded-3xl p-6">
                <img src="/images/premium.png" alt="Dashboard" />
              </div>
            </div>
          )}
          
          {/* FAQs - Controlables individualmente */}
          <div className="space-y-4">
            
            {isVisible('faq_earnings') && (
              <div className="overflow-hidden rounded-3xl bg-card/60">
                <button onClick={() => setActiveQuestion(0)}>
                  ¿Cuánto dinero puedo ganar?
                </button>
              </div>
            )}
            
            {isVisible('faq_payment') && (
              <div className="overflow-hidden rounded-3xl bg-card/60">
                <button onClick={() => setActiveQuestion(1)}>
                  ¿Por qué debo hacer un pago único?
                </button>
              </div>
            )}
            
            {isVisible('faq_location') && (
              <div className="overflow-hidden rounded-3xl bg-card/60">
                <button onClick={() => setActiveQuestion(2)}>
                  ¿Puedo empezar desde mi ubicación?
                </button>
              </div>
            )}
            
            {isVisible('faq_guarantee') && (
              <div className="overflow-hidden rounded-3xl bg-card/60">
                <button onClick={() => setActiveQuestion(3)}>
                  ¿Cómo me respalda la garantía?
                </button>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Columna derecha */}
        <div className="lg:w-1/2">
          
          {/* Pricing card - Controlable */}
          {isVisible('pricing_card') && (
            <Card className="bg-card/60">
              <div className="p-8">
                <h3>Desbloquea todas tus microtareas</h3>
                <div className="mb-8 bg-black p-6 rounded-3xl">
                  <span className="text-4xl font-bold">
                    ${countryPrice.price}
                  </span>
                </div>
                <Button>QUIERO DESBLOQUEAR YA</Button>
              </div>
            </Card>
          )}
          
          {/* Testimonios - Controlable */}
          {isVisible('testimonials') && (
            <div className="mt-6">
              <Card className="bg-card/60">
                <div className="p-4">
                  <h2>Miles de usuarios ya están ganando dinero</h2>
                  <TestimonialsSlider />
                </div>
              </Card>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Ventajas del Sistema

### Reacomodo Automático
Cuando un elemento se oculta, el CSS Grid automáticamente reacomoda los elementos restantes:

```css
/* Los elementos se reacomodan automáticamente */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

### Ejemplo Visual:

**Antes (todos visibles):**
```
┌─────────┬─────────┬─────────┬─────────┐
│  Hoy    │ Semana  │  Total  │Completas│
└─────────┴─────────┴─────────┴─────────┘
```

**Después (ocultar "Semana"):**
```
┌─────────┬─────────┬─────────┐
│  Hoy    │  Total  │Completas│
└─────────┴─────────┴─────────┘
```

Los elementos se expanden automáticamente para llenar el espacio disponible.

## 🔄 Flujo Completo

1. **Admin desactiva elemento** → Panel de control
2. **Se actualiza DB** → Tabla `element_visibility`
3. **Trigger en tiempo real** → Supabase Realtime
4. **Hook detecta cambio** → `useElementVisibility`
5. **Componente re-renderiza** → React
6. **Elemento desaparece** → Condicional `{isVisible() && ...}`
7. **Grid se reacomoda** → CSS automático

## ✅ Checklist de Integración

- [ ] Ejecutar migración en Supabase
- [ ] Importar hook en DashboardHeader
- [ ] Envolver elementos del header con `isVisible()`
- [ ] Importar hook en Dashboard page
- [ ] Envolver elementos del dashboard con `isVisible()`
- [ ] Importar hook en Premium page
- [ ] Envolver elementos de premium con `isVisible()`
- [ ] Probar en desarrollo
- [ ] Verificar tiempo real funciona
- [ ] Probar en producción

## 🎨 Tips de Diseño

### Mantener el Layout Limpio
```typescript
// ✅ BIEN: Usar fragmentos para evitar divs innecesarios
{isVisible('element') && (
  <Component />
)}

// ❌ MAL: Agregar divs que afectan el layout
{isVisible('element') && (
  <div>
    <Component />
  </div>
)}
```

### Grid Responsive
```typescript
// El grid se adapta automáticamente
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {isVisible('stat_today') && <StatCard />}
  {isVisible('stat_week') && <StatCard />}
  {isVisible('stat_total') && <StatCard />}
  {isVisible('stat_completed') && <StatCard />}
</div>
```

Si solo 2 elementos están visibles, el grid automáticamente los distribuye en 2 columnas en desktop.
