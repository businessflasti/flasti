// Script para agregar las 4 nuevas ofertas personalizadas
// Ejecutar con: node scripts/add-custom-offers.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newOffers = [
  {
    title: 'Clasificación de Reseña',
    description: 'Lee una reseña de cliente y clasifica su sentimiento',
    amount: 1.75,
    image_url: '',
    modal_title: '¡Clasifica esta reseña!',
    modal_subtitle: `RESEÑA DEL CLIENTE:

"Compré este producto hace dos semanas y debo decir que superó mis expectativas. La calidad es excelente y el envío llegó antes de lo esperado. El empaque estaba perfecto y el producto funciona exactamente como se describe. Definitivamente lo recomendaría a mis amigos y familiares. El precio me pareció justo considerando la calidad que ofrece."

Clasifica esta reseña como: POSITIVA, NEGATIVA o NEUTRAL`,
    audio_url: '',
    video_url: '',
    input_placeholder: 'Escribe: POSITIVA, NEGATIVA o NEUTRAL',
    input_label: 'Clasificación de la reseña:',
    help_text: 'Analiza el tono general: ¿El cliente está satisfecho, insatisfecho o es neutral?',
    partner_name: 'ReviewAnalytics Co',
    partner_logo: '',
    objective: 'Tu clasificación entrena nuestros sistemas de análisis de sentimiento para mejorar la atención al cliente de empresas de e-commerce',
    task_type: 'Reseña',
    block_bg_color: '#2E7D32',
    image_bg_color: '#2E7D32',
    is_active: true,
    position: 3
  },
  {
    title: 'Sky Dodge Challenge',
    description: 'Prueba tus reflejos en este desafío de habilidad extrema',
    amount: 10.00,
    image_url: '',
    modal_title: '¡Desafío Sky Dodge!',
    modal_subtitle: 'Pilotea tu avión a través de los rascacielos de la ciudad. Este es un desafío de habilidad extrema donde solo los mejores logran completarlo. ¿Tienes lo que se necesita?',
    audio_url: '',
    video_url: '',
    input_placeholder: '',
    input_label: '',
    help_text: 'Alcanza 15 puntos para completar el desafío',
    partner_name: 'GameTest Labs',
    partner_logo: '',
    objective: 'Tu participación nos ayuda a calibrar la dificultad de nuestros juegos móviles antes de su lanzamiento oficial',
    task_type: 'Juego',
    block_bg_color: '#DC2626',
    image_bg_color: '#DC2626',
    is_active: true,
    position: 7
  },
  {
    title: 'Encuesta de Preferencias',
    description: 'Responde una encuesta sobre hábitos de consumo digital',
    amount: 2.25,
    image_url: '',
    modal_title: '¡Completa la encuesta!',
    modal_subtitle: `ENCUESTA DE INVESTIGACIÓN DE MERCADO

Pregunta: ¿Cuál de las siguientes plataformas utilizas con mayor frecuencia para ver contenido de entretenimiento?

A) Netflix
B) YouTube  
C) TikTok
D) Amazon Prime Video
E) Disney+

Escribe la letra de tu respuesta (A, B, C, D o E)`,
    audio_url: '',
    video_url: '',
    input_placeholder: 'Escribe la letra: A, B, C, D o E',
    input_label: 'Tu respuesta:',
    help_text: 'Selecciona la plataforma que más utilizas personalmente para entretenimiento',
    partner_name: 'MarketInsight Research',
    partner_logo: '',
    objective: 'Tus respuestas ayudan a empresas a entender mejor las preferencias de consumo digital de los usuarios latinoamericanos',
    task_type: 'Encuesta',
    block_bg_color: '#1565C0',
    image_bg_color: '#1565C0',
    is_active: true,
    position: 4
  },
  {
    title: 'Verificación de Datos',
    description: 'Verifica la información de un registro empresarial',
    amount: 1.50,
    image_url: '',
    modal_title: '¡Verifica estos datos!',
    modal_subtitle: `FICHA DE REGISTRO EMPRESARIAL

Empresa: TechSolutions Global S.A.
Sector: Tecnología y Software
País: México
Año de fundación: 2018
Empleados: 150-200
Sitio web: www.techsolutionsglobal.mx
Código de verificación: TSG-7842-MX

Escribe el código de verificación que aparece en la ficha.`,
    audio_url: '',
    video_url: '',
    input_placeholder: 'Ejemplo: ABC-1234-XX',
    input_label: 'Código de verificación:',
    help_text: 'Copia exactamente el código que aparece al final de la ficha de datos',
    partner_name: 'DataVerify Corp',
    partner_logo: '',
    objective: 'La verificación manual de datos garantiza la precisión de nuestra base de datos empresarial y previene errores de registro',
    task_type: 'Formulario',
    block_bg_color: '#C62828',
    image_bg_color: '#C62828',
    is_active: true,
    position: 5
  },
  {
    title: 'Evaluación de Slogan',
    description: 'Evalúa la efectividad de un slogan publicitario',
    amount: 2.50,
    image_url: '',
    modal_title: '¡Evalúa este slogan!',
    modal_subtitle: `EVALUACIÓN DE CAMPAÑA PUBLICITARIA

Una marca de bebidas energéticas está considerando el siguiente slogan para su nueva campaña:

"ENERGÍA QUE TE IMPULSA A CONQUISTAR TU DÍA"

Califica del 1 al 10 qué tan efectivo te parece este slogan, donde:
1-3 = Poco efectivo (no genera interés)
4-6 = Moderado (es aceptable pero no destaca)
7-10 = Muy efectivo (memorable y persuasivo)`,
    audio_url: '',
    video_url: '',
    input_placeholder: 'Escribe un número del 1 al 10',
    input_label: 'Tu calificación (1-10):',
    help_text: 'Considera: ¿Es memorable? ¿Transmite energía? ¿Te motivaría a probar el producto?',
    partner_name: 'AdCreative Agency',
    partner_logo: '',
    objective: 'Tu evaluación ayuda a las marcas a seleccionar los mensajes publicitarios más efectivos antes de lanzar sus campañas',
    task_type: 'Texto',
    block_bg_color: '#7B1FA2',
    image_bg_color: '#7B1FA2',
    is_active: true,
    position: 6
  }
];

async function addOffers() {
  console.log('🚀 Agregando 4 nuevas ofertas personalizadas...\n');

  for (const offer of newOffers) {
    try {
      // Verificar si ya existe una oferta en esa posición
      const { data: existing } = await supabase
        .from('custom_offers')
        .select('id')
        .eq('position', offer.position)
        .single();

      if (existing) {
        console.log(`⚠️  Posición ${offer.position} ya existe, actualizando: ${offer.title}`);
        const { error } = await supabase
          .from('custom_offers')
          .update(offer)
          .eq('position', offer.position);
        
        if (error) throw error;
        console.log(`✅ Actualizada: ${offer.title}`);
      } else {
        const { error } = await supabase
          .from('custom_offers')
          .insert([offer]);
        
        if (error) throw error;
        console.log(`✅ Creada: ${offer.title} (Posición ${offer.position})`);
      }
    } catch (error) {
      console.error(`❌ Error con ${offer.title}:`, error.message);
    }
  }

  console.log('\n🎉 Proceso completado!');
  console.log('Las nuevas tareas aparecerán en el dashboard de los usuarios.');
}

addOffers();
