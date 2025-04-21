// Servicio de IA para generación de contenido
// Utiliza OpenRouter para generar contenido con modelos de IA gratuitos
import { openRouterService } from './openrouter-service';

export interface AIContentRequest {
  type: 'social' | 'email' | 'blog' | 'ad';
  platform?: 'facebook' | 'instagram' | 'twitter' | 'linkedin';
  product: string;
  tone: 'professional' | 'casual' | 'enthusiastic' | 'informative';
  length: 'short' | 'medium' | 'long';
  keyPoints?: string[];
  audience?: string;
}

export interface AIContentResponse {
  content: string;
  suggestions: string[];
}

export class AIService {
  private static instance: AIService;

  private constructor() {}

  public static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Genera contenido utilizando IA a través de OpenRouter
   */
  public async generateContent(request: AIContentRequest): Promise<AIContentResponse> {
    try {
      // Intentar generar contenido con OpenRouter
      return await openRouterService.generateContent(request);
    } catch (error) {
      console.error('Error al generar contenido con OpenRouter:', error);

      // Si hay un error, mostrar mensaje y simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Devolver respuesta de respaldo
      return this.getFallbackResponse(request);
    }
  }

  /**
   * Proporciona una respuesta de respaldo en caso de error
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
        content: `Asunto: Descubre cómo ${request.product} puede transformar tu experiencia

Estimado/a [Nombre],

Espero que este correo te encuentre bien. Quiero compartir contigo una herramienta que ha transformado mi forma de trabajar: ${request.product}.

Con características innovadoras y una interfaz intuitiva, ${request.product} te permite:
• Optimizar tu tiempo
• Mejorar tus resultados
• Simplificar procesos complejos

Descubre más aquí: [TU ENLACE]

Saludos cordiales,
[Tu Nombre]`,
        suggestions: [
          `Asunto: La herramienta que está cambiando las reglas del juego

Hola [Nombre],

En el mundo actual, mantenerse competitivo requiere las mejores herramientas. Por eso quiero recomendarte ${request.product}.

Desde que lo descubrí, he notado:
• Un aumento del 30% en mi productividad
• Mejores resultados en menos tiempo
• Una experiencia de usuario excepcional

Conoce más: [TU ENLACE]

Atentamente,
[Tu Nombre]`
        ]
      },
      'blog': {
        content: `# Cómo ${request.product} Está Revolucionando el Mercado

En un mundo donde la innovación es constante, encontrar herramientas que realmente marquen la diferencia puede ser un desafío. Sin embargo, ${request.product} ha emergido como una solución que está transformando la manera en que interactuamos con la tecnología.

## Características Destacadas

${request.product} ofrece una combinación única de funcionalidades que lo distinguen de la competencia:

1. **Interfaz Intuitiva**: Diseñada para usuarios de todos los niveles
2. **Rendimiento Superior**: Optimizado para ofrecer resultados rápidos y precisos
3. **Personalización Avanzada**: Adaptable a tus necesidades específicas

## Beneficios Reales

Los usuarios de ${request.product} reportan mejoras significativas en su experiencia:

- Mayor productividad
- Resultados de mayor calidad
- Reducción de tiempo en tareas repetitivas

## Cómo Empezar

Comenzar con ${request.product} es increíblemente sencillo:

1. Visita [TU ENLACE]
2. Crea tu cuenta
3. Explora las funcionalidades
4. Personaliza tu experiencia

## Conclusión

${request.product} representa una evolución en el mercado, ofreciendo soluciones innovadoras para desafíos cotidianos. Si buscas optimizar tu experiencia, esta herramienta merece tu atención.

[Pruébalo hoy mismo](TU ENLACE) y descubre por qué tantos usuarios están cambiando a ${request.product}.`,
        suggestions: [
          `# Por Qué ${request.product} Es la Elección de los Expertos

En el competitivo panorama actual, los profesionales buscan constantemente herramientas que les brinden una ventaja. ${request.product} se ha posicionado como la opción preferida por expertos en diversos campos.

## La Diferencia de ${request.product}

Lo que distingue a ${request.product} es su enfoque en:

- **Simplicidad sin sacrificar potencia**: Interfaz limpia con funcionalidades avanzadas
- **Innovación constante**: Actualizaciones regulares con nuevas características
- **Soporte excepcional**: Asistencia personalizada cuando la necesitas

## Testimonios de Usuarios

Los usuarios de ${request.product} comparten experiencias notables:

> "Desde que implementé ${request.product}, mi eficiencia ha aumentado un 40%. Una inversión que realmente vale la pena." - Ana M.

## Cómo Maximizar tu Experiencia

Para aprovechar al máximo ${request.product}:

1. Explora los tutoriales disponibles
2. Únete a la comunidad de usuarios
3. Personaliza la configuración según tus necesidades

## Conclusión

Si buscas una solución que combine facilidad de uso con funcionalidades avanzadas, ${request.product} ofrece el equilibrio perfecto.

[Descúbrelo ahora](TU ENLACE) y únete a la comunidad de usuarios satisfechos.`
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
}

export const aiService = AIService.getInstance();
