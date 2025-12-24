// Script para agregar 27 nuevas ofertas personalizadas (posiciones 8-34)
// Ejecutar con: node scripts/add-27-new-offers.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Primero agregar la columna instructions si no existe
async function addInstructionsColumn() {
  console.log('📝 Verificando columna instructions...');
  try {
    // Intentar agregar la columna (ignorar error si ya existe)
    await supabase.rpc('exec_sql', {
      sql: `ALTER TABLE custom_offers ADD COLUMN IF NOT EXISTS instructions TEXT DEFAULT '';`
    });
  } catch (e) {
    // Si falla el RPC, intentar directamente
    console.log('Columna instructions probablemente ya existe o se agregará con el primer insert');
  }
}

const newOffers = [
  // #8 - Comparación de Precios
  {
    title: 'Comparación de Precios',
    description: 'Compara precios de productos y selecciona el más económico',
    amount: 1.25,
    modal_title: '¡Compara los precios!',
    modal_subtitle: `LISTA DE PRECIOS - LAPTOP GAMING:

Tienda A: $1,299.99
Tienda B: $1,245.00
Tienda C: $1,310.50
Tienda D: $1,199.99
Tienda E: $1,275.00

¿Cuál tienda ofrece el precio más bajo? Escribe la letra (A, B, C, D o E)`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Tienda con mejor precio:',
    help_text: 'Analiza cuidadosamente cada precio antes de responder',
    instructions: 'Lee todos los precios|Identifica el más bajo|Escribe la letra correspondiente|Confirma tu respuesta',
    partner_name: 'PriceWatch Analytics',
    objective: 'Tu análisis ayuda a validar nuestros algoritmos de comparación de precios',
    task_type: 'Texto',
    block_bg_color: '#0891B2',
    image_bg_color: '#0891B2',
    is_active: true,
    position: 8
  },

  // #9 - Detección de Errores Ortográficos
  {
    title: 'Corrección Ortográfica',
    description: 'Encuentra el error ortográfico en el texto',
    amount: 1.50,
    modal_title: '¡Encuentra el error!',
    modal_subtitle: `Lee el siguiente párrafo y encuentra la palabra mal escrita:

"La empresa anunció que sus ventas aumentaron significativamente durante el último trimestre. Los analistas financieros consideran que este cresimiento se debe principalmente a la expansión internacional y a las nuevas estrategias de marketing digital implementadas."

Escribe la palabra que está mal escrita.`,
    input_placeholder: 'Escribe la palabra incorrecta',
    input_label: 'Palabra con error:',
    help_text: 'Lee con atención cada palabra del texto',
    instructions: 'Lee el párrafo completo|Busca errores ortográficos|Escribe la palabra incorrecta|Confirma tu respuesta',
    partner_name: 'TextQuality Corp',
    objective: 'Tu revisión mejora nuestros sistemas de corrección automática de textos',
    task_type: 'Texto',
    block_bg_color: '#7C3AED',
    image_bg_color: '#7C3AED',
    is_active: true,
    position: 9
  },
  // #10 - Categorización de Producto
  {
    title: 'Categorización de Producto',
    description: 'Clasifica un producto en su categoría correcta',
    amount: 1.00,
    modal_title: '¡Categoriza el producto!',
    modal_subtitle: `PRODUCTO: "Auriculares Bluetooth con cancelación de ruido activa, batería de 30 horas, micrófono integrado para llamadas"

¿En qué categoría principal debería clasificarse?

A) Computadoras y Laptops
B) Audio y Sonido
C) Telefonía y Accesorios
D) Gaming
E) Hogar Inteligente`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Categoría correcta:',
    help_text: 'Considera la función principal del producto',
    instructions: 'Lee la descripción del producto|Analiza las categorías|Selecciona la más apropiada|Confirma tu elección',
    partner_name: 'E-Commerce Solutions',
    objective: 'Tu clasificación entrena nuestros sistemas de categorización automática',
    task_type: 'Texto',
    block_bg_color: '#EA580C',
    image_bg_color: '#EA580C',
    is_active: true,
    position: 10
  },

  // #11 - Verificación de Email
  {
    title: 'Verificación de Formato',
    description: 'Verifica si un email tiene formato válido',
    amount: 0.75,
    modal_title: '¡Verifica el email!',
    modal_subtitle: `Revisa los siguientes emails y determina cuál tiene un formato INVÁLIDO:

1) usuario@empresa.com
2) contacto.ventas@tienda.org
3) info@compania
4) soporte_tecnico@servicio.net
5) admin@sistema.co

Escribe el número del email con formato incorrecto.`,
    input_placeholder: 'Escribe el número: 1, 2, 3, 4 o 5',
    input_label: 'Email inválido:',
    help_text: 'Un email válido debe tener @ y un dominio completo',
    instructions: 'Revisa cada email|Identifica el formato incorrecto|Escribe el número|Confirma',
    partner_name: 'DataValidation Inc',
    objective: 'Tu verificación mejora nuestros filtros de validación de datos',
    task_type: 'Formulario',
    block_bg_color: '#DC2626',
    image_bg_color: '#DC2626',
    is_active: true,
    position: 11
  },
  // #12 - Análisis de Hashtags
  {
    title: 'Análisis de Hashtags',
    description: 'Selecciona el hashtag más relevante para un post',
    amount: 1.25,
    modal_title: '¡Elige el mejor hashtag!',
    modal_subtitle: `POST DE INSTAGRAM:
"Acabo de terminar mi rutina de ejercicios matutina 💪 Nada como empezar el día con energía. 30 minutos de cardio y 20 de pesas."

¿Cuál hashtag sería el MÁS relevante?

A) #FoodPorn
B) #TravelGram
C) #FitnessMotivation
D) #OOTD
E) #TechNews`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Hashtag más relevante:',
    help_text: 'Relaciona el contenido del post con el hashtag',
    instructions: 'Lee el post|Analiza cada hashtag|Elige el más relacionado|Confirma tu selección',
    partner_name: 'SocialMedia Analytics',
    objective: 'Tu análisis mejora nuestras recomendaciones de hashtags para creadores',
    task_type: 'Encuesta',
    block_bg_color: '#E11D48',
    image_bg_color: '#E11D48',
    is_active: true,
    position: 12
  },

  // #13 - Traducción Simple
  {
    title: 'Verificación de Traducción',
    description: 'Verifica si una traducción es correcta',
    amount: 2.00,
    modal_title: '¡Verifica la traducción!',
    modal_subtitle: `FRASE ORIGINAL (Inglés):
"The quick brown fox jumps over the lazy dog"

TRADUCCIÓN PROPUESTA (Español):
"El rápido zorro marrón salta sobre el perro perezoso"

¿La traducción es correcta?
Escribe: CORRECTA o INCORRECTA`,
    input_placeholder: 'Escribe: CORRECTA o INCORRECTA',
    input_label: 'Tu verificación:',
    help_text: 'Compara palabra por palabra ambas frases',
    instructions: 'Lee la frase original|Lee la traducción|Compara el significado|Indica si es correcta',
    partner_name: 'TranslateAI',
    objective: 'Tu verificación entrena nuestros modelos de traducción automática',
    task_type: 'Texto',
    block_bg_color: '#0D9488',
    image_bg_color: '#0D9488',
    is_active: true,
    position: 13
  },
  // #14 - Conteo de Elementos
  {
    title: 'Conteo Visual',
    description: 'Cuenta elementos específicos en una descripción',
    amount: 1.00,
    modal_title: '¡Cuenta los elementos!',
    modal_subtitle: `INVENTARIO DE OFICINA:

- 5 escritorios de madera
- 12 sillas ergonómicas
- 3 impresoras láser
- 8 monitores de 24 pulgadas
- 2 proyectores
- 15 teclados inalámbricos
- 4 pizarras blancas

¿Cuántos dispositivos ELECTRÓNICOS hay en total?
(Considera: impresoras, monitores, proyectores, teclados)`,
    input_placeholder: 'Escribe el número total',
    input_label: 'Total de dispositivos electrónicos:',
    help_text: 'Suma solo los items que son dispositivos electrónicos',
    instructions: 'Lee el inventario|Identifica dispositivos electrónicos|Suma las cantidades|Escribe el total',
    partner_name: 'InventoryCheck',
    objective: 'Tu conteo valida nuestros sistemas de gestión de inventario',
    task_type: 'Formulario',
    block_bg_color: '#4F46E5',
    image_bg_color: '#4F46E5',
    is_active: true,
    position: 14
  },

  // #15 - Detección de Spam
  {
    title: 'Detección de Spam',
    description: 'Identifica si un mensaje es spam o legítimo',
    amount: 1.75,
    modal_title: '¡Detecta el spam!',
    modal_subtitle: `MENSAJE RECIBIDO:

"¡¡¡FELICIDADES!!! Has sido seleccionado para ganar un iPhone 15 Pro GRATIS. Solo debes hacer clic en el enlace y proporcionar tus datos bancarios para recibir tu premio. ¡¡¡OFERTA POR TIEMPO LIMITADO!!! No pierdas esta oportunidad única."

¿Este mensaje es SPAM o LEGÍTIMO?`,
    input_placeholder: 'Escribe: SPAM o LEGÍTIMO',
    input_label: 'Clasificación del mensaje:',
    help_text: 'Analiza el tono, las promesas y las solicitudes del mensaje',
    instructions: 'Lee el mensaje completo|Identifica señales de spam|Clasifica el mensaje|Confirma tu decisión',
    partner_name: 'SpamShield Security',
    objective: 'Tu clasificación entrena nuestros filtros anti-spam',
    task_type: 'Texto',
    block_bg_color: '#B91C1C',
    image_bg_color: '#B91C1C',
    is_active: true,
    position: 15
  },
  // #16 - Evaluación de Título
  {
    title: 'Evaluación de Título',
    description: 'Evalúa la efectividad de un título de artículo',
    amount: 1.50,
    modal_title: '¡Evalúa el título!',
    modal_subtitle: `TÍTULO DE ARTÍCULO:
"10 Secretos que los Expertos en Finanzas No Quieren que Sepas"

Califica del 1 al 10 qué tan atractivo es este título para hacer clic:
1-3 = Poco atractivo
4-6 = Moderadamente atractivo
7-10 = Muy atractivo (clickbait efectivo)`,
    input_placeholder: 'Escribe un número del 1 al 10',
    input_label: 'Tu calificación:',
    help_text: '¿Te generaría curiosidad hacer clic en este artículo?',
    instructions: 'Lee el título|Evalúa su atractivo|Asigna una puntuación|Confirma',
    partner_name: 'ContentMetrics',
    objective: 'Tu evaluación ayuda a optimizar títulos para mayor engagement',
    task_type: 'Texto',
    block_bg_color: '#9333EA',
    image_bg_color: '#9333EA',
    is_active: true,
    position: 16
  },

  // #17 - Identificación de Tono
  {
    title: 'Análisis de Tono',
    description: 'Identifica el tono de un mensaje de atención al cliente',
    amount: 1.75,
    modal_title: '¡Identifica el tono!',
    modal_subtitle: `MENSAJE DE CLIENTE:

"Llevo tres días esperando mi pedido y nadie me da una respuesta clara. Ya es la tercera vez que llamo y cada vez me dicen algo diferente. Esto es inaceptable para una empresa de su tamaño."

¿Cuál es el tono predominante del mensaje?

A) Satisfecho
B) Neutral
C) Frustrado
D) Agresivo
E) Confundido`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Tono del mensaje:',
    help_text: 'Analiza las palabras y expresiones utilizadas',
    instructions: 'Lee el mensaje|Identifica emociones|Selecciona el tono|Confirma tu análisis',
    partner_name: 'CustomerInsight AI',
    objective: 'Tu análisis mejora nuestros sistemas de priorización de tickets',
    task_type: 'Encuesta',
    block_bg_color: '#0369A1',
    image_bg_color: '#0369A1',
    is_active: true,
    position: 17
  },
  // #18 - Cálculo de Descuento
  {
    title: 'Cálculo de Descuento',
    description: 'Calcula el precio final después de un descuento',
    amount: 1.25,
    modal_title: '¡Calcula el descuento!',
    modal_subtitle: `OFERTA ESPECIAL:

Producto: Smartwatch Premium
Precio original: $200.00
Descuento: 25%

¿Cuál es el precio final después del descuento?
(Escribe solo el número, sin el símbolo $)`,
    input_placeholder: 'Ejemplo: 150.00',
    input_label: 'Precio final:',
    help_text: 'Calcula: Precio - (Precio × Porcentaje/100)',
    instructions: 'Lee el precio original|Calcula el 25%|Resta del precio|Escribe el resultado',
    partner_name: 'RetailMath',
    objective: 'Tu cálculo valida nuestros sistemas de precios dinámicos',
    task_type: 'Formulario',
    block_bg_color: '#059669',
    image_bg_color: '#059669',
    is_active: true,
    position: 18
  },

  // #19 - Verificación de Edad
  {
    title: 'Verificación de Requisitos',
    description: 'Verifica si un usuario cumple requisitos de edad',
    amount: 0.75,
    modal_title: '¡Verifica la edad!',
    modal_subtitle: `DATOS DEL USUARIO:
Nombre: Carlos Mendoza
Fecha de nacimiento: 15/03/2006
Fecha actual: Diciembre 2024

REQUISITO: El usuario debe ser mayor de 18 años para acceder al servicio.

¿El usuario cumple con el requisito de edad?
Escribe: SÍ o NO`,
    input_placeholder: 'Escribe: SÍ o NO',
    input_label: '¿Cumple el requisito?',
    help_text: 'Calcula la edad actual del usuario',
    instructions: 'Lee la fecha de nacimiento|Calcula la edad actual|Compara con el requisito|Responde SÍ o NO',
    partner_name: 'AgeVerify Systems',
    objective: 'Tu verificación valida nuestros sistemas de control de acceso',
    task_type: 'Formulario',
    block_bg_color: '#6366F1',
    image_bg_color: '#6366F1',
    is_active: true,
    position: 19
  },
  // #20 - Selección de Imagen
  {
    title: 'Descripción de Imagen',
    description: 'Selecciona la mejor descripción para una imagen',
    amount: 1.50,
    modal_title: '¡Describe la imagen!',
    modal_subtitle: `DESCRIPCIÓN DE IMAGEN:
Una fotografía muestra un paisaje montañoso al atardecer. El cielo tiene tonos naranjas y rosados. En primer plano hay un lago que refleja las montañas. Algunos pinos se ven a los lados.

¿Cuál sería el mejor título para esta imagen?

A) "Caos urbano al mediodía"
B) "Atardecer sereno en las montañas"
C) "Playa tropical al amanecer"
D) "Desierto bajo la luna llena"
E) "Bosque lluvioso en primavera"`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Mejor título:',
    help_text: 'Relaciona la descripción con el título más apropiado',
    instructions: 'Lee la descripción|Analiza cada opción|Elige la más precisa|Confirma tu selección',
    partner_name: 'ImageTag AI',
    objective: 'Tu selección entrena nuestros modelos de descripción automática de imágenes',
    task_type: 'Texto',
    block_bg_color: '#DB2777',
    image_bg_color: '#DB2777',
    is_active: true,
    position: 20
  },

  // #21 - Priorización de Tareas
  {
    title: 'Priorización de Tareas',
    description: 'Ordena tareas según su urgencia',
    amount: 2.00,
    modal_title: '¡Prioriza las tareas!',
    modal_subtitle: `LISTA DE TAREAS PENDIENTES:

1. Enviar informe mensual (vence mañana)
2. Organizar escritorio (sin fecha límite)
3. Responder email urgente del cliente (vence hoy)
4. Actualizar perfil de LinkedIn (sin fecha límite)
5. Preparar presentación (vence en 1 semana)

¿Cuál tarea debería hacerse PRIMERO según su urgencia?
Escribe el número de la tarea.`,
    input_placeholder: 'Escribe el número: 1, 2, 3, 4 o 5',
    input_label: 'Tarea más urgente:',
    help_text: 'Considera las fechas límite de cada tarea',
    instructions: 'Lee todas las tareas|Identifica fechas límite|Selecciona la más urgente|Confirma',
    partner_name: 'ProductivityAI',
    objective: 'Tu priorización mejora nuestros algoritmos de gestión de tiempo',
    task_type: 'Encuesta',
    block_bg_color: '#CA8A04',
    image_bg_color: '#CA8A04',
    is_active: true,
    position: 21
  },
  // #22 - Detección de Duplicados
  {
    title: 'Detección de Duplicados',
    description: 'Encuentra el registro duplicado en una lista',
    amount: 1.25,
    modal_title: '¡Encuentra el duplicado!',
    modal_subtitle: `BASE DE DATOS DE CLIENTES:

ID-001: María García - maria@email.com
ID-002: Juan López - juan@email.com
ID-003: Ana Martínez - ana@email.com
ID-004: María García - mariagarcia@email.com
ID-005: Pedro Sánchez - pedro@email.com

¿Cuál ID corresponde a un cliente que ya existe (duplicado por nombre)?`,
    input_placeholder: 'Escribe el ID: 001, 002, 003, 004 o 005',
    input_label: 'ID duplicado:',
    help_text: 'Busca nombres repetidos en la lista',
    instructions: 'Revisa todos los nombres|Identifica repeticiones|Escribe el ID duplicado|Confirma',
    partner_name: 'DataClean Pro',
    objective: 'Tu detección mejora nuestros sistemas de limpieza de datos',
    task_type: 'Formulario',
    block_bg_color: '#7C2D12',
    image_bg_color: '#7C2D12',
    is_active: true,
    position: 22
  },

  // #23 - Evaluación de Contraseña
  {
    title: 'Evaluación de Seguridad',
    description: 'Evalúa la fortaleza de una contraseña',
    amount: 1.00,
    modal_title: '¡Evalúa la contraseña!',
    modal_subtitle: `CONTRASEÑA A EVALUAR: "MiPerro2024!"

Criterios de seguridad:
✓ Mínimo 8 caracteres
✓ Al menos una mayúscula
✓ Al menos una minúscula
✓ Al menos un número
✓ Al menos un carácter especial

¿Cuántos criterios cumple esta contraseña?
Escribe el número (0-5)`,
    input_placeholder: 'Escribe un número del 0 al 5',
    input_label: 'Criterios cumplidos:',
    help_text: 'Verifica cada criterio uno por uno',
    instructions: 'Analiza la contraseña|Verifica cada criterio|Cuenta los cumplidos|Escribe el total',
    partner_name: 'SecurePass',
    objective: 'Tu evaluación valida nuestros indicadores de fortaleza de contraseñas',
    task_type: 'Formulario',
    block_bg_color: '#166534',
    image_bg_color: '#166534',
    is_active: true,
    position: 23
  },
  // #24 - Clasificación de Urgencia
  {
    title: 'Clasificación de Ticket',
    description: 'Clasifica la urgencia de un ticket de soporte',
    amount: 1.75,
    modal_title: '¡Clasifica el ticket!',
    modal_subtitle: `TICKET DE SOPORTE #4521:

"Buenos días, quería consultar si tienen disponible el manual de usuario del producto X en formato PDF. No es urgente, solo para tenerlo guardado. Gracias."

Clasifica la urgencia del ticket:
A) CRÍTICA - Sistema caído, afecta operaciones
B) ALTA - Problema importante, necesita solución pronto
C) MEDIA - Inconveniente moderado
D) BAJA - Consulta general, sin urgencia`,
    input_placeholder: 'Escribe la letra: A, B, C o D',
    input_label: 'Nivel de urgencia:',
    help_text: 'Analiza el contenido y tono del mensaje',
    instructions: 'Lee el ticket|Evalúa la urgencia|Selecciona el nivel|Confirma tu clasificación',
    partner_name: 'HelpDesk Pro',
    objective: 'Tu clasificación entrena nuestros sistemas de priorización automática',
    task_type: 'Encuesta',
    block_bg_color: '#1E40AF',
    image_bg_color: '#1E40AF',
    is_active: true,
    position: 24
  },

  // #25 - Verificación de Horario
  {
    title: 'Verificación de Horario',
    description: 'Verifica disponibilidad en un horario',
    amount: 1.00,
    modal_title: '¡Verifica el horario!',
    modal_subtitle: `AGENDA DEL DÍA:

09:00 - 10:00: Reunión de equipo
10:30 - 11:30: Llamada con cliente
12:00 - 13:00: Almuerzo
14:00 - 15:30: Presentación de proyecto
16:00 - 17:00: Revisión de informes

¿Hay disponibilidad para una reunión de 1 hora entre las 11:30 y las 14:00?
Escribe: SÍ o NO`,
    input_placeholder: 'Escribe: SÍ o NO',
    input_label: '¿Hay disponibilidad?',
    help_text: 'Busca un espacio libre de 1 hora en el rango indicado',
    instructions: 'Revisa la agenda|Busca espacios libres|Verifica si hay 1 hora disponible|Responde',
    partner_name: 'CalendarSync',
    objective: 'Tu verificación valida nuestros algoritmos de programación de citas',
    task_type: 'Formulario',
    block_bg_color: '#0F766E',
    image_bg_color: '#0F766E',
    is_active: true,
    position: 25
  },
  // #26 - Análisis de Competencia
  {
    title: 'Análisis Competitivo',
    description: 'Identifica la ventaja competitiva de un producto',
    amount: 2.25,
    modal_title: '¡Analiza la competencia!',
    modal_subtitle: `COMPARATIVA DE PRODUCTOS:

PRODUCTO A: $99 - 2 años garantía - Envío en 5 días
PRODUCTO B: $89 - 1 año garantía - Envío en 3 días
PRODUCTO C: $95 - 2 años garantía - Envío en 2 días
PRODUCTO D: $110 - 3 años garantía - Envío en 7 días

Si el cliente prioriza la RAPIDEZ DE ENTREGA, ¿cuál producto debería elegir?`,
    input_placeholder: 'Escribe la letra: A, B, C o D',
    input_label: 'Mejor opción:',
    help_text: 'Enfócate en el tiempo de envío',
    instructions: 'Lee todas las opciones|Compara tiempos de envío|Selecciona el más rápido|Confirma',
    partner_name: 'MarketAnalyzer',
    objective: 'Tu análisis mejora nuestras recomendaciones de productos',
    task_type: 'Texto',
    block_bg_color: '#A21CAF',
    image_bg_color: '#A21CAF',
    is_active: true,
    position: 26
  },

  // #27 - Extracción de Datos
  {
    title: 'Extracción de Datos',
    description: 'Extrae información específica de un texto',
    amount: 1.50,
    modal_title: '¡Extrae los datos!',
    modal_subtitle: `FACTURA:

Empresa: Tech Solutions S.A.
Fecha: 15 de noviembre de 2024
Número de factura: FAC-2024-0892
Total: $1,250.00 USD
Método de pago: Transferencia bancaria

Escribe el número de factura exactamente como aparece.`,
    input_placeholder: 'Ejemplo: FAC-XXXX-XXXX',
    input_label: 'Número de factura:',
    help_text: 'Copia el número exactamente como está escrito',
    instructions: 'Lee la factura|Localiza el número|Cópialo exactamente|Confirma',
    partner_name: 'DocExtract AI',
    objective: 'Tu extracción entrena nuestros sistemas de procesamiento de documentos',
    task_type: 'Formulario',
    block_bg_color: '#475569',
    image_bg_color: '#475569',
    is_active: true,
    position: 27
  },
  // #28 - Evaluación de App
  {
    title: 'Evaluación de App',
    description: 'Evalúa una descripción de aplicación móvil',
    amount: 2.00,
    modal_title: '¡Evalúa la app!',
    modal_subtitle: `DESCRIPCIÓN DE APP:

"FitTrack Pro - Tu compañero de fitness definitivo. Registra tus entrenamientos, cuenta calorías, monitorea tu sueño y conecta con amigos. Más de 500 ejercicios con videos. Sincroniza con tu smartwatch. ¡Descarga gratis!"

Del 1 al 10, ¿qué tan probable es que descargues esta app?
1-3 = Poco probable
4-6 = Tal vez
7-10 = Muy probable`,
    input_placeholder: 'Escribe un número del 1 al 10',
    input_label: 'Tu puntuación:',
    help_text: 'Considera si la descripción te genera interés',
    instructions: 'Lee la descripción|Evalúa tu interés|Asigna puntuación|Confirma',
    partner_name: 'AppStore Analytics',
    objective: 'Tu evaluación ayuda a optimizar descripciones de apps',
    task_type: 'Texto',
    block_bg_color: '#0284C7',
    image_bg_color: '#0284C7',
    is_active: true,
    position: 28
  },

  // #29 - Verificación de Stock
  {
    title: 'Verificación de Stock',
    description: 'Verifica si hay suficiente stock para un pedido',
    amount: 1.25,
    modal_title: '¡Verifica el stock!',
    modal_subtitle: `INVENTARIO ACTUAL:
- Camisetas talla S: 15 unidades
- Camisetas talla M: 8 unidades
- Camisetas talla L: 22 unidades
- Camisetas talla XL: 5 unidades

PEDIDO RECIBIDO:
- 10 camisetas talla M
- 5 camisetas talla XL

¿Se puede completar el pedido con el stock actual?
Escribe: SÍ o NO`,
    input_placeholder: 'Escribe: SÍ o NO',
    input_label: '¿Stock suficiente?',
    help_text: 'Compara las cantidades del pedido con el inventario',
    instructions: 'Revisa el inventario|Compara con el pedido|Verifica disponibilidad|Responde',
    partner_name: 'StockManager',
    objective: 'Tu verificación valida nuestros sistemas de gestión de inventario',
    task_type: 'Formulario',
    block_bg_color: '#65A30D',
    image_bg_color: '#65A30D',
    is_active: true,
    position: 29
  },
  // #30 - Análisis de Tendencia
  {
    title: 'Análisis de Tendencia',
    description: 'Identifica la tendencia en datos de ventas',
    amount: 1.75,
    modal_title: '¡Analiza la tendencia!',
    modal_subtitle: `VENTAS MENSUALES (en miles):

Enero: $45
Febrero: $52
Marzo: $48
Abril: $61
Mayo: $58
Junio: $72

¿Cuál es la tendencia general de las ventas?
A) Descendente (bajan constantemente)
B) Ascendente (suben en general)
C) Estable (se mantienen igual)
D) Irregular (sin patrón claro)`,
    input_placeholder: 'Escribe la letra: A, B, C o D',
    input_label: 'Tendencia identificada:',
    help_text: 'Observa el comportamiento general de los números',
    instructions: 'Revisa los datos|Identifica el patrón|Selecciona la tendencia|Confirma',
    partner_name: 'TrendAnalytics',
    objective: 'Tu análisis valida nuestros modelos de predicción de ventas',
    task_type: 'Encuesta',
    block_bg_color: '#C026D3',
    image_bg_color: '#C026D3',
    is_active: true,
    position: 30
  },

  // #31 - Validación de Código Postal
  {
    title: 'Validación de Dirección',
    description: 'Verifica si un código postal es válido',
    amount: 0.75,
    modal_title: '¡Valida el código postal!',
    modal_subtitle: `FORMATO DE CÓDIGO POSTAL VÁLIDO PARA MÉXICO:
- Debe tener exactamente 5 dígitos
- Solo números (sin letras ni espacios)

CÓDIGOS A VERIFICAR:
1) 06600
2) 1234
3) 45050
4) CP-12345
5) 77500

¿Cuántos códigos postales tienen formato VÁLIDO?`,
    input_placeholder: 'Escribe el número: 1, 2, 3, 4 o 5',
    input_label: 'Códigos válidos:',
    help_text: 'Cuenta solo los que cumplen ambos criterios',
    instructions: 'Lee los criterios|Revisa cada código|Cuenta los válidos|Escribe el total',
    partner_name: 'AddressVerify',
    objective: 'Tu validación mejora nuestros sistemas de verificación de direcciones',
    task_type: 'Formulario',
    block_bg_color: '#EA580C',
    image_bg_color: '#EA580C',
    is_active: true,
    position: 31
  },
  // #32 - Selección de Respuesta
  {
    title: 'Respuesta de Chatbot',
    description: 'Selecciona la mejor respuesta para un chatbot',
    amount: 2.25,
    modal_title: '¡Elige la mejor respuesta!',
    modal_subtitle: `PREGUNTA DEL USUARIO:
"¿Cuál es el horario de atención?"

OPCIONES DE RESPUESTA:
A) "No entiendo tu pregunta."
B) "Nuestro horario es de lunes a viernes de 9:00 a 18:00 hrs."
C) "¿Podrías reformular tu pregunta?"
D) "Gracias por contactarnos."
E) "El clima hoy está soleado."

¿Cuál es la respuesta más apropiada?`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Mejor respuesta:',
    help_text: 'Elige la que responde directamente la pregunta',
    instructions: 'Lee la pregunta|Analiza las opciones|Selecciona la más apropiada|Confirma',
    partner_name: 'ChatbotAI',
    objective: 'Tu selección entrena nuestros modelos de respuesta automática',
    task_type: 'Texto',
    block_bg_color: '#4338CA',
    image_bg_color: '#4338CA',
    is_active: true,
    position: 32
  },

  // #33 - Cálculo de Propina
  {
    title: 'Cálculo de Propina',
    description: 'Calcula la propina correcta para una cuenta',
    amount: 1.00,
    modal_title: '¡Calcula la propina!',
    modal_subtitle: `CUENTA DE RESTAURANTE:

Subtotal: $85.00
Propina sugerida: 15%

¿Cuánto sería la propina?
(Escribe solo el número, sin el símbolo $)`,
    input_placeholder: 'Ejemplo: 12.75',
    input_label: 'Monto de propina:',
    help_text: 'Calcula: Subtotal × 0.15',
    instructions: 'Lee el subtotal|Calcula el 15%|Escribe el resultado|Confirma',
    partner_name: 'TipCalculator',
    objective: 'Tu cálculo valida nuestras funciones de calculadora de propinas',
    task_type: 'Formulario',
    block_bg_color: '#15803D',
    image_bg_color: '#15803D',
    is_active: true,
    position: 33
  },
  // #34 - Identificación de Idioma
  {
    title: 'Identificación de Idioma',
    description: 'Identifica en qué idioma está escrito un texto',
    amount: 1.50,
    modal_title: '¡Identifica el idioma!',
    modal_subtitle: `TEXTO A ANALIZAR:

"Bonjour, comment allez-vous aujourd'hui? J'espère que vous passez une bonne journée."

¿En qué idioma está escrito este texto?

A) Español
B) Inglés
C) Francés
D) Italiano
E) Portugués`,
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Idioma identificado:',
    help_text: 'Analiza las palabras y estructura del texto',
    instructions: 'Lee el texto|Identifica palabras clave|Selecciona el idioma|Confirma',
    partner_name: 'LanguageDetect AI',
    objective: 'Tu identificación entrena nuestros sistemas de detección de idiomas',
    task_type: 'Texto',
    block_bg_color: '#BE185D',
    image_bg_color: '#BE185D',
    is_active: true,
    position: 34
  }
];


