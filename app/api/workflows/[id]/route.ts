import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateWorkflowSchema = z.object({
    name: z.string().min(1).optional(),
    nodes: z.string().optional(),
    edges: z.string().optional(),
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // In Next.js 15+ params is a promise, checking Next.js 14...
    // User said Next.js 14. In 14 params is not a promise usually, but let's check package.json "next": "16.0.1".
    // WAIT! package.json says "next": "16.0.1".
    // Requirements said "Next.js 14". But project is 16.
    // I must use Next.js 15+ async params pattern if it is 16.
) {
    try {
        const { id } = await params; // Next.js 15+ require awaiting params

        const workflow = await prisma.workflow.findUnique({
            where: { id },
        });

        if (!workflow) {
            return NextResponse.json(
                { error: 'Workflow not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(workflow);
    } catch (error) {
        console.error('Error fetching workflow:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workflow' },
            { status: 500 }
        );
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const validation = updateWorkflowSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const workflow = await prisma.workflow.update({
            where: { id },
            data: validation.data,
        });

        return NextResponse.json(workflow);
    } catch (error) {
        console.error('Error updating workflow:', error);
        return NextResponse.json(
            { error: 'Failed to update workflow' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        await prisma.workflow.delete({
            where: { id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error deleting workflow:', error);
        return NextResponse.json(
            { error: 'Failed to delete workflow' },
            { status: 500 }
        );
    }
}
