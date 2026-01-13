import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const createWorkflowSchema = z.object({
    name: z.string().min(1),
    nodes: z.string(), // Expecting stringified JSON
    edges: z.string(), // Expecting stringified JSON
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = createWorkflowSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: validation.error.format() },
                { status: 400 }
            );
        }

        const { name, nodes, edges } = validation.data;

        const workflow = await prisma.workflow.create({
            data: {
                name,
                nodes,
                edges,
            },
        });

        return NextResponse.json(workflow, { status: 201 });
    } catch (error) {
        console.error('Error creating workflow:', error);
        return NextResponse.json(
            { error: 'Failed to create workflow' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const workflows = await prisma.workflow.findMany({
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                name: true,
                updatedAt: true,
                createdAt: true,
                // We don't need nodes/edges for the list view to save bandwidth
            },
        });

        return NextResponse.json(workflows);
    } catch (error) {
        console.error('Error fetching workflows:', error);
        return NextResponse.json(
            { error: 'Failed to fetch workflows' },
            { status: 500 }
        );
    }
}
