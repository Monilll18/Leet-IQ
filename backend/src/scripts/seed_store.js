import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StoreProduct from '../models/StoreProduct.js';

dotenv.config();

const STORE_PRODUCTS = [
    // Featured Products
    {
        name: "30-Day Premium Subscription",
        description: "Get unlimited access to all problems, detailed analytics, and exclusive features for 30 days.",
        image: "",
        price: 2000,
        category: "premium",
        isFeatured: true,
        premiumDays: 30,
        stock: -1
    },
    {
        name: "Leet IQ T-Shirt",
        description: "Premium quality cotton t-shirt with exclusive Leet IQ branding. Show off your coding skills!",
        image: "",
        price: 500,
        category: "merchandise",
        isFeatured: true,
        stock: 50
    },
    {
        name: "Exclusive Leet IQ Cap",
        description: "Adjustable snapback cap with embroidered Leet IQ logo.",
        image: "",
        price: 300,
        category: "merchandise",
        isFeatured: true,
        stock: 30
    },

    // Earn LeetCoin Products (ways to earn)
    {
        name: "7-Day Streak Bonus",
        description: "Complete a problem every day for 7 days to earn this bonus!",
        image: "",
        price: 0,
        category: "earn",
        coinsReward: 100,
        stock: -1
    },
    {
        name: "First Contest Win",
        description: "Win your first coding contest to claim this reward.",
        image: "",
        price: 0,
        category: "earn",
        coinsReward: 500,
        stock: -1
    },

    // Premium Subscriptions
    {
        name: "7-Day Trial Premium",
        description: "Try premium features for 7 days.",
        image: "",
        price: 500,
        category: "premium",
        premiumDays: 7,
        stock: -1
    },
    {
        name: "90-Day Premium Subscription",
        description: "3 months of premium access at a discounted rate.",
        image: "",
        price: 5000,
        category: "premium",
        premiumDays: 90,
        stock: -1
    },
    {
        name: "365-Day Premium Subscription",
        description: "Full year of premium access - best value!",
        image: "",
        price: 15000,
        category: "premium",
        premiumDays: 365,
        stock: -1
    },

    // Merchandise
    {
        name: "Leet IQ Hoodie",
        description: "Cozy premium hoodie with Leet IQ branding. Perfect for coding sessions.",
        image: "",
        price: 800,
        category: "merchandise",
        stock: 25
    },
    {
        name: "Sticker Pack",
        description: "Set of 10 high-quality vinyl stickers with coding themes.",
        image: "",
        price: 100,
        category: "merchandise",
        stock: 100
    },
    {
        name: "Laptop Sleeve",
        description: "Protective neoprene laptop sleeve with minimalist Leet IQ design.",
        image: "",
        price: 400,
        category: "merchandise",
        stock: 20
    },
    {
        name: "Big O Notebook",
        description: "Hardcover notebook for algorithm notes. Perfect for interview prep!",
        image: "",
        price: 200,
        category: "merchandise",
        stock: 40
    },

    // Digital Products
    {
        name: "Custom Profile Badge",
        description: "Unlock an exclusive badge for your profile.",
        image: "",
        price: 300,
        category: "digital",
        stock: -1
    },
    {
        name: "Dark Mode Pro Theme",
        description: "Exclusive dark theme with custom syntax highlighting.",
        image: "",
        price: 150,
        category: "digital",
        stock: -1
    },
    {
        name: "Algorithm Cheat Sheet PDF",
        description: "Comprehensive PDF guide covering all major algorithms and data structures.",
        image: "",
        price: 250,
        category: "digital",
        stock: -1
    }
];

async function seedStoreProducts() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log('✅ Connected to MongoDB\n');

        // Clear existing products (optional - comment out to preserve existing)
        await StoreProduct.deleteMany({});
        console.log('🗑️  Cleared existing store products');

        // Insert new products
        const result = await StoreProduct.insertMany(STORE_PRODUCTS);
        console.log(`✅ Seeded ${result.length} store products!\n`);

        // List products by category
        const categories = ['featured', 'earn', 'premium', 'merchandise', 'digital'];
        for (const cat of categories) {
            const count = result.filter(p => p.category === cat || (cat === 'featured' && p.isFeatured)).length;
            console.log(`  ${cat}: ${count}`);
        }

        await mongoose.disconnect();
        console.log('\n✅ Done!');
    } catch (error) {
        console.error('❌ Error seeding store:', error);
        process.exit(1);
    }
}

seedStoreProducts();
