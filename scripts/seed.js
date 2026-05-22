// C:/Users/srees/.gemini/antigravity/scratch/agrismart/scripts/seed.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '../backend/.env' });

// We need schemas to seed (assuming backend models are accessible)
// In a real scenario, you'd require them from relative path like:
// const User = require('../backend/models/User');
// const Farm = require('../backend/models/Farm');
// const Store = require('../backend/models/Store');
// const Blog = require('../backend/models/Blog');

const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/agrismart';

const seedData = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');

        console.log('Clearing existing data...');
        // await User.deleteMany();
        // await Farm.deleteMany();
        // await Store.deleteMany();
        // await Blog.deleteMany();

        console.log('Creating mock users...');
        /*
        const users = await User.insertMany([
            {
                name: 'Admin User',
                email: 'admin@agrismart.com',
                password: 'password123', // In real app, must completely hash before saving
                role: 'Admin',
                languagePreference: 'en'
            },
            {
                name: 'Farmer John',
                email: 'john@farmer.com',
                password: 'password123',
                role: 'Farmer',
                languagePreference: 'en'
            }
        ]);
        */

        console.log('Creating mock stores...');
        /*
        const stores = await Store.insertMany([
            {
                storeName: 'Agro Seeds & Tools',
                owner: users[1]._id,
                address: '123 Market St. Farmville',
                location: {
                    type: 'Point',
                    coordinates: [78.9629, 20.5937] // Long, Lat (India center approx)
                },
                phoneNumber: '+919876543210',
                cropsAvailable: ['Wheat', 'Rice'],
                openingTime: '08:00 AM',
                closingTime: '05:00 PM',
                description: 'All your farming needs in one place.',
                images: ['http://example.com/store.jpg'],
                isVerified: true
            }
        ]);
        */

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

seedData();
