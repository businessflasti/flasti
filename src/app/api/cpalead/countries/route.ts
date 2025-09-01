import { NextResponse } from 'next/server';
import { getAllOffersFromCpaLead } from '@/lib/cpa-lead-api';

export async function GET() {
  try {
    const offers = await getAllOffersFromCpaLead(false);
    const set = new Set<string>();
    offers.forEach((o: any) => {
      if (o && Array.isArray(o.countries)) {
        o.countries.forEach((c: string) => set.add(c));
      }
    });

    const countries = Array.from(set).sort();
    return NextResponse.json({ success: true, countries });
  } catch (error) {
    console.error('API cpalead countries error:', error);
    return NextResponse.json({ success: false, countries: [], error: error instanceof Error ? error.message : String(error) }, { status: 500 });
  }
}
