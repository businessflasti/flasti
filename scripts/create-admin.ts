import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.argv[2] || 'admin@flasti.com';
  const password = process.argv[3] || 'admin123';

  console.log('🔐 Creando usuario administrador...');

  const hashedPassword = await hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hashedPassword,
      name: 'Administrador',
      role: 'ADMIN',
      balance: 10000
    }
  });

  console.log('✅ Usuario administrador creado:');
  console.log('📧 Email:', admin.email);
  console.log('🔑 Password:', password);
  console.log('💰 Balance inicial:', admin.balance);
  console.log('\n⚠️  IMPORTANTE: Cambia la contraseña después del primer login');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
