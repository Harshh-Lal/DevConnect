import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const seedUsers = [
  {
    email: 'brad@example.com',
    username: 'bradtraversy',
    displayName: 'Brad Traversy',
    bio: 'Web developer & online instructor. Building things with JavaScript.',
    githubUrl: 'https://github.com/bradtraversy',
    avatarUrl: 'https://github.com/bradtraversy.png',
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'Python']
  },
  {
    email: 'lee@example.com',
    username: 'leerob',
    displayName: 'Lee Robinson',
    bio: 'VP of Product at Vercel. Writing about React, Next.js, and the web.',
    githubUrl: 'https://github.com/leerob',
    avatarUrl: 'https://github.com/leerob.png',
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js']
  },
  {
    email: 'anthony@example.com',
    username: 'antfu',
    displayName: 'Anthony Fu',
    bio: 'Open sourceror. Core team of Vue, Vite, and Nuxt.',
    githubUrl: 'https://github.com/antfu',
    avatarUrl: 'https://github.com/antfu.png',
    skills: ['Vue', 'TypeScript', 'Node.js', 'Vite']
  },
  {
    email: 'shadcn@example.com',
    username: 'shadcn',
    displayName: 'shadcn',
    bio: 'Building Shadcn UI. Design systems and component libraries.',
    githubUrl: 'https://github.com/shadcn',
    avatarUrl: 'https://github.com/shadcn.png',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']
  },
  {
    email: 'theo@example.com',
    username: 't3dotgg',
    displayName: 'Theo Browne',
    bio: 'CEO at Ping.gg. T3 Stack creator. Full-stack TypeScript advocate.',
    githubUrl: 'https://github.com/t3dotgg',
    avatarUrl: 'https://github.com/t3dotgg.png',
    skills: ['TypeScript', 'React', 'Next.js', 'PostgreSQL', 'Prisma']
  },
];

const seedPosts = [
  {
    authorUsername: 'bradtraversy',
    title: 'React Crash Course 2026',
    description: 'Just published a new React crash course for 2026. Includes Server Components, React Compiler, and Vite. Check out the repo for the starter code!',
    tags: ['React', 'JavaScript', 'Next.js'],
    githubUrl: 'https://github.com/bradtraversy/react-crash-2024'
  },
  {
    authorUsername: 'bradtraversy',
    title: 'Open Source Netflix Clone',
    description: 'Working on an open-source clone of Netflix using React and Firebase. The styling is completely done with Tailwind CSS. Looking for contributors!',
    tags: ['React', 'Tailwind CSS', 'Firebase'],
    liveUrl: 'https://netflix-clone.example.com'
  },
  {
    authorUsername: 'leerob',
    title: 'Next.js Performance Improvements',
    description: 'Next.js is shipping with incredible performance improvements. We\'ve completely overhauled the caching layer. Here\'s a demo app testing the new primitives.',
    tags: ['Next.js', 'React', 'Vercel'],
    githubUrl: 'https://github.com/vercel/next.js'
  },
  {
    authorUsername: 'leerob',
    title: 'Deep Dive: Server Actions',
    description: 'Just wrote a deep dive on how Server Actions work under the hood. They are much simpler than you think. Blog post coming soon!',
    tags: ['Next.js', 'TypeScript']
  },
  {
    authorUsername: 'antfu',
    title: 'Vite & Rolldown',
    description: 'Vite is going to be wild. Working heavily on Rolldown integration to make builds 10x faster. Stay tuned for the RC release.',
    tags: ['Vite', 'Vue', 'Rust'],
    githubUrl: 'https://github.com/vitejs/vite'
  },
  {
    authorUsername: 'antfu',
    title: 'Nuxt Utility Collection',
    description: 'Created a new utility collection for Nuxt developers. Fully typed and treeshakable.',
    tags: ['Vue', 'Nuxt', 'TypeScript'],
  },
  {
    authorUsername: 'shadcn',
    title: 'New Calendar Component',
    description: 'Adding a new complex calendar component to shadcn/ui. Handles date ranges, internationalization, and keyboard navigation. Coming this weekend.',
    tags: ['React', 'Tailwind CSS', 'TypeScript'],
    githubUrl: 'https://github.com/shadcn-ui/ui'
  },
  {
    authorUsername: 'shadcn',
    title: 'Copy-Paste Components',
    description: 'Design systems are hard, but they shouldn\'t be. Here\'s my latest thought on why copy-paste components win over npm installs.',
    tags: ['React', 'Design Systems']
  },
  {
    authorUsername: 't3dotgg',
    title: 'Create T3 App Update',
    description: 'The T3 Stack is still the best way to build fullstack React apps today. Just updated create-t3-app with Next 15 and React 19 support!',
    tags: ['TypeScript', 'Next.js', 'Prisma'],
    githubUrl: 'https://github.com/t3-oss/create-t3-app'
  },
  {
    authorUsername: 't3dotgg',
    title: 'Stop using REST APIs',
    description: 'Stop using REST APIs for everything. tRPC will change your life. End-to-end typesafe APIs without the GraphQL overhead.',
    tags: ['TypeScript', 'tRPC']
  }
];

