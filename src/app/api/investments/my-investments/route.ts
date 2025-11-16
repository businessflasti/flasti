import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const investments = await prisma.investment.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                period: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Calcular progreso y días restantes
        const investmentsWithProgress = investments.map(inv => {
            const now = new Date();
            const start = new Date(inv.startDate);
            const end = new Date(inv.endDate);
            
            const totalDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const elapsedDays = Math.ceil((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            const remainingDays = Math.max(0, totalDays - elapsedDays);
            const progress = Math.min(100, (elapsedDays / totalDays) * 100);

            return {
                ...inv,
                totalDays,
                elapsedDays,
                remainingDays,
                progress,
                canWithdraw: now >= end && inv.status === "ACTIVE"
            };
        });

        return NextResponse.json(investmentsWithProgress);
    } catch (error) {
        console.error("Error fetching investments:", error);
        return NextResponse.json(
            { error: "Error al obtener inversiones" },
            { status: 500 }
        );
    }
}
