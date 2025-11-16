import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// PUT - Actualizar período (solo admin)
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        
        const period = await prisma.investmentPeriod.update({
            where: { id: params.id },
            data
        });

        return NextResponse.json(period);
    } catch (error) {
        console.error("Error updating period:", error);
        return NextResponse.json(
            { error: "Error al actualizar período" },
            { status: 500 }
        );
    }
}

// DELETE - Eliminar período (solo admin)
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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

        await prisma.investmentPeriod.delete({
            where: { id: params.id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting period:", error);
        return NextResponse.json(
            { error: "Error al eliminar período" },
            { status: 500 }
        );
    }
}
