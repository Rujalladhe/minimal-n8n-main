import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
    try {
        // Check admin key
        const adminKey = request.headers.get("x-admin-key") ||
            request.nextUrl.searchParams.get("admin_key");

        if (!process.env.ADMIN_KEY || adminKey !== process.env.ADMIN_KEY) {
            return NextResponse.json(
                { error: "Unauthorized. Provide valid admin key via X-Admin-Key header or admin_key query param." },
                { status: 401 }
            );
        }

        // Load client registry
        const clientsPath = path.join(process.cwd(), "config", "clients.json");
        let clients: Record<string, any> = {};
        try {
            const raw = fs.readFileSync(clientsPath, "utf-8");
            clients = JSON.parse(raw);
        } catch (e) {
            return NextResponse.json(
                { error: "Could not load clients.json" },
                { status: 500 }
            );
        }

        // Format response
        const clientList = Object.entries(clients).map(([key, info]: [string, any]) => ({
            clientKey: key,
            name: info.name,
            owner: info.owner,
            plan: info.plan,
            allowedDomain: info.allowedDomain,
            createdAt: info.createdAt,
        }));

        return NextResponse.json({
            totalClients: clientList.length,
            clients: clientList,
        });
    } catch (error: any) {
        console.error("Admin clients error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
