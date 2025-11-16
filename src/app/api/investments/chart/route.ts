import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Obtener datos del gráfico
export async function GET() {
    try {
        const chartData = await prisma.chartDataPoint.findMany({
            orderBy: { order: 'asc' }
        });

        // Si no hay datos, crear datos por defecto
        if (chartData.length === 0) {
            const defaultData = [
                { month: "Ene", value: 120, order: 1 },
                { month: "Feb", value: 125, order: 2 },
                { month: "Mar", value: 122, order: 3 },
                { month: "Abr", value: 128, order: 4 },
                { month: "May", value: 130, order: 5 },
                { month: "Jun", value: 132.25, order: 6 }
            ];

            await prisma.chartDataPoint.createMany({
                data: defaultData
            });

            const newData = await prisma.chartDataPoint.findMany({
                orderBy: { order: 'asc' }
            });

            return NextResponse.json(newData);
        }

        return NextResponse.json(chartData);
    } catch (error) {
        console.error("Error fetching chart data:", error);
        return NextResponse.json(
            { error: "Error al obtener datos del gráfico" },
            { status: 500 }
        );
    }
}

// POST - Actualizar datos del gráfico (solo admin)
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

        const { data } = await request.json();

        // Eliminar datos existentes y crear nuevos
        await prisma.chartDataPoint.deleteMany();
        
        await prisma.chartDataPoint.createMany({
            data: data.map((point: any, index: number) => ({
                month: point.month,
                value: point.value,
                order: index + 1
            }))
        });

        const newData = await prisma.chartDataPoint.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json(newData);
    } catch (error) {
        console.error("Error updating chart data:", error);
        return NextResponse.json(
            { error: "Error al actualizar datos del gráfico" },
            { status: 500 }
        );
    }
}
