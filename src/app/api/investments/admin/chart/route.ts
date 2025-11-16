import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

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
    const { data: chartData, error } = await supabaseAdmin
      .from("chart_data_points")
      .select("*")
      .order("period", { ascending: true })
      .order("order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(chartData || []);
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return NextResponse.json({ error: "Error al cargar datos del gráfico" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { chartData } = await request.json();

    for (const point of chartData) {
      const { error } = await supabaseAdmin
        .from("chart_data_points")
        .update({
          month: point.month,
          value: point.value,
          order: point.order,
          period: point.period,
          is_active: point.is_active,
        })
        .eq("id", point.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating chart data:", error);
    return NextResponse.json({ error: "Error al actualizar gráfico" }, { status: 500 });
  }
}
