import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createClient } from '@supabase/supabase-js';

// Verificar variables de entorno
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL no está configurada');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY no está configurada');
}

// Cliente de Supabase con service role para operaciones admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * GET - Obtener todas las asignaciones de países
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/admin/country-mappings - Iniciando...');
    
    const { data: mappings, error } = await supabaseAdmin
      .from('country_offer_mappings')
      .select('*')
      .order('user_country', { ascending: true });

    if (error) {
      console.error('❌ Error fetching country mappings:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { success: false, error: error.message, details: error },
        { status: 500 }
      );
    }

    console.log(`✅ Mappings obtenidos: ${mappings?.length || 0}`);
    
    return NextResponse.json({
      success: true,
      data: mappings || [],
      count: mappings?.length || 0
    });
  } catch (error) {
    console.error('❌ Error in GET country mappings:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST - Crear o actualizar una asignación de país
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📝 POST /api/admin/country-mappings - Iniciando...');
    
    const body = await request.json();
    console.log('Body recibido:', body);
    
    const { user_country, offer_country, is_active, notes } = body;

    // Validaciones
    if (!user_country || !offer_country) {
      console.log('❌ Validación fallida: países faltantes');
      return NextResponse.json(
        { success: false, error: 'user_country y offer_country son requeridos' },
        { status: 400 }
      );
    }

    if (user_country.length !== 2 || offer_country.length !== 2) {
      console.log('❌ Validación fallida: longitud incorrecta');
      return NextResponse.json(
        { success: false, error: 'Los códigos de país deben tener 2 caracteres' },
        { status: 400 }
      );
    }

    console.log(`🔍 Verificando si existe asignación para ${user_country}...`);
    
    // Verificar si ya existe una asignación para este país
    const { data: existing, error: existingError } = await supabaseAdmin
      .from('country_offer_mappings')
      .select('id')
      .eq('user_country', user_country.toUpperCase())
      .maybeSingle();

    if (existingError) {
      console.error('❌ Error verificando existente:', existingError);
      throw existingError;
    }

    console.log('Existing:', existing);

    let result;

    if (existing) {
      console.log(`📝 Actualizando asignación existente: ${existing.id}`);
      
      // Actualizar existente
      const { data, error } = await supabaseAdmin
        .from('country_offer_mappings')
        .update({
          offer_country: offer_country.toUpperCase(),
          is_active: is_active !== undefined ? is_active : true,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', existing.id)
        .select()
        .single();

      if (error) {
        console.error('❌ Error actualizando:', error);
        throw error;
      }
      result = data;
      console.log('✅ Asignación actualizada');
    } else {
      console.log('➕ Creando nueva asignación...');
      
      // Crear nuevo
      const { data, error } = await supabaseAdmin
        .from('country_offer_mappings')
        .insert({
          user_country: user_country.toUpperCase(),
          offer_country: offer_country.toUpperCase(),
          is_active: is_active !== undefined ? is_active : true,
          notes: notes || null
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error insertando:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      result = data;
      console.log('✅ Asignación creada');
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: existing ? 'Asignación actualizada' : 'Asignación creada'
    });
  } catch (error) {
    console.error('❌ Error in POST country mapping:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.error('Error message:', errorMessage);
    
    return NextResponse.json(
      { success: false, error: errorMessage, details: error },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Eliminar una asignación de país
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID es requerido' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('country_offer_mappings')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Asignación eliminada'
    });
  } catch (error) {
    console.error('Error in DELETE country mapping:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
