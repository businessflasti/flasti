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

        const { amount, periodId } = await request.json();

        // Validar datos
        if (!amount || !periodId) {
            return NextResponse.json(
                { error: "Datos incompletos" },
                { status: 400 }
            );
        }

        // Obtener configuración
        const config = await prisma.investmentConfig.findFirst();
        
        if (!config) {
            return NextResponse.json(
                { error: "Configuración no encontrada" },
                { status: 500 }
            );
        }

        // Verificar si el sistema está bloqueado
        if (config.isSystemLocked) {
            return NextResponse.json(
                { error: "El sistema de inversiones está temporalmente deshabilitado" },
                { status: 403 }
            );
        }

        // Validar monto
        if (amount < config.minInvestment || amount > config.maxInvestment) {
            return NextResponse.json(
                { error: `El monto debe estar entre $${config.minInvestment} y $${config.maxInvestment}` },
                { status: 400 }
            );
        }

        // Obtener período
        const period = await prisma.investmentPeriod.findUnique({
            where: { id: periodId }
        });

        if (!period || !period.enabled) {
            return NextResponse.json(
                { error: "Período no disponible" },
                { status: 400 }
            );
        }

        // Verificar saldo del usuario
        const user = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user || user.balance < amount) {
            return NextResponse.json(
                { error: "Saldo insuficiente" },
                { status: 400 }
            );
        }

        // Calcular fechas y retorno
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + period.days);

        const estimatedReturn = amount * (period.rateAnnual / 100) * (period.days / 365);

        // Crear inversión y actualizar saldo en una transacción
        const investment = await prisma.$transaction(async (tx) => {
            // Descontar del saldo
            await tx.user.update({
                where: { id: session.user.id },
                data: {
                    balance: {
                        decrement: amount
                    }
                }
            });

            // Crear inversión
            const newInvestment = await tx.investment.create({
                data: {
                    userId: session.user.id,
                    amount,
                    periodId,
                    startDate,
                    endDate,
                    interestRate: period.rateAnnual,
                    estimatedReturn,
                    status: "ACTIVE"
                },
                include: {
                    period: true
                }
            });

            return newInvestment;
        });

        return NextResponse.json(investment);
    } catch (error) {
        console.error("Error creating investment:", error);
        return NextResponse.json(
            { error: "Error al crear inversión" },
            { status: 500 }
        );
    }
}
