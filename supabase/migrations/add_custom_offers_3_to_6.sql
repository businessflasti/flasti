-- Agregar 4 nuevas ofertas personalizadas (posiciones 3-6)
-- Tareas de tipo Texto/Encuesta/Formulario/Reseña (sin audio ni video)

-- Oferta #3: Clasificación de Reseña
INSERT INTO custom_offers (
  title, description, amount, image_url, modal_title, modal_subtitle,
  audio_url, video_url, input_placeholder, input_label, help_text,
  partner_name, partner_logo, objective, task_type,
  block_bg_color, image_bg_color, is_active, position
) VALUES (
  'Clasificación de Reseña',
  'Lee una reseña de cliente y clasifica su sentimiento',
  1.75,
  '',
  '¡Clasifica esta reseña!',
  'RESEÑA DEL CLIENTE:

"Compré este producto hace dos semanas y debo decir que superó mis expectativas. La calidad es excelente y el envío llegó antes de lo esperado. El empaque estaba perfecto y el producto funciona exactamente como se describe. Definitivamente lo recomendaría a mis amigos y familiares. El precio me pareció justo considerando la calidad que ofrece."

Clasifica esta reseña como: POSITIVA, NEGATIVA o NEUTRAL',
  '', '',
  'Escribe: POSITIVA, NEGATIVA o NEUTRAL',
  'Clasificación de la reseña:',
  'Analiza el tono general: ¿El cliente está satisfecho, insatisfecho o es neutral?',
  'ReviewAnalytics Co', '',
  'Tu clasificación entrena nuestros sistemas de análisis de sentimiento para mejorar la atención al cliente de empresas de e-commerce',
  'Reseña',
  '#2E7D32', '#2E7D32',
  true, 3
);

-- Oferta #4: Encuesta de Preferencias
INSERT INTO custom_offers (
  title, description, amount, image_url, modal_title, modal_subtitle,
  audio_url, video_url, input_placeholder, input_label, help_text,
  partner_name, partner_logo, objective, task_type,
  block_bg_color, image_bg_color, is_active, position
) VALUES (
  'Encuesta de Preferencias',
  'Responde una encuesta sobre hábitos de consumo digital',
  2.25,
  '',
  '¡Completa la encuesta!',
  'ENCUESTA DE INVESTIGACIÓN DE MERCADO

Pregunta: ¿Cuál de las siguientes plataformas utilizas con mayor frecuencia para ver contenido de entretenimiento?

A) Netflix
B) YouTube  
C) TikTok
D) Amazon Prime Video
E) Disney+

Escribe la letra de tu respuesta (A, B, C, D o E)',
  '', '',
  'Escribe la letra: A, B, C, D o E',
  'Tu respuesta:',
  'Selecciona la plataforma que más utilizas personalmente para entretenimiento',
  'MarketInsight Research', '',
  'Tus respuestas ayudan a empresas a entender mejor las preferencias de consumo digital de los usuarios latinoamericanos',
  'Encuesta',
  '#1565C0', '#1565C0',
  true, 4
);

-- Oferta #5: Verificación de Datos
INSERT INTO custom_offers (
  title, description, amount, image_url, modal_title, modal_subtitle,
  audio_url, video_url, input_placeholder, input_label, help_text,
  partner_name, partner_logo, objective, task_type,
  block_bg_color, image_bg_color, is_active, position
) VALUES (
  'Verificación de Datos',
  'Verifica la información de un registro empresarial',
  1.50,
  '',
  '¡Verifica estos datos!',
  'FICHA DE REGISTRO EMPRESARIAL

Empresa: TechSolutions Global S.A.
Sector: Tecnología y Software
País: México
Año de fundación: 2018
Empleados: 150-200
Sitio web: www.techsolutionsglobal.mx
Código de verificación: TSG-7842-MX

Escribe el código de verificación que aparece en la ficha.',
  '', '',
  'Ejemplo: ABC-1234-XX',
  'Código de verificación:',
  'Copia exactamente el código que aparece al final de la ficha de datos',
  'DataVerify Corp', '',
  'La verificación manual de datos garantiza la precisión de nuestra base de datos empresarial y previene errores de registro',
  'Formulario',
  '#C62828', '#C62828',
  true, 5
);

-- Oferta #6: Evaluación de Slogan
INSERT INTO custom_offers (
  title, description, amount, image_url, modal_title, modal_subtitle,
  audio_url, video_url, input_placeholder, input_label, help_text,
  partner_name, partner_logo, objective, task_type,
  block_bg_color, image_bg_color, is_active, position
) VALUES (
  'Evaluación de Slogan',
  'Evalúa la efectividad de un slogan publicitario',
  2.50,
  '',
  '¡Evalúa este slogan!',
  'EVALUACIÓN DE CAMPAÑA PUBLICITARIA

Una marca de bebidas energéticas está considerando el siguiente slogan para su nueva campaña:

"ENERGÍA QUE TE IMPULSA A CONQUISTAR TU DÍA"

Califica del 1 al 10 qué tan efectivo te parece este slogan, donde:
1-3 = Poco efectivo (no genera interés)
4-6 = Moderado (es aceptable pero no destaca)
7-10 = Muy efectivo (memorable y persuasivo)',
  '', '',
  'Escribe un número del 1 al 10',
  'Tu calificación (1-10):',
  'Considera: ¿Es memorable? ¿Transmite energía? ¿Te motivaría a probar el producto?',
  'AdCreative Agency', '',
  'Tu evaluación ayuda a las marcas a seleccionar los mensajes publicitarios más efectivos antes de lanzar sus campañas',
  'Texto',
  '#7B1FA2', '#7B1FA2',
  true, 6
);


-- Oferta #7: Juego Sky Dodge (Dificultad EXTREMA)
INSERT INTO custom_offers (
  title, description, amount, image_url, modal_title, modal_subtitle,
  audio_url, video_url, input_placeholder, input_label, help_text,
  partner_name, partner_logo, objective, task_type,
  block_bg_color, image_bg_color, is_active, position
) VALUES (
  'Sky Dodge Challenge',
  'Prueba tus reflejos en este desafío de habilidad extrema',
  10.00,
  '',
  '¡Desafío Sky Dodge!',
  'Pilotea tu avión a través de los rascacielos de la ciudad. Este es un desafío de habilidad extrema donde solo los mejores logran completarlo. ¿Tienes lo que se necesita?',
  '', '',
  '',
  '',
  'Alcanza 15 puntos para completar el desafío',
  'GameTest Labs', '',
  'Tu participación nos ayuda a calibrar la dificultad de nuestros juegos móviles antes de su lanzamiento oficial',
  'Juego',
  '#DC2626', '#DC2626',
  true, 7
);