async function addOffers() {
  console.log('🚀 Agregando 27 nuevas ofertas personalizadas (posiciones 8-34)...\n');

  // Primero intentar agregar la columna instructions
  await addInstructionsColumn();

  for (const offer of newOffers) {
    try {
      // Verificar si ya existe una oferta en esa posición
      const { data: existing } = await supabase
        .from('custom_offers')
        .select('id')
        .eq('position', offer.position)
        .single();

      const offerData = {
        title: offer.title,
        description: offer.description,
        amount: offer.amount,
        image_url: offer.image_url || '',
        modal_title: offer.modal_title,
        modal_subtitle: offer.modal_subtitle,
        audio_url: offer.audio_url || '',
        video_url: offer.video_url || '',
        input_placeholder: offer.input_placeholder,
        input_label: offer.input_label,
        help_text: offer.help_text,
        partner_name: offer.partner_name,
        partner_logo: offer.partner_logo || '',
        objective: offer.objective,
        task_type: offer.task_type,
        block_bg_color: offer.block_bg_color,
        image_bg_color: offer.image_bg_color,
        is_active: offer.is_active,
        position: offer.position
      };

      if (existing) {
        console.log(`⚠️  Posición ${offer.position} ya existe, actualizando: ${offer.title}`);
        const { error } = await supabase
          .from('custom_offers')
          .update(offerData)
          .eq('position', offer.position);
        
        if (error) throw error;
        console.log(`✅ Actualizada: ${offer.title}`);
      } else {
        const { error } = await supabase
          .from('custom_offers')
          .insert([offerData]);
        
        if (error) throw error;
        console.log(`✅ Creada: ${offer.title} (Posición ${offer.position})`);
      }
    } catch (error) {
      console.error(`❌ Error con ${offer.title}:`, error.message);
    }
  }

  console.log('\n🎉 Proceso completado!');
  console.log('Las nuevas tareas aparecerán en el dashboard de los usuarios.');
  console.log('Total de tareas agregadas: 27 (posiciones 8-34)');
}

addOffers();
