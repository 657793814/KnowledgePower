import { prisma } from './helpers.js';

export async function seedUsers() {
  const exists = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (!exists) {
    await prisma.user.create({ data: { username: 'admin', password: 'admin123', nickname: '管理员', role: 'admin' } });
    console.log('  ✓ 创建管理员用户');
  } else {
    console.log('  ✓ 管理员用户已存在');
  }
}
