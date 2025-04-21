// Servicio para conectar con OpenRouter API
// Documentación: https://openrouter.ai/docs

import { AIContentRequest, AIContentResponse } from './ai-service';

// Modelos gratuitos disponibles en OpenRouter
export enum OpenRouterModel {
  LLAMA3_8B = 'meta-llama/llama-3-8b-instruct',
  MISTRAL_7B = 'mistralai/mistral-7b-instruct',
  OPENCHAT = 'openchat/openchat-7b',
  GEMMA_7B = 'google/gemma-7b-it',
  PHI3_MINI = 'microsoft/phi-3-mini-4k-instruct'
}

export class OpenRouterService {
  private static instance: OpenRouterService;
  private readonly API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  private readonly DEFAULT_MODEL = OpenRouterModel.PHI3_MINI; // Modelo gratuito por defecto
  
  // Reemplazar con tu clave API de OpenRouter
  private readonly API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || '';
  
  private constructor() {}
  
  public static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
  }
  
  /**
   * Genera contenido utilizando OpenRouter API
   */
  public async generateContent(request: AIContentRequest): Promise<AIContentResponse> {
    try {
      // Construir el prompt basado en los parámetros de la solicitud
      const prompt = this.buildPrompt(request);
      
      // Configurar la solicitud a OpenRouter
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': window.location.origin, // Requerido por OpenRouter
          'X-Title': 'Flasti Content Generator' // Nombre de tu aplicación
        },
        body: JSON.stringify({
          model: this.DEFAULT_MODEL,
          messages: [
            { role: 'system', content: this.getSystemPrompt(request) },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: this.getMaxTokens(request.length),
          top_p: 1,
          stream: false
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error de OpenRouter:', errorData);
        throw new Error(`Error al generar contenido: ${response.status}`);
      }
      
      const data = await response.json();
      const generatedContent = data.choices[0].message.content.trim();
      
      // Generar sugerencias alternativas
      const suggestions = await this.generateSuggestions(request, generatedContent);
      
      return {
        content: generatedContent,
        suggestions
      };
    } catch (error) {
      console.error('Error al generar contenido con OpenRouter:', error);
      
      // Si hay un error, devolver un mensaje amigable y usar el servicio de respaldo
      return this.getFallbackResponse(request);
    }
  }
  
  /**
   * Construye el prompt para la solicitud a OpenRouter
   */
  private buildPrompt(request: AIContentRequest): string {
    let prompt = `Genera ${this.getContentTypeText(request.type)}`;
    
    if (request.type === 'social' && request.platform) {
      prompt += ` para ${this.getPlatformText(request.platform)}`;
    }
    
    prompt += ` sobre ${request.product} con un tono ${this.getToneText(request.tone)}`;
    prompt += ` y longitud ${this.getLengthText(request.length)}.`;
    
    if (request.audience) {
      prompt += ` La audiencia objetivo es: ${request.audience}.`;
    }
    
    if (request.keyPoints && request.keyPoints.length > 0) {
      prompt += ` Incluye los siguientes puntos clave:\\n`;
      request.keyPoints.forEach((point, index) => {
        prompt += `${index + 1}. ${point}\\n`;
      });
    }
    
    prompt += ` El contenido debe ser persuasivo y enfocado en promocionar ${request.product} como afiliado.`;
    prompt += ` Incluye un llamado a la acción con [TU ENLACE] donde iría el enlace de afiliado.`;
    
    return prompt;
  }
  
  /**
   * Obtiene el prompt del sistema según el tipo de contenido
   */
  private getSystemPrompt(request: AIContentRequest): string {
    const basePrompt = `Eres un experto en marketing de afiliados y creación de contenido persuasivo. Tu tarea es crear contenido de alta calidad para promocionar productos como afiliado.`;
    
    switch (request.type) {
      case 'social':
        return `${basePrompt} Especialízate en crear publicaciones atractivas para redes sociales que generen engagement y conversiones.`;
      case 'email':
        return `${basePrompt} Especialízate en redactar correos electrónicos persuasivos con altas tasas de apertura y conversión.`;
      case 'blog':
        return `${basePrompt} Especialízate en escribir artículos de blog informativos y persuasivos que posicionen bien en SEO y conviertan lectores en clientes.`;
      case 'ad':
        return `${basePrompt} Especialízate en crear anuncios publicitarios concisos y efectivos con alto CTR y conversión.`;
      default:
        return basePrompt;
    }
  }
  
  /**
   * Genera sugerencias alternativas basadas en el contenido original
   */
  private async generateSuggestions(request: AIContentRequest, originalContent: string): Promise<string[]> {
    try {
      // Si no hay API key, usar sugerencias de respaldo
      if (!this.API_KEY) {
        return this.getFallbackSuggestions(request);
      }
      
      const prompt = `Has generado el siguiente contenido para promocionar ${request.product}:\\n\\n"""\\n${originalContent}\\n"""\\n\\nAhora, genera 2 versiones alternativas del mismo contenido con un enfoque diferente pero manteniendo el mismo tono ${this.getToneText(request.tone)} y longitud. Cada versión debe ser única y persuasiva.`;
      
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Flasti Content Generator'
        },
        body: JSON.stringify({
          model: this.DEFAULT_MODEL,
          messages: [
            { role: 'system', content: this.getSystemPrompt(request) },
            { role: 'user', content: prompt }
          ],
          temperature: 0.8,
          max_tokens: this.getMaxTokens(request.length) * 2,
          top_p: 1,
          stream: false
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error al generar sugerencias: ${response.status}`);
      }
      
      const data = await response.json();
      const suggestionsText = data.choices[0].message.content.trim();
      
      // Procesar el texto para extraer las sugerencias
      // Buscar patrones como "Versión 1:", "Alternativa 1:", etc.
      const suggestionRegex = /(?:versión|alternativa|sugerencia|opción)\s*\d+\s*:?\s*([\s\S]*?)(?=(?:versión|alternativa|sugerencia|opción)\s*\d+\s*:?|$)/gi;
      const matches = [...suggestionsText.matchAll(suggestionRegex)];
      
      if (matches.length >= 2) {
        return matches.slice(0, 2).map(match => match[1].trim());
      }
      
      // Si no se encuentran patrones claros, dividir el texto en partes
      const parts = suggestionsText.split(/\n{2,}/);
      if (parts.length >= 2) {
        return parts.slice(0, 2).map(part => part.trim());
      }
      
      // Si todo falla, usar el texto completo como una sugerencia
      return [suggestionsText];
    } catch (error) {
      console.error('Error al generar sugerencias:', error);
      return this.getFallbackSuggestions(request);
    }
  }
  
  /**
   * Obtiene respuestas de respaldo en caso de error
   */
  private getFallbackResponse(request: AIContentRequest): AIContentResponse {
    // Respuestas predefinidas según el tipo de contenido
    const responses: Record<string, AIContentResponse> = {
      'social': {
        content: `¡Descubre ${request.product}! La herramienta que está revolucionando el mercado con soluciones innovadoras. Pruébalo hoy mismo y transforma tu experiencia. [TU ENLACE] #Innovación #Tecnología`,
        suggestions: [
          `¿Buscas optimizar tus resultados? ${request.product} es la respuesta que estabas esperando. Fácil de usar y con resultados inmediatos. ¡Haz clic para conocer más! [TU ENLACE]`,
          `${request.product}: La solución preferida por expertos. Únete a miles de usuarios satisfechos y lleva tu experiencia al siguiente nivel. [TU ENLACE]`
        ]
      },
      'email': {
        content: `Asunto: Descubre cómo ${request.product} puede transformar tu experiencia\n\nEstimado/a [Nombre],\n\nEspero que este correo te encuentre bien. Quiero compartir contigo una herramienta que ha transformado mi forma de trabajar: ${request.product}.\n\nCon características innovadoras y una interfaz intuitiva, ${request.product} te permite:\n• Optimizar tu tiempo\n• Mejorar tus resultados\n• Simplificar procesos complejos\n\nDescubre más aquí: [TU ENLACE]\n\nSaludos cordiales,\n[Tu Nombre]`,
        suggestions: [
          `Asunto: La herramienta que está cambiando las reglas del juego\n\nHola [Nombre],\n\nEn el mundo actual, mantenerse competitivo requiere las mejores herramientas. Por eso quiero recomendarte ${request.product}.\n\nDesde que lo descubrí, he notado:\n• Un aumento del 30% en mi productividad\n• Mejores resultados en menos tiempo\n• Una experiencia de usuario excepcional\n\nConoce más: [TU ENLACE]\n\nAtentamente,\n[Tu Nombre]`,
          `Asunto: Una solución que debes conocer\n\nHola [Nombre],\n\n¿Te gustaría optimizar tu trabajo diario? ${request.product} es la respuesta.\n\nEsta innovadora herramienta ofrece:\n• Funcionalidades avanzadas\n• Soporte técnico premium\n• Resultados comprobados\n\nHaz clic aquí para más información: [TU ENLACE]\n\nSaludos,\n[Tu Nombre]`
        ]
      },
      'blog': {
        content: `# Cómo ${request.product} Está Revolucionando el Mercado\n\nEn un mundo donde la innovación es constante, encontrar herramientas que realmente marquen la diferencia puede ser un desafío. Sin embargo, ${request.product} ha emergido como una solución que está transformando la manera en que interactuamos con la tecnología.\n\n## Características Destacadas\n\n${request.product} ofrece una combinación única de funcionalidades que lo distinguen de la competencia:\n\n1. **Interfaz Intuitiva**: Diseñada para usuarios de todos los niveles\n2. **Rendimiento Superior**: Optimizado para ofrecer resultados rápidos y precisos\n3. **Personalización Avanzada**: Adaptable a tus necesidades específicas\n\n## Beneficios Reales\n\nLos usuarios de ${request.product} reportan mejoras significativas en su experiencia:\n\n- Mayor productividad\n- Resultados de mayor calidad\n- Reducción de tiempo en tareas repetitivas\n\n## Cómo Empezar\n\nComenzar con ${request.product} es increíblemente sencillo:\n\n1. Visita [TU ENLACE]\n2. Crea tu cuenta\n3. Explora las funcionalidades\n4. Personaliza tu experiencia\n\n## Conclusión\n\n${request.product} representa una evolución en el mercado, ofreciendo soluciones innovadoras para desafíos cotidianos. Si buscas optimizar tu experiencia, esta herramienta merece tu atención.\n\n[Pruébalo hoy mismo](TU ENLACE) y descubre por qué tantos usuarios están cambiando a ${request.product}.`,
        suggestions: [
          `# Por Qué ${request.product} Es la Elección de los Expertos\n\nEn el competitivo panorama actual, los profesionales buscan constantemente herramientas que les brinden una ventaja. ${request.product} se ha posicionado como la opción preferida por expertos en diversos campos.\n\n## La Diferencia de ${request.product}\n\nLo que distingue a ${request.product} es su enfoque en:\n\n- **Simplicidad sin sacrificar potencia**: Interfaz limpia con funcionalidades avanzadas\n- **Innovación constante**: Actualizaciones regulares con nuevas características\n- **Soporte excepcional**: Asistencia personalizada cuando la necesitas\n\n## Testimonios de Usuarios\n\nLos usuarios de ${request.product} comparten experiencias notables:\n\n> "Desde que implementé ${request.product}, mi eficiencia ha aumentado un 40%. Una inversión que realmente vale la pena." - Ana M.\n\n## Cómo Maximizar tu Experiencia\n\nPara aprovechar al máximo ${request.product}:\n\n1. Explora los tutoriales disponibles\n2. Únete a la comunidad de usuarios\n3. Personaliza la configuración según tus necesidades\n\n## Conclusión\n\nSi buscas una solución que combine facilidad de uso con funcionalidades avanzadas, ${request.product} ofrece el equilibrio perfecto.\n\n[Descúbrelo ahora](TU ENLACE) y únete a la comunidad de usuarios satisfechos.`,
          `# Transformando Resultados con ${request.product}\n\nEn la búsqueda de herramientas que realmente impacten nuestros resultados, ${request.product} destaca como una solución innovadora que está redefiniendo estándares.\n\n## Características Revolucionarias\n\n${request.product} introduce conceptos que transforman la experiencia del usuario:\n\n1. **Automatización inteligente**: Reduce tareas repetitivas\n2. **Análisis avanzado**: Proporciona insights accionables\n3. **Escalabilidad**: Crece con tus necesidades\n\n## Impacto Medible\n\nLos beneficios de ${request.product} se traducen en resultados concretos:\n\n- Reducción de costos operativos\n- Mejora en la calidad de entregables\n- Optimización de procesos clave\n\n## Primeros Pasos\n\nComenzar tu viaje con ${request.product} es sencillo:\n\n1. Visita [TU ENLACE]\n2. Explora la versión de prueba gratuita\n3. Implementa gradualmente en tu flujo de trabajo\n\n## Reflexión Final\n\n${request.product} representa más que una herramienta; es un cambio de paradigma en cómo abordamos nuestros desafíos diarios.\n\n[Comienza hoy](TU ENLACE) y experimenta la diferencia que ${request.product} puede hacer en tus resultados.`
        ]
      },
      'ad': {
        content: `${request.product}: La solución innovadora que transforma resultados. Interfaz intuitiva, funcionalidades avanzadas y soporte premium. Prueba gratuita disponible. ¡Optimiza tu experiencia hoy! [TU ENLACE]`,
        suggestions: [
          `¿Buscas resultados excepcionales? ${request.product} ofrece todo lo que necesitas: rendimiento superior, personalización avanzada y facilidad de uso. Descúbrelo ahora: [TU ENLACE]`,
          `${request.product} - Revolucionando el mercado con soluciones inteligentes. Únete a miles de usuarios satisfechos y lleva tu experiencia al siguiente nivel. [TU ENLACE]`
        ]
      }
    };
    
    return responses[request.type] || responses['social'];
  }
  
  /**
   * Obtiene sugerencias de respaldo
   */
  private getFallbackSuggestions(request: AIContentRequest): string[] {
    const suggestions = {
      'social': [
        `¡${request.product} está cambiando las reglas del juego! Descubre por qué usuarios de todo el mundo lo están adoptando. Más información: [TU ENLACE] #Innovación`,
        `Optimiza tu experiencia con ${request.product}. Resultados superiores, interfaz intuitiva y soporte premium. ¡Haz clic para conocer más! [TU ENLACE]`
      ],
      'email': [
        `Asunto: Descubre el poder de ${request.product}\n\nHola [Nombre],\n\n¿Estás buscando optimizar tus resultados? ${request.product} ofrece la solución que necesitas.\n\nCaracterísticas destacadas:\n• Interfaz intuitiva\n• Resultados rápidos\n• Soporte premium\n\nMás información: [TU ENLACE]\n\nSaludos,\n[Tu Nombre]`,
        `Asunto: Una recomendación que transformará tu experiencia\n\nEstimado/a [Nombre],\n\nQuiero compartir contigo una herramienta que ha revolucionado mi trabajo: ${request.product}.\n\nBeneficios principales:\n• Mayor eficiencia\n• Resultados superiores\n• Facilidad de uso\n\nDescúbrelo aquí: [TU ENLACE]\n\nAtentamente,\n[Tu Nombre]`
      ],
      'blog': [
        `# ${request.product}: La Solución que Estabas Buscando\n\nEn el competitivo mercado actual, encontrar herramientas que realmente marquen la diferencia es esencial. ${request.product} ofrece una combinación única de funcionalidades que lo posicionan como líder en su categoría.\n\n## Características Principales\n\n- Interfaz intuitiva\n- Rendimiento optimizado\n- Personalización avanzada\n\n[Descubre más](TU ENLACE) y transforma tu experiencia hoy mismo.`,
        `# Maximiza tus Resultados con ${request.product}\n\n${request.product} está redefiniendo estándares con su enfoque innovador y funcionalidades avanzadas. Diseñado para usuarios exigentes, ofrece soluciones efectivas para desafíos cotidianos.\n\n## Por Qué Elegir ${request.product}\n\n1. Soporte excepcional\n2. Actualizaciones constantes\n3. Comunidad activa de usuarios\n\n[Pruébalo ahora](TU ENLACE) y únete a miles de usuarios satisfechos.`
      ],
      'ad': [
        `${request.product}: Transforma resultados con la solución preferida por expertos. Prueba gratuita disponible. [TU ENLACE]`,
        `Descubre ${request.product} - Innovación, simplicidad y rendimiento superior en una sola herramienta. [TU ENLACE]`
      ]
    };
    
    return suggestions[request.type] || suggestions['social'];
  }
  
  /**
   * Obtiene el texto descriptivo del tipo de contenido
   */
  private getContentTypeText(type: string): string {
    switch (type) {
      case 'social': return 'una publicación para redes sociales';
      case 'email': return 'un correo electrónico';
      case 'blog': return 'un artículo de blog';
      case 'ad': return 'un anuncio publicitario';
      default: return 'contenido';
    }
  }
  
  /**
   * Obtiene el texto descriptivo de la plataforma
   */
  private getPlatformText(platform: string): string {
    switch (platform) {
      case 'facebook': return 'Facebook';
      case 'instagram': return 'Instagram';
      case 'twitter': return 'Twitter (X)';
      case 'linkedin': return 'LinkedIn';
      default: return 'redes sociales';
    }
  }
  
  /**
   * Obtiene el texto descriptivo del tono
   */
  private getToneText(tone: string): string {
    switch (tone) {
      case 'professional': return 'profesional';
      case 'casual': return 'casual';
      case 'enthusiastic': return 'entusiasta';
      case 'informative': return 'informativo';
      default: return 'profesional';
    }
  }
  
  /**
   * Obtiene el texto descriptivo de la longitud
   */
  private getLengthText(length: string): string {
    switch (length) {
      case 'short': return 'corta';
      case 'medium': return 'media';
      case 'long': return 'larga';
      default: return 'media';
    }
  }
  
  /**
   * Obtiene el número máximo de tokens según la longitud
   */
  private getMaxTokens(length: string): number {
    switch (length) {
      case 'short': return 300;
      case 'medium': return 600;
      case 'long': return 1200;
      default: return 600;
    }
  }
}

export const openRouterService = OpenRouterService.getInstance();
