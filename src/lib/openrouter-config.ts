// Este archivo contiene la configuración para la integración con OpenRouter
// Para usar esta integración, necesitas una API key de OpenRouter (https://openrouter.ai/)

export const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// En una implementación real, esta clave se obtendría de variables de entorno
// Por ahora, dejamos un placeholder
export const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

// Modelos recomendados para diferentes tipos de contenido
export const RECOMMENDED_MODELS = {
  social: 'anthropic/claude-3-haiku',
  email: 'anthropic/claude-3-sonnet',
  blog: 'anthropic/claude-3-opus',
  ad: 'anthropic/claude-3-haiku'
};

// Configuración por defecto para las solicitudes a OpenRouter
export const DEFAULT_CONFIG = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'HTTP-Referer': 'https://flasti.com',
    'X-Title': 'Flasti Content Generator'
  },
  max_tokens: 1000,
  temperature: 0.7,
  top_p: 0.9
};

// Prompts por defecto para diferentes tipos de contenido
export const DEFAULT_PROMPTS = {
  social: `Eres un experto en marketing de afiliados y creación de contenido para redes sociales. 
  Tu tarea es crear una publicación persuasiva y atractiva para promocionar un producto como afiliado.
  La publicación debe ser concisa, incluir un llamado a la acción claro y adaptarse al tono y estilo de la plataforma.`,
  
  email: `Eres un experto en email marketing para programas de afiliados.
  Tu tarea es crear un correo electrónico persuasivo que promocione un producto como afiliado.
  El correo debe tener un asunto atractivo, introducción que genere interés, beneficios claros del producto,
  testimonios o pruebas sociales si es posible, un llamado a la acción claro y una firma profesional.`,
  
  blog: `Eres un experto en creación de contenido para blogs y marketing de afiliados.
  Tu tarea es crear un artículo de blog informativo y persuasivo que promocione sutilmente un producto como afiliado.
  El artículo debe proporcionar valor real al lector, establecer autoridad en el tema, incluir subtítulos claros,
  incorporar naturalmente enlaces de afiliado y terminar con un llamado a la acción.`,
  
  ad: `Eres un experto en copywriting para anuncios publicitarios de afiliados.
  Tu tarea es crear un anuncio persuasivo y conciso que genere clics y conversiones.
  El anuncio debe captar la atención rápidamente, destacar un beneficio clave, crear sensación de urgencia
  y terminar con un llamado a la acción claro.`
};
