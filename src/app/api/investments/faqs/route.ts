import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Obtener FAQs
export async function GET() {
    try {
        const faqs = await prisma.investmentFAQ.findMany({
            where: { enabled: true },
            orderBy: { order: 'asc' }
        });

        // Si no hay FAQs, crear las por defecto
        if (faqs.length === 0) {
            const defaultFAQs = [
                {
                    question: "¿Cómo se calculan los intereses?",
                    answer: "Los intereses se calculan de forma proporcional según el período elegido y se acreditan automáticamente al finalizar el período de bloqueo.",
                    order: 1,
                    enabled: true
                },
                {
                    question: "¿Puedo retirar antes del período?",
                    answer: "No, los fondos quedan bloqueados durante el período seleccionado. Esto garantiza la estabilidad del sistema y los rendimientos prometidos.",
                    order: 2,
                    enabled: true
                },
                {
                    question: "¿Es segura mi inversión?",
                    answer: "Sí, Flasti Capital opera con total transparencia. Tus fondos se destinan al crecimiento real de la plataforma.",
                    order: 3,
                    enabled: true
                },
                {
                    question: "¿Cuánto puedo invertir?",
                    answer: "La inversión mínima es de $5 USD y la máxima es de $10,000 USD por usuario.",
                    order: 4,
                    enabled: true
                }
            ];

            await prisma.investmentFAQ.createMany({
                data: defaultFAQs
            });

            const newFAQs = await prisma.investmentFAQ.findMany({
                where: { enabled: true },
                orderBy: { order: 'asc' }
            });

            return NextResponse.json(newFAQs);
        }

        return NextResponse.json(faqs);
    } catch (error) {
        console.error("Error fetching FAQs:", error);
        return NextResponse.json(
            { error: "Error al obtener FAQs" },
            { status: 500 }
        );
    }
}

// POST - Crear/Actualizar FAQs (solo admin)
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

        const { faqs } = await request.json();

        // Eliminar FAQs existentes y crear nuevas
        await prisma.investmentFAQ.deleteMany();
        
        await prisma.investmentFAQ.createMany({
            data: faqs.map((faq: any, index: number) => ({
                question: faq.question,
                answer: faq.answer,
                order: index + 1,
                enabled: faq.enabled ?? true
            }))
        });

        const newFAQs = await prisma.investmentFAQ.findMany({
            orderBy: { order: 'asc' }
        });

        return NextResponse.json(newFAQs);
    } catch (error) {
        console.error("Error updating FAQs:", error);
        return NextResponse.json(
            { error: "Error al actualizar FAQs" },
            { status: 500 }
        );
    }
}
