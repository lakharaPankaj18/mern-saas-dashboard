import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import dotenv from 'dotenv';
import User from './models/user.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI; 

if (!MONGO_URI) {
  console.error('❌ Error: MONGO_URI not found in .env file');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB... 🚀');

    const users = [];

    for (let i = 0; i < 100; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      users.push({
        name: `${firstName} ${lastName}`,
        email: faker.internet.email({ firstName, lastName }).toLowerCase(),
        password: 'password123', 
        role: faker.helpers.arrayElement(['admin', 'member']),
        isActive: faker.datatype.boolean({ probability: 0.8 }), 
        createdAt: faker.date.past({ years: 1 }),
      });
    }

    await User.insertMany(users);
    console.log(`Successfully seeded 100 users with 'isActive' field! 📊`);
    
    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();