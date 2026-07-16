import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Delete old users
  await prisma.user.deleteMany({});

  // Admin
  const adminHashed = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      username: 'admin',
      password: adminHashed,
      nickname: '管理员',
      role: 'admin',
    },
  });
  console.log('✅ 管理员 admin / admin123');

  // Test user
  const userHashed = await bcrypt.hash('test123', 10);
  await prisma.user.create({
    data: {
      username: 'test',
      password: userHashed,
      nickname: '测试用户',
      role: 'user',
    },
  });
  console.log('✅ 测试用户 test / test123');

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
