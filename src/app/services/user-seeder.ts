// User Seeder - Add test users to the system
// Run this in browser console or create a component to initialize users

export interface User {
  username: string;
  email: string;
  password: string;
}

export const TEST_USERS: User[] = [
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'alice123'
  },
  {
    username: 'mohamed',
    email: 'mohamed@b.com',
    password: 'mo123'
  },
  {
    username: 'yossra',
    email: 'yos@ra.com',
    password: 'yosra123'
  }
];

export function seedUsers(): void {
  const existingUsers = localStorage.getItem('registeredUsers');
  let users: User[] = existingUsers ? JSON.parse(existingUsers) : [];

  // Add test users if they don't already exist
  TEST_USERS.forEach(testUser => {
    const userExists = users.find(u => u.username === testUser.username);
    if (!userExists) {
      users.push(testUser);
      console.log(`✅ User added: ${testUser.username}`);
    } else {
      console.log(`⚠️ User already exists: ${testUser.username}`);
    }
  });

  localStorage.setItem('registeredUsers', JSON.stringify(users));
  console.log('✅ Test users seeded successfully!');
  console.log('Users:', users);
}

// Function to display user credentials
export function displayUserCredentials(): void {
  console.log('========================================');
  console.log('📋 TEST USER CREDENTIALS');
  console.log('========================================');
  console.log('');
  TEST_USERS.forEach((user, index) => {
    console.log(`${index + 1}. Username: ${user.username}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Email: ${user.email}`);
    console.log('');
  });
  console.log('========================================');
}

