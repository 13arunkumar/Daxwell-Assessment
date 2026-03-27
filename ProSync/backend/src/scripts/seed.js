const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@prosync.com',
    password: 'Admin123',
    role: 'admin',
    phone: '+1 (555) 001-0000',
    isActive: true,
  },
  {
    name: 'John Smith',
    email: 'pm@prosync.com',
    password: 'Manager123',
    role: 'project_manager',
    phone: '+1 (555) 002-0000',
    isActive: true,
  },
  {
    name: 'Sarah Johnson',
    email: 'client@prosync.com',
    password: 'Client123',
    role: 'client',
    phone: '+1 (555) 003-0000',
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/prosync');
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('🗑️  Cleared existing users');

    // Create sample users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`⚠️  User already exists: ${userData.email}`);
        createdUsers.push(existingUser);
      } else {
        const user = await User.create(userData);
        console.log(`✅ Created user: ${user.email} (${user.role})`);
        createdUsers.push(user);
      }
    }

    console.log('\n📊 Summary:');
    console.log('═'.repeat(50));
    createdUsers.forEach((user) => {
      console.log(`
📧 Email: ${user.email}
🔑 Password: ${sampleUsers.find(u => u.email === user.email)?.password}
👤 Role: ${user.role}
🆔 ID: ${user._id}
      `);
    });
    console.log('═'.repeat(50));
    console.log('\n✨ Database seeded successfully!');
    console.log('You can now log in with any of the above credentials.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
