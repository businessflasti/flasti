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
    const { data: funds, error } = await supabaseAdmin
      .from("fund_allocation")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(funds || []);
  } catch (error) {
    console.error("Error fetching funds:", error);
    return NextResponse.json({ error: "Error al cargar destino de fondos" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { funds } = await request.json();

    for (const fund of funds) {
      const { error } = await supabaseAdmin
        .from("fund_allocation")
        .update({
          name: fund.name,
          description: fund.description,
          percentage: fund.percentage,
          icon_type: fund.icon_type,
          color_from: fund.color_from,
          color_to: fund.color_to,
          display_order: fund.display_order,
          is_active: fund.is_active,
        })
        .eq("id", fund.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating funds:", error);
    return NextResponse.json({ error: "Error al actualizar fondos" }, { status: 500 });
  }
}