async function seed() {
  console.log('🌱 Starting database seed...');

  // Clean the database
  console.log('🧹 Cleaning existing data...');
  await prisma.comment.deleteMany();
  await prisma.like.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  console.log('👤 Creating users...');
  const hashedPassword = await bcrypt.hash('seed_password_123', 10);
  const createdUsers = {};

  for (const userData of seedUsers) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
      }
    });
    createdUsers[user.username] = user;
    console.log(`  Created @${user.username}`);
  }

  // Create Follows
  console.log('🤝 Creating follow relationships...');
  const usersArray = Object.values(createdUsers);
  for (let i = 0; i < usersArray.length; i++) {
    const follower = usersArray[i];
    // Follow the next 2 users
    for (let j = 1; j <= 2; j++) {
      const following = usersArray[(i + j) % usersArray.length];
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followingId: following.id
        }
      });
    }
  }

  // Create Posts
  console.log('📝 Creating posts...');
  const createdPosts = [];
  for (const postData of seedPosts) {
    const { authorUsername, ...rest } = postData;
    const author = createdUsers[authorUsername];
    const post = await prisma.post.create({
      data: {
        ...rest,
        authorId: author.id,
      }
    });
    createdPosts.push(post);
    console.log(`  Created post by @${authorUsername}: "${post.title}"`);
  }

  // Create Likes & Comments
  console.log('💬 Adding likes and comments...');
  // Theo likes and comments on Shadcn's calendar post
  const shadcnPost = createdPosts.find(p => p.title === 'New Calendar Component');
  if (shadcnPost) {
    await prisma.like.create({
      data: {
        userId: createdUsers['t3dotgg'].id,
        postId: shadcnPost.id
      }
    });
    await prisma.comment.create({
      data: {
        content: 'This is going to be incredibly useful. Can\'t wait to try it!',
        authorId: createdUsers['t3dotgg'].id,
        postId: shadcnPost.id
      }
    });
  }

  // Lee likes and comments on Theo's T3 app post
  const theoPost = createdPosts.find(p => p.title === 'Create T3 App Update');
  if (theoPost) {
    await prisma.like.create({
      data: {
        userId: createdUsers['leerob'].id,
        postId: theoPost.id
      }
    });
    await prisma.comment.create({
      data: {
        content: 'Great update! T3 stack provides such a solid foundation.',
        authorId: createdUsers['leerob'].id,
        postId: theoPost.id
      }
    });
    await prisma.comment.create({
      data: {
        content: 'Next 15 support is huge 🔥',
        authorId: createdUsers['shadcn'].id,
        postId: theoPost.id
      }
    });
  }

  // Anthony likes Brad's React crash course
  const bradPost = createdPosts.find(p => p.title === 'React Crash Course 2026');
  if (bradPost) {
    await prisma.like.create({
      data: {
        userId: createdUsers['antfu'].id,
        postId: bradPost.id
      }
    });
  }

  console.log('✨ Database seeded successfully!');
}

seed()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
