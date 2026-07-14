import { prisma } from './helpers.js';

export async function seedUsers() {
  await prisma.user.create({ data: { username: 'admin', password: 'admin123', nickname: '管理员', role: 'admin' } });
  console.log('  ✓ 创建管理员用户');
}
