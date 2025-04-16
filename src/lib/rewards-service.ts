import { supabase } from './supabase';

export class RewardsService {
  private static instance: RewardsService;

  private constructor() {}

  public static getInstance(): RewardsService {
    if (!RewardsService.instance) {
      RewardsService.instance = new RewardsService();
    }
    return RewardsService.instance;
  }

  /**
   * Calcula el nivel del afiliado basado en su rendimiento
   */
  public async calculateAffiliateLevel(userId: string): Promise<{
    level: number;
    progress: number;
    nextLevelRequirements: {
      sales: number;
      commission: number;
    };
  }> {
    // Obtener historial de ventas del afiliado
    const { data: sales } = await supabase
      .from('sales')
      .select('amount, commission')
      .eq('affiliate_id', userId);

    const totalSales = sales?.length || 0;
    const totalCommission = sales?.reduce((sum, sale) => sum + sale.commission, 0) || 0;

    // Definir requisitos para cada nivel
    const levelRequirements = [
      { level: 1, sales: 0, commission: 0 },      // Nivel Inicial
      { level: 2, sales: 5, commission: 1000 },    // Nivel Plata
      { level: 3, sales: 15, commission: 5000 },   // Nivel Oro
      { level: 4, sales: 30, commission: 15000 },  // Nivel Platino
      { level: 5, sales: 50, commission: 30000 },  // Nivel Diamante
    ];

    // Encontrar el nivel actual
    let currentLevel = 1;
    for (const req of levelRequirements) {
      if (totalSales >= req.sales && totalCommission >= req.commission) {
        currentLevel = req.level;
      } else {
        break;
      }
    }

    // Calcular progreso hacia el siguiente nivel
    const currentReq = levelRequirements[currentLevel - 1];
    const nextReq = levelRequirements[currentLevel] || currentReq;
    
    const salesProgress = Math.min(100, ((totalSales - currentReq.sales) / (nextReq.sales - currentReq.sales)) * 100);
    const commissionProgress = Math.min(100, ((totalCommission - currentReq.commission) / (nextReq.commission - currentReq.commission)) * 100);
    
    const progress = Math.min(100, (salesProgress + commissionProgress) / 2);

    return {
      level: currentLevel,
      progress: Math.round(progress),
      nextLevelRequirements: {
        sales: nextReq.sales - totalSales,
        commission: nextReq.commission - totalCommission
      }
    };
  }

  /**
   * Obtiene los beneficios del nivel actual
   */
  public getLevelBenefits(level: number): {
    commissionBonus: number;
    benefits: string[];
  } {
    const levelBenefits = {
      1: {
        commissionBonus: 0,
        benefits: [
          'Acceso al panel de afiliados',
          'Enlaces de afiliado personalizados',
          'Estadísticas básicas'
        ]
      },
      2: {
        commissionBonus: 5, // 5% extra
        benefits: [
          'Todos los beneficios del nivel anterior',
          'Comisión base aumentada en 5%',
          'Acceso a estadísticas avanzadas',
          'Soporte prioritario'
        ]
      },
      3: {
        commissionBonus: 10, // 10% extra
        benefits: [
          'Todos los beneficios del nivel anterior',
          'Comisión base aumentada en 10%',
          'Acceso temprano a nuevos productos',
          'Materiales promocionales exclusivos',
          'Webinars mensuales de estrategia'
        ]
      },
      4: {
        commissionBonus: 15, // 15% extra
        benefits: [
          'Todos los beneficios del nivel anterior',
          'Comisión base aumentada en 15%',
          'Gestor de cuenta dedicado',
          'Acceso a eventos VIP',
          'Herramientas premium de marketing'
        ]
      },
      5: {
        commissionBonus: 20, // 20% extra
        benefits: [
          'Todos los beneficios del nivel anterior',
          'Comisión base aumentada en 20%',
          'Reuniones estratégicas personalizadas',
          'Acceso a productos beta',
          'Oportunidades de co-marketing',
          'Invitaciones a eventos exclusivos'
        ]
      }
    };

    return levelBenefits[level as keyof typeof levelBenefits] || levelBenefits[1];
  }

  /**
   * Otorga recompensas por logros específicos
   */
  public async grantAchievementReward(userId: string, achievementType: string): Promise<{
    success: boolean;
    reward?: {
      type: string;
      value: number;
      description: string;
    };
  }> {
    try {
      // Verificar si el logro ya fue recompensado
      const { data: existingAchievement } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userId)
        .eq('type', achievementType)
        .single();

      if (existingAchievement) {
        return { success: false };
      }

      // Definir recompensa según el tipo de logro
      const rewards = {
        first_sale: {
          type: 'bonus',
          value: 50,
          description: 'Bono por primera venta'
        },
        ten_sales: {
          type: 'commission_boost',
          value: 5,
          description: 'Aumento de comisión temporal por 10 ventas'
        },
        high_conversion: {
          type: 'bonus',
          value: 100,
          description: 'Bono por alta tasa de conversión'
        }
      };

      const reward = rewards[achievementType as keyof typeof rewards];
      if (!reward) {
        return { success: false };
      }

      // Registrar el logro
      await supabase.from('achievements').insert({
        user_id: userId,
        type: achievementType,
        reward_type: reward.type,
        reward_value: reward.value,
        achieved_at: new Date().toISOString()
      });

      // Aplicar la recompensa según el tipo
      if (reward.type === 'bonus') {
        await this.addBonus(userId, reward.value);
      } else if (reward.type === 'commission_boost') {
        await this.addTemporaryCommissionBoost(userId, reward.value);
      }

      return { success: true, reward };
    } catch (error) {
      console.error('Error al otorgar recompensa:', error);
      return { success: false };
    }
  }

  /**
   * Añade un bono al balance del afiliado
   */
  private async addBonus(userId: string, amount: number): Promise<void> {
    await supabase.rpc('add_affiliate_bonus', {
      p_user_id: userId,
      p_amount: amount
    });
  }

  /**
   * Añade un impulso temporal a la comisión del afiliado
   */
  private async addTemporaryCommissionBoost(
    userId: string,
    percentage: number,
    durationDays: number = 7
  ): Promise<void> {
    await supabase.from('commission_boosts').insert({
      user_id: userId,
      percentage,
      start_date: new Date().toISOString(),
      end_date: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
    });
  }
}

export const rewardsService = RewardsService.getInstance();