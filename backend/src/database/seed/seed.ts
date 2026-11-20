import { AppDataSource } from '../data-source';
import { User, UserRole } from '../../modules/users/user.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Initializing StockPilot Database Seed...');
  await AppDataSource.initialize();
  console.log('🔌 Database connected successfully.');

  const userRepository = AppDataSource.getRepository(User);

  const demoAccounts = [
    {
      name: 'Admin Operator',
      email: 'admin@stockpilot.local',
      password: 'Admin123!',
      role: UserRole.ADMIN,
    },
    {
      name: 'Tariq Mehmood',
      email: 'manager@stockpilot.local',
      password: 'Manager123!',
      role: UserRole.INVENTORY_MANAGER,
    },
    {
      name: 'Zeeshan Ali',
      email: 'sales@stockpilot.local',
      password: 'Sales123!',
      role: UserRole.SALES_STAFF,
    },
  ];

  for (const account of demoAccounts) {
    const existing = await userRepository.findOne({ where: { email: account.email } });
    if (!existing) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(account.password, salt);
      const user = userRepository.create({
        name: account.name,
        email: account.email,
        passwordHash,
        role: account.role,
        isActive: true,
      });
      await userRepository.save(user);
      console.log(`✅ Created demo account: [${account.role}] ${account.email}`);
    } else {
      console.log(`ℹ️ Account already exists: [${account.role}] ${account.email}`);
    }
  }

  console.log('✨ Seed finished successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
