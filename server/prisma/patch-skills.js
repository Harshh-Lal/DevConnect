import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const skillPatches = [
  { username: 'janesmith',  skills: ['Python', 'Django', 'PostgreSQL', 'React', 'Docker'] },
  { username: 'bobdev',     skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'TailwindCSS'] },
  { username: 'alicelee',   skills: ['Go', 'Docker', 'AWS', 'PostgreSQL', 'GraphQL'] },
  { username: 'rajpatel',   skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Express'] },
  { username: 'saraconnor', skills: ['AWS', 'Docker', 'Python', 'Go', 'PostgreSQL'] },
];

async function patch() {
  console.log('🔧 Patching skills onto seed users...\n');

  for (const { username, skills } of skillPatches) {
    const updated = await prisma.user.update({
      where: { username },
      data: { skills },
    });
    console.log(`✅ @${updated.username} → [${skills.join(', ')}]`);
  }

  console.log('\n✨ Done!');
  await prisma.$disconnect();
}

patch().catch(e => {
  console.error('❌', e);
  prisma.$disconnect();
  process.exit(1);
});
