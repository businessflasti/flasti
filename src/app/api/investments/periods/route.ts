import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Obtener todos los períodos
export async function GET() {
    try {
        const periods = await prisma.investmentPeriod.findMany({
            orderBy: { days: 'asc' }
        });

        // Si no hay períodos, crear los por defecto
        if (periods.length === 0) {
            const defaultPeriods = await prisma.investmentPeriod.createMany({
                data: [
                    { days: 30, rateAnnual: 5.0, enabled: true },
                    { days: 45, rateAnnual: 7.5, enabled: true },
                    { days: 90, rateAnnual: 12.0, enabled: true }
                ]
            });

            const newPeriods = await prisma.investmentPeriod.findMany({
                orderBy: { days: 'asc' }
            });

            return NextResponse.json(newPeriods);
        }

        return NextResponse.json(periods);
    } catch (error) {
        console.error("Error fetching periods:", error);
        return NextResponse.json(
            { error: "Error al obtener períodos" },
            { status: 500 }
        );
    }
}

// POST - Crear nuevo período (solo admin)
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (user?.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Acceso denegado" },
                { status: 403 }
            );
        }

        const data = await request.json();
        
        const period = await prisma.investmentPeriod.create({
            data
        });

        return NextResponse.json(period);
    } catch (error) {
        console.error("Error creating period:", error);
        return NextResponse.json(
            { error: "Error al crear período" },
            { status: 500 }
        );
    }
}
