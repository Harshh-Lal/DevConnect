import PrismaPkg from '@prisma/client';
const { PrismaClient } = PrismaPkg;
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error('DATABASE_URL is missing. Set it in server/.env before starting the server.');
}

const adapter = new PrismaPg({ connectionString });

const prisma = new PrismaClient({ adapter });

export default prisma;