async function testPhase2() {
  const baseURL = 'http://localhost:3000/api/v1';
  console.log('--- Starting Phase 2 Verification Test ---');

  // 1. Waiter Login
  console.log('1. Testing Login as Waiter...');
  const loginRes = await fetch(`${baseURL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'waiter@kitchenflow.local',
      password: 'Password123!',
    }),
  });
  if (!loginRes.ok) throw new Error(`Login failed with status ${loginRes.status}`);
  const loginData = await loginRes.json();
  console.log('✓ Waiter logged in. Token received:', loginData.accessToken.slice(0, 20) + '...');
  const token = loginData.accessToken;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 2. GET /tables
  console.log('\n2. Testing GET /tables...');
  const tablesRes = await fetch(`${baseURL}/tables`, { headers: authHeaders });
  const tables = await tablesRes.json();
  console.log(`✓ Fetched ${tables.length} tables.`);
  const table5 = tables.find((t) => t.label === 'Table 05');
  console.log(`✓ Table 05 status before order: ${table5.status}`);

  // 3. GET /menu/items
  console.log('\n3. Testing GET /menu/items...');
  const itemsRes = await fetch(`${baseURL}/menu/items`);
  const items = await itemsRes.json();
  console.log(`✓ Fetched ${items.length} menu items.`);
  const burger = items.find((i) => i.name.includes('Zinger'));
  const coffee = items.find((i) => i.name.includes('Coffee'));
  console.log(`  - ${burger.name}: Rs ${burger.price} (Station: ${burger.station?.name})`);
  console.log(`  - ${coffee.name}: Rs ${coffee.price} (Station: ${coffee.station?.name})`);

  // 4. POST /orders
  console.log('\n4. Testing POST /orders (Creating Dine-in Order on Table 05)...');
  const idempotencyKey = `test-key-${Date.now()}`;
  const orderPayload = {
    orderType: 'DINE_IN',
    tableId: parseInt(table5.id, 10),
    idempotencyKey,
    items: [
      { menuItemId: parseInt(burger.id, 10), quantity: 2, notes: 'less spicy' },
      { menuItemId: parseInt(coffee.id, 10), quantity: 1 },
    ],
  };

  const orderRes = await fetch(`${baseURL}/orders`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(orderPayload),
  });
  if (!orderRes.ok) {
    const errBody = await orderRes.json();
    throw new Error(`Order failed: ${JSON.stringify(errBody)}`);
  }
  const order = await orderRes.json();
  console.log(`✓ Order Created Successfully!`);
  console.log(`  - Order Code: ${order.orderCode}`);
  console.log(`  - Status: ${order.status}`);
  console.log(`  - Subtotal: Rs ${order.subtotal}`);
  console.log(`  - Tax: Rs ${order.tax}`);
  console.log(`  - Grand Total: Rs ${order.total}`);
  console.log(`  - Items Created: ${order.items.length}`);

  // 5. Idempotency Check
  console.log('\n5. Testing Idempotency (Re-submitting same idempotency key)...');
  const retryRes = await fetch(`${baseURL}/orders`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(orderPayload),
  });
  const retryOrder = await retryRes.json();
  if (retryOrder.id === order.id) {
    console.log(`✓ Idempotency passed: Exactly the same order returned (${retryOrder.orderCode}), no duplicate!`);
  } else {
    throw new Error('Idempotency failed: duplicate order created!');
  }

  // 6. Table Occupancy Check
  console.log('\n6. Checking Table 05 Occupancy after order...');
  const tablesAfterRes = await fetch(`${baseURL}/tables`, { headers: authHeaders });
  const tablesAfter = await tablesAfterRes.json();
  const table5After = tablesAfter.find((t) => t.id === table5.id);
  console.log(`✓ Table 05 status is now: ${table5After.status} (Linked Order: ${table5After.activeOrder?.orderCode})`);

  // 7. Double-Occupancy Conflict Check
  console.log('\n7. Testing Double-Occupancy Prevention...');
  const conflictRes = await fetch(`${baseURL}/orders`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      orderType: 'DINE_IN',
      tableId: parseInt(table5.id, 10),
      items: [{ menuItemId: parseInt(burger.id, 10), quantity: 1 }],
    }),
  });
  if (conflictRes.status === 409) {
    const conflictBody = await conflictRes.json();
    console.log(`✓ Conflict check passed: ${conflictBody.message}`);
  } else {
    throw new Error(`Expected 409 Conflict but received ${conflictRes.status}`);
  }

  console.log('\n🎉 ALL PHASE 2 ACCEPTANCE TESTS PASSED ACCORDING TO SPECIFICATION! 🎉');
}

testPhase2().catch((err) => {
  console.error('Test execution error:', err.message);
  process.exit(1);
});
