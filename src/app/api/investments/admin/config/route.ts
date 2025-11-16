import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Cliente con service role para operaciones de admin
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    const { data: config, error } = await supabaseAdmin
      .from("investment_config")
      .select("*")
      .single();

    if (error) throw error;

    return NextResponse.json(config);
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json({ error: "Error al cargar configuración" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const config = await request.json();

    console.log("Received config:", config);

    // Primero verificar si existe el registro
    const { data: existing, error: selectError } = await supabaseAdmin
      .from("investment_config")
      .select("id")
      .limit(1)
      .single();

    if (selectError) {
      console.error("Error checking existing config:", selectError);
      return NextResponse.json({ error: "Error al verificar configuración: " + selectError.message }, { status: 500 });
    }

    console.log("Existing config ID:", existing?.id);

    // Actualizar usando el ID existente
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("investment_config")
      .update({
        min_investment: config.min_investment,
        max_investment: config.max_investment,
        active_users_count: config.active_users_count,
        total_capital_invested: config.total_capital_invested,
        launch_date: config.launch_date,
        rating: config.rating,
        token_name: config.token_name,
        token_description: config.token_description,
        hero_title: config.hero_title,
        hero_subtitle: config.hero_subtitle,
        token_current_value: config.token_current_value,
        token_daily_change: config.token_daily_change,
        token_daily_change_percentage: config.token_daily_change_percentage,
      })
      .eq("id", existing.id)
      .select();

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json({ error: "Error al actualizar: " + updateError.message }, { status: 500 });
    }

    console.log("Updated successfully:", updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Error updating config:", error);
    return NextResponse.json({ 
      error: "Error al actualizar configuración", 
      details: error.message || String(error) 
    }, { status: 500 });
  }
}
