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
    const { data: faqs, error } = await supabaseAdmin
      .from("investment_faqs")
      .select("*")
      .order("order", { ascending: true});

    if (error) throw error;

    return NextResponse.json(faqs || []);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return NextResponse.json({ error: "Error al cargar FAQs" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { faqs } = await request.json();

    for (const faq of faqs) {
      const { error } = await supabaseAdmin
        .from("investment_faqs")
        .update({
          question: faq.question,
          answer: faq.answer,
          order: faq.order,
          enabled: faq.enabled,
        })
        .eq("id", faq.id);

      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating FAQs:", error);
    return NextResponse.json({ error: "Error al actualizar FAQs" }, { status: 500 });
  }
}
