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
    const { data: metrics, error } = await supabaseAdmin
      .from("investment_metrics")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(metrics || []);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json({ error: "Error al cargar métricas" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { metrics } = await request.json();

    for (const metric of metrics) {
      const { error } = await supabaseAdmin
        .from("investment_metrics")
        .update({
          label: metric.label,
          value: metric.value,
          display_order: metric.display_order,
          is_active: metric.is_active,
        })
        .eq("id", metric.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating metrics:", error);
    return NextResponse.json({ error: "Error al actualizar métricas" }, { status: 500 });
  }
}
