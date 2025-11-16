import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Obtener configuración actual
export async function GET() {
    try {
        let config = await prisma.investmentConfig.findFirst();
        
        if (!config) {
            // Crear configuración por defecto si no existe
            config = await prisma.investmentConfig.create({
                data: {
                    currentValue: 132.25,
                    dailyChange: 2.5,
                    minInvestment: 5,
                    maxInvestment: 10000,
                    isSystemLocked: false
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error("Error fetching investment config:", error);
        return NextResponse.json(
            { error: "Error al obtener configuración" },
            { status: 500 }
        );
    }
}

// PUT - Actualizar configuración (solo admin)
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        // Verificar si es admin
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
        
        const config = await prisma.investmentConfig.findFirst();
        
        if (!config) {
            const newConfig = await prisma.investmentConfig.create({
                data
            });
            return NextResponse.json(newConfig);
        }

        const updatedConfig = await prisma.investmentConfig.update({
            where: { id: config.id },
            data
        });

        return NextResponse.json(updatedConfig);
    } catch (error) {
        console.error("Error updating investment config:", error);
        return NextResponse.json(
            { error: "Error al actualizar configuración" },
            { status: 500 }
        );
    }
}
