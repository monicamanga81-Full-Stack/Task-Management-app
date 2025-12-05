const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();

    const email = 'test@local.dev';
    const password = 'secret123';

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      console.log('User already exists:', existing.email);
      await prisma.$disconnect();
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { email, password: hashed } });
    console.log('Created user:', { id: user.id, email: user.email });

    await prisma.$disconnect();
  } catch (err) {
    console.error('Error creating user:', err);
    process.exit(1);
  }
})();
