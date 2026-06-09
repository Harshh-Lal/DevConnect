import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const dummyUsers = [
  {
    username: 'janesmith',
    displayName: 'Jane Smith',
    email: 'jane@devconnect.dev',
    password: 'password123',
    bio: 'Full-stack developer passionate about clean code and great UX. Python & Django enthusiast.',
    githubUrl: 'https://github.com/janesmith',
  },
  {
    username: 'bobdev',
    displayName: 'Bob Developer',
    email: 'bob@devconnect.dev',
    password: 'password123',
    bio: 'React and Next.js developer. I build fast, accessible web apps for fun and profit.',
    githubUrl: 'https://github.com/bobdev',
  },
  {
    username: 'alicelee',
    displayName: 'Alice Lee',
    email: 'alice@devconnect.dev',
    password: 'password123',
    bio: 'Backend engineer specializing in Go and distributed systems. Docker & Kubernetes advocate.',
    githubUrl: 'https://github.com/alicelee',
  },
  {
    username: 'rajpatel',
    displayName: 'Raj Patel',
    email: 'raj@devconnect.dev',
    password: 'password123',
    bio: 'Mobile-first developer. Building cross-platform apps with React Native and TypeScript.',
    githubUrl: 'https://github.com/rajpatel',
  },
  {
    username: 'saraconnor',
    displayName: 'Sara Connor',
    email: 'sara@devconnect.dev',
    password: 'password123',
    bio: 'DevOps & cloud engineer. AWS certified. Love automating everything with Terraform and CI/CD pipelines.',
    githubUrl: 'https://github.com/saraconnor',
  },
];

async function seed() {
  console.log('🌱 Seeding dummy users...\n');

  for (const user of dummyUsers) {
    const existing = await prisma.user.findFirst({
      where: { OR: [{ email: user.email }, { username: user.username }] },
    });

    if (existing) {
      console.log(`⏭️  Skipped (already exists): @${user.username}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    const created = await prisma.user.create({
      data: {
        username: user.username,
        displayName: user.displayName,
        email: user.email,
        password: hashedPassword,
        bio: user.bio,
        githubUrl: user.githubUrl,
      },
    });

    console.log(`✅ Created: @${created.username} (${created.id})`);
  }

  console.log('\n✨ Seeding complete!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  prisma.$disconnect();
  process.exit(1);
});
