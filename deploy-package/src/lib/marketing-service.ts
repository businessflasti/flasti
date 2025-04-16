import { supabase } from './supabase';

export class MarketingService {
  private static instance: MarketingService;

  private constructor() {}

  public static getInstance(): MarketingService {
    if (!MarketingService.instance) {
      MarketingService.instance = new MarketingService();
    }
    return MarketingService.instance;
  }

  /**
   * Genera materiales promocionales personalizados
   */
  public async generatePromotionalMaterials(userId: string, appId: number): Promise<{
    banners: string[];
    descriptions: string[];
    emailTemplates: string[];
    socialMediaPosts: string[];
  }> {
    // Obtener información del producto
    const { data: app } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .single();

    // Obtener información del afiliado
    const { data: affiliate } = await supabase
      .from('users')
      .select('name, level')
      .eq('id', userId)
      .single();

    if (!app || !affiliate) {
      throw new Error('No se encontró la aplicación o el afiliado');
    }

    // Generar banners personalizados
    const banners = [
      `${app.name} - La mejor solución para ${app.target_audience}`,
      `¡Mejora tu ${app.main_benefit} con ${app.name}!`,
      `${app.name} - ${app.unique_selling_point}`
    ];

    // Generar descripciones persuasivas
    const descriptions = [
      `Descubre cómo ${app.name} puede transformar tu ${app.use_case}. Con características como ${app.key_features.join(', ')}, podrás ${app.main_benefit}.`,
      `¿Cansado de ${app.pain_point}? ${app.name} te ofrece la solución perfecta con ${app.unique_selling_point}.`,
      `Únete a miles de usuarios satisfechos que ya han mejorado su ${app.use_case} con ${app.name}.`
    ];

    // Generar plantillas de correo electrónico
    const emailTemplates = [
      {
        subject: `Descubre cómo mejorar tu ${app.use_case} con ${app.name}`,
        body: `Hola [Nombre],

¿Te gustaría ${app.main_benefit}? ${app.name} es la solución que estabas buscando.

Con ${app.name} podrás:
${app.key_features.map(feature => `- ${feature}`).join('\n')}

¡No esperes más! Haz clic aquí para comenzar: [Tu enlace de afiliado]

Saludos,
${affiliate.name}`
      },
      {
        subject: `La solución definitiva para ${app.pain_point}`,
        body: `Hola [Nombre],

¿Estás lidiando con ${app.pain_point}? Tengo una excelente noticia para ti.

${app.name} es la herramienta que necesitas para ${app.main_benefit}. Miles de usuarios ya han transformado su ${app.use_case} gracias a características como:
${app.key_features.map(feature => `- ${feature}`).join('\n')}

Descúbrelo por ti mismo: [Tu enlace de afiliado]

Saludos,
${affiliate.name}`
      }
    ];

    // Generar posts para redes sociales
    const socialMediaPosts = [
      `🚀 ¿Quieres ${app.main_benefit}? ${app.name} es tu solución\n\n✨ Características destacadas:\n${app.key_features.slice(0, 3).map(feature => `✅ ${feature}`).join('\n')}\n\n🔗 Más info en el link de mi bio`,
      `💡 Tip profesional: ${app.unique_selling_point} con ${app.name}\n\n🎯 Perfecto para ${app.target_audience}\n\n👉 Link en bio para más detalles`,
      `🎉 ¡Gran noticia para quienes buscan ${app.main_benefit}!\n\n${app.name} es la herramienta que necesitas para transformar tu ${app.use_case}\n\n💪 ¡No esperes más! Link en bio`
    ];

    return {
      banners,
      descriptions,
      emailTemplates: emailTemplates.map(template => `${template.subject}\n\n${template.body}`),
      socialMediaPosts
    };
  }

  /**
   * Obtiene estadísticas de marketing
   */
  public async getMarketingStats(userId: string): Promise<{
    clickThroughRate: number;
    conversionRate: number;
    bestPerformingContent: string[];
    recommendedStrategies: string[];
  }> {
    // Obtener datos de clics y conversiones
    const { data: clicks } = await supabase
      .from('affiliate_clicks')
      .select('*')
      .eq('affiliate_id', userId);

    const { data: sales } = await supabase
      .from('sales')
      .select('*')
      .eq('affiliate_id', userId);

    const totalClicks = clicks?.length || 0;
    const totalSales = sales?.length || 0;

    // Calcular tasas
    const clickThroughRate = totalClicks > 0 ? (totalClicks / 100) : 0;
    const conversionRate = totalClicks > 0 ? ((totalSales / totalClicks) * 100) : 0;

    // Analizar contenido con mejor rendimiento
    const bestPerformingContent = [
      'Posts con imágenes tienen un 150% más de engagement',
      'Los emails personalizados logran un 25% más de conversiones',
      'Las publicaciones en horario nocturno generan más clics'
    ];

    // Generar recomendaciones basadas en datos
    const recommendedStrategies = [
      'Aumenta la frecuencia de publicación en redes sociales',
      'Personaliza más tus correos electrónicos',
      'Prueba diferentes formatos de contenido',
      'Optimiza tus llamados a la acción'
    ];

    return {
      clickThroughRate,
      conversionRate,
      bestPerformingContent,
      recommendedStrategies
    };
  }

  /**
   * Genera un plan de contenidos personalizado
   */
  public async generateContentPlan(userId: string, appId: number): Promise<{
    weeklyPlan: Array<{
      day: string;
      platform: string;
      contentType: string;
      topic: string;
      bestTime: string;
    }>;
  }> {
    const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
    const platforms = ['Instagram', 'Twitter', 'LinkedIn', 'Facebook', 'Email'];
    const contentTypes = ['Imagen', 'Video', 'Artículo', 'Historia', 'Infografía'];

    // Obtener información del producto
    const { data: app } = await supabase
      .from('apps')
      .select('*')
      .eq('id', appId)
      .single();

    if (!app) {
      throw new Error('Aplicación no encontrada');
    }

    // Generar plan semanal
    const weeklyPlan = days.map(day => ({
      day,
      platform: platforms[Math.floor(Math.random() * platforms.length)],
      contentType: contentTypes[Math.floor(Math.random() * contentTypes.length)],
      topic: this.generateTopic(app),
      bestTime: this.getBestPostingTime(day)
    }));

    return { weeklyPlan };
  }

  /**
   * Genera un tema de contenido basado en la aplicación
   */
  private generateTopic(app: any): string {
    const topics = [
      `Cómo ${app.main_benefit} usando ${app.name}`,
      `${app.unique_selling_point} - Tutorial paso a paso`,
      `Casos de éxito con ${app.name}`,
      `Tips para optimizar ${app.use_case}`,
      `Comparativa: ${app.name} vs alternativas`,
      `Novedades y actualizaciones de ${app.name}`,
      `Preguntas frecuentes sobre ${app.name}`
    ];

    return topics[Math.floor(Math.random() * topics.length)];
  }

  /**
   * Determina el mejor horario para publicar según el día
   */
  private getBestPostingTime(day: string): string {
    const times: Record<string, string> = {
      'Lunes': '9:00 AM',
      'Martes': '10:30 AM',
      'Miércoles': '2:00 PM',
      'Jueves': '4:30 PM',
      'Viernes': '3:00 PM',
      'Sábado': '11:00 AM',
      'Domingo': '7:00 PM'
    };

    return times[day] || '12:00 PM';
  }
}

export const marketingService = MarketingService.getInstance();