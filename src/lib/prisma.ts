import "dotenv/config";
import fs from "fs";
import path from "path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

// Charger le certificat AWS RDS pour valider TLS correctement
const caCertPath = path.resolve(process.cwd(), "certs/rds-ca.pem");
const ca = fs.existsSync(caCertPath) ? fs.readFileSync(caCertPath).toString() : undefined;

// Parser l'URL pour éviter que pg-connection-string n'écrase les options SSL
const dbUrl = new URL(process.env.DATABASE_URL!);

const pool = new Pool({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 5432,
  database: dbUrl.pathname.replace(/^\//, ""),
  user: decodeURIComponent(dbUrl.username),
  password: decodeURIComponent(dbUrl.password),
  ssl: ca ? { ca } : true,
});

const adapter = new PrismaPg(pool);

// Singleton pour éviter trop de connexions en développement
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
