import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDB from "../db/connectDB";
import { User } from "../models/user.model";
import { Restaurant } from "../models/restaurant.model";
import { Menu } from "../models/menu.model";
import { DEMO_CUSTOMER, seedRestaurants } from "./data";

dotenv.config();

// Every seeded owner shares this password. It only ever exists in a local or demo
// database, and the accounts are recreated from scratch on each run.
const OWNER_PASSWORD = "gourmand123";

const seed = async () => {
    await connectDB();

    const seedEmails = [DEMO_CUSTOMER.email, ...seedRestaurants.map((r) => r.owner.email)];

    // Wipe only what this script owns so any accounts created by hand survive a reseed.
    await Menu.deleteMany({});
    await Restaurant.deleteMany({});
    await User.deleteMany({ email: { $in: seedEmails } });

    const ownerPasswordHash = await bcrypt.hash(OWNER_PASSWORD, 10);

    await User.create({
        ...DEMO_CUSTOMER,
        password: await bcrypt.hash(DEMO_CUSTOMER.password, 10),
        isVerified: true,
    });

    for (const entry of seedRestaurants) {
        const owner = await User.create({
            ...entry.owner,
            password: ownerPasswordHash,
            city: entry.city,
            country: entry.country,
            address: `${entry.restaurantName}, ${entry.city}`,
            isVerified: true,
            admin: true,
        });

        const menus = await Menu.insertMany(entry.menus);

        await Restaurant.create({
            user: owner._id,
            restaurantName: entry.restaurantName,
            city: entry.city,
            country: entry.country,
            deliveryTime: entry.deliveryTime,
            cuisines: entry.cuisines,
            imageUrl: entry.imageUrl,
            menus: menus.map((menu) => menu._id),
        });

        console.log(`seeded ${entry.restaurantName} (${entry.menus.length} menu items)`);
    }

    console.log(`\nDone. ${seedRestaurants.length} restaurants, demo login ${DEMO_CUSTOMER.email} / ${DEMO_CUSTOMER.password}`);
    await mongoose.connection.close();
};

seed().catch(async (error) => {
    console.error("Seeding failed:", error);
    await mongoose.connection.close();
    process.exit(1);
});
