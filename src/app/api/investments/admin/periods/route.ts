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
    const { data: periods, error } = await supabaseAdmin
      .from("investment_periods")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return NextResponse.json(periods || []);
  } catch (error) {
    console.error("Error fetching periods:", error);
    return NextResponse.json({ error: "Error al cargar períodos" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { periods } = await request.json();

    for (const period of periods) {
      const { error } = await supabaseAdmin
        .from("investment_periods")
        .update({
          days: period.days,
          annual_rate: period.annual_rate,
          is_active: period.is_active,
          is_recommended: period.is_recommended,
          display_order: period.display_order,
          label: period.label,
          description: period.description,
        })
        .eq("id", period.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating periods:", error);
    return NextResponse.json({ error: "Error al actualizar períodos" }, { status: 500 });
  }
}
