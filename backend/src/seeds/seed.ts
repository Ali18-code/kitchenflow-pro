import { AppDataSource } from '../database/data-source';
import { User, UserRole } from '../users/user.entity';
import { PrepStation } from '../stations/station.entity';
import { RestaurantTable } from '../tables/table.entity';
import { MenuCategory } from '../menu/category.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { Ingredient } from '../inventory/ingredient.entity';
import { RecipeItem } from '../inventory/recipe-item.entity';
import { RestaurantSetting } from '../settings/setting.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
  console.log('Connecting to database...');
  await AppDataSource.initialize();
  console.log('Synchronizing schema for initial setup...');
  await AppDataSource.synchronize(false);

  const userRepo = AppDataSource.getRepository(User);
  const stationRepo = AppDataSource.getRepository(PrepStation);
  const tableRepo = AppDataSource.getRepository(RestaurantTable);
  const categoryRepo = AppDataSource.getRepository(MenuCategory);
  const menuItemRepo = AppDataSource.getRepository(MenuItem);
  const ingredientRepo = AppDataSource.getRepository(Ingredient);
  const recipeItemRepo = AppDataSource.getRepository(RecipeItem);
  const settingRepo = AppDataSource.getRepository(RestaurantSetting);

  // 1. Seed Settings
  const existingSetting = await settingRepo.findOne({ where: { id: 1 } });
  if (!existingSetting) {
    await settingRepo.save({
      id: 1,
      taxRate: '0.0500',
      serviceRate: '0.0000',
      currencyCode: 'PKR',
      openingHours: { open: '11:00', close: '23:30' },
    });
    console.log('✓ Restaurant settings created');
  }

  // 2. Seed Prep Stations
  const stationsData = [
    { name: 'Grill', capacitySlots: 2, waitWarnMin: 20 },
    { name: 'Oven', capacitySlots: 1, waitWarnMin: 15 },
    { name: 'Fryer', capacitySlots: 2, waitWarnMin: 10 },
    { name: 'Drinks', capacitySlots: 3, waitWarnMin: 5 },
  ];

  const savedStations: Record<string, PrepStation> = {};
  for (const st of stationsData) {
    let station = await stationRepo.findOne({ where: { name: st.name } });
    if (!station) {
      station = await stationRepo.save(st);
    }
    savedStations[st.name] = station;
  }
  console.log('✓ 4 Prep Stations seeded');

  // 3. Seed Users
  const passwordHash = await bcrypt.hash('Password123!', 10);
  const usersData = [
    { name: 'Head Chef & Manager', email: 'manager@kitchenflow.local', role: UserRole.MANAGER },
    { name: 'Hamza Waiter', email: 'waiter@kitchenflow.local', role: UserRole.WAITER },
    { name: 'Chef Tariq', email: 'kitchen@kitchenflow.local', role: UserRole.KITCHEN },
    { name: 'Ayesha Cashier', email: 'cashier@kitchenflow.local', role: UserRole.CASHIER },
  ];

  for (const u of usersData) {
    const existing = await userRepo.findOne({ where: { email: u.email } });
    if (!existing) {
      const user = userRepo.create({
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        active: true,
      });
      if (u.role === UserRole.KITCHEN) {
        user.stations = [savedStations['Grill'], savedStations['Oven']];
      }
      await userRepo.save(user);
    }
  }
  console.log('✓ 4 Seed Accounts created (manager, waiter, kitchen, cashier)');

  // 4. Seed Tables (12 tables)
  for (let i = 1; i <= 12; i++) {
    const label = `Table ${i < 10 ? '0' + i : i}`;
    const seats = i <= 4 ? 2 : i <= 10 ? 4 : 6;
    const existingTable = await tableRepo.findOne({ where: { label } });
    if (!existingTable) {
      await tableRepo.save({ label, seats, enabled: true });
    }
  }
  console.log('✓ 12 Restaurant tables seeded');

  // 5. Seed Menu Categories
  const categoriesData = [
    { name: 'Burgers', sortOrder: 1 },
    { name: 'Pizzas', sortOrder: 2 },
    { name: 'Sides', sortOrder: 3 },
    { name: 'Beverages', sortOrder: 4 },
    { name: 'Desserts', sortOrder: 5 },
  ];

  const savedCategories: Record<string, MenuCategory> = {};
  for (const c of categoriesData) {
    let cat = await categoryRepo.findOne({ where: { name: c.name } });
    if (!cat) {
      cat = await categoryRepo.save(c);
    }
    savedCategories[c.name] = cat;
  }
  console.log('✓ 5 Menu categories seeded');

  // 6. Seed Ingredients
  const ingredientsData = [
    { name: 'Burger Buns', unit: 'pcs', stockQty: '60.00', reorderQty: '15.00' },
    { name: 'Chicken Breast Patties', unit: 'pcs', stockQty: '50.00', reorderQty: '15.00' },
    { name: 'Beef Patties', unit: 'pcs', stockQty: '40.00', reorderQty: '10.00' },
    { name: 'Cheddar Cheese Slices', unit: 'pcs', stockQty: '80.00', reorderQty: '20.00' },
    { name: 'Pizza Dough', unit: 'pcs', stockQty: '35.00', reorderQty: '10.00' },
    { name: 'Mozzarella Cheese', unit: 'grams', stockQty: '5000.00', reorderQty: '1000.00' },
    { name: 'Pizza Sauce', unit: 'ml', stockQty: '3000.00', reorderQty: '500.00' },
    { name: 'Pepperoni Slices', unit: 'pcs', stockQty: '250.00', reorderQty: '50.00' },
    { name: 'Cut Potatoes', unit: 'grams', stockQty: '10000.00', reorderQty: '2000.00' },
    { name: 'Chicken Wings', unit: 'pcs', stockQty: '120.00', reorderQty: '30.00' },
    { name: 'Lemons', unit: 'pcs', stockQty: '50.00', reorderQty: '10.00' },
    { name: 'Fresh Mint', unit: 'grams', stockQty: '600.00', reorderQty: '100.00' },
    { name: 'Coffee Beans', unit: 'grams', stockQty: '2500.00', reorderQty: '500.00' },
    { name: 'Fresh Milk', unit: 'ml', stockQty: '9000.00', reorderQty: '2000.00' },
    { name: 'Chocolate Sauce', unit: 'ml', stockQty: '1500.00', reorderQty: '300.00' },
  ];

  const savedIngredients: Record<string, Ingredient> = {};
  for (const ing of ingredientsData) {
    let item = await ingredientRepo.findOne({ where: { name: ing.name } });
    if (!item) {
      item = await ingredientRepo.save(ing);
    }
    savedIngredients[ing.name] = item;
  }
  console.log('✓ 15 Ingredients seeded');

  // 7. Seed Menu Items
  const itemsData = [
    {
      name: 'Zinger Burger',
      category: 'Burgers',
      station: 'Grill',
      price: '650.00',
      prepMinutes: 10,
      recipes: [
        { ingredient: 'Burger Buns', qty: '1.00' },
        { ingredient: 'Chicken Breast Patties', qty: '1.00' },
      ],
    },
    {
      name: 'Double Cheeseburger',
      category: 'Burgers',
      station: 'Grill',
      price: '850.00',
      prepMinutes: 12,
      recipes: [
        { ingredient: 'Burger Buns', qty: '1.00' },
        { ingredient: 'Beef Patties', qty: '2.00' },
        { ingredient: 'Cheddar Cheese Slices', qty: '2.00' },
      ],
    },
    {
      name: 'Margherita Pizza',
      category: 'Pizzas',
      station: 'Oven',
      price: '1200.00',
      prepMinutes: 15,
      recipes: [
        { ingredient: 'Pizza Dough', qty: '1.00' },
        { ingredient: 'Pizza Sauce', qty: '100.00' },
        { ingredient: 'Mozzarella Cheese', qty: '200.00' },
      ],
    },
    {
      name: 'Pepperoni Passion Pizza',
      category: 'Pizzas',
      station: 'Oven',
      price: '1450.00',
      prepMinutes: 16,
      recipes: [
        { ingredient: 'Pizza Dough', qty: '1.00' },
        { ingredient: 'Pizza Sauce', qty: '100.00' },
        { ingredient: 'Mozzarella Cheese', qty: '200.00' },
        { ingredient: 'Pepperoni Slices', qty: '20.00' },
      ],
    },
    {
      name: 'Crispy French Fries',
      category: 'Sides',
      station: 'Fryer',
      price: '300.00',
      prepMinutes: 6,
      recipes: [{ ingredient: 'Cut Potatoes', qty: '250.00' }],
    },
    {
      name: 'Spicy Buffalo Wings (6 pcs)',
      category: 'Sides',
      station: 'Fryer',
      price: '580.00',
      prepMinutes: 8,
      recipes: [{ ingredient: 'Chicken Wings', qty: '6.00' }],
    },
    {
      name: 'Mint Lemonade',
      category: 'Beverages',
      station: 'Drinks',
      price: '250.00',
      prepMinutes: 3,
      recipes: [
        { ingredient: 'Lemons', qty: '2.00' },
        { ingredient: 'Fresh Mint', qty: '15.00' },
      ],
    },
    {
      name: 'Cold Coffee with Ice Cream',
      category: 'Beverages',
      station: 'Drinks',
      price: '450.00',
      prepMinutes: 4,
      recipes: [
        { ingredient: 'Coffee Beans', qty: '20.00' },
        { ingredient: 'Fresh Milk', qty: '250.00' },
      ],
    },
    {
      name: 'Warm Lava Cake',
      category: 'Desserts',
      station: 'Oven',
      price: '550.00',
      prepMinutes: 12,
      recipes: [{ ingredient: 'Chocolate Sauce', qty: '60.00' }],
    },
  ];

  for (const item of itemsData) {
    let menuItem = await menuItemRepo.findOne({ where: { name: item.name } });
    if (!menuItem) {
      menuItem = await menuItemRepo.save({
        name: item.name,
        categoryId: savedCategories[item.category].id,
        stationId: savedStations[item.station].id,
        price: item.price,
        prepMinutes: item.prepMinutes,
        available: true,
      });

      // Link recipes
      for (const r of item.recipes) {
        await recipeItemRepo.save({
          menuItemId: menuItem.id,
          ingredientId: savedIngredients[r.ingredient].id,
          qtyPerItem: r.qty,
        });
      }
    }
  }
  console.log('✓ Menu items and recipe linkages seeded');

  console.log('Seeding completed successfully!');
  await AppDataSource.destroy();
}

seed().catch((err) => {
  console.error('Error during seeding:', err);
  process.exit(1);
});
