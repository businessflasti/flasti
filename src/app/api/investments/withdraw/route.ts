import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session?.user) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const { investmentId } = await request.json();

        if (!investmentId) {
            return NextResponse.json(
                { error: "ID de inversión requerido" },
                { status: 400 }
            );
        }

        // Obtener inversión
        const investment = await prisma.investment.findUnique({
            where: { id: investmentId },
            include: { period: true }
        });

        if (!investment) {
            return NextResponse.json(
                { error: "Inversión no encontrada" },
                { status: 404 }
            );
        }

        // Verificar que sea del usuario
        if (investment.userId !== session.user.id) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 403 }
            );
        }

        // Verificar que esté activa
        if (investment.status !== "ACTIVE") {
            return NextResponse.json(
                { error: "La inversión no está activa" },
                { status: 400 }
            );
        }

        // Verificar que haya pasado el período
        const now = new Date();
        const endDate = new Date(investment.endDate);

        if (now < endDate) {
            return NextResponse.json(
                { error: "El período de inversión aún no ha finalizado" },
                { status: 400 }
            );
        }

        // Calcular monto total a devolver
        const totalAmount = investment.amount + investment.estimatedReturn;

        // Procesar retiro en transacción
        const result = await prisma.$transaction(async (tx) => {
            // Actualizar inversión
            await tx.investment.update({
                where: { id: investmentId },
                data: {
                    status: "COMPLETED"
                }
            });

            // Devolver fondos al usuario
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    balance: {
                        increment: totalAmount
                    }
                }
            });

            // Crear registro de retiro
            const withdrawal = await tx.withdrawalRequest.create({
                data: {
                    userId: session.user.id,
                    investmentId,
                    amount: totalAmount,
                    status: "PROCESSED",
                    processedAt: new Date()
                }
            });

            return withdrawal;
        });

        return NextResponse.json({
            success: true,
            amount: totalAmount,
            withdrawal: result
        });
    } catch (error) {
        console.error("Error processing withdrawal:", error);
        return NextResponse.json(
            { error: "Error al procesar retiro" },
            { status: 500 }
        );
    }
}
