import { PrismaClient } from "@prisma/client";

const PrismaClientSingleton=()=>{
    return new PrismaClient;
}

type PrismaClientSingleton=ReturnType<typeof PrismaClientSingleton>;

const globalForPrisma= globalThis as unknown as {prisma:PrismaClient|undefined};

const prisma = globalForPrisma.prisma ?? PrismaClientSingleton;

export default prisma;