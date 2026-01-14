import { PrismaClient } from './prisma-client/client';
import path from 'path';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Robustly resolve the database path
const dbPath = path.join(process.cwd(), 'prisma', 'dev.db');

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'],
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
