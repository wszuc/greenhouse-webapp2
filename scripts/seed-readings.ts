require('dotenv/config');
const { db } = require('@/db');
const { readings } = require('@/db/schema');

export async function addReadings() {
    const readingsData = [
        { ownerId: 1, temperature: 22.5, humidity: 65, light: 300 },
        { ownerId: 1, temperature: 21.0, humidity: 70, light: 250 },
        { ownerId: 1, temperature: 23.1, humidity: 60, light: 400 },
        { ownerId: 1, temperature: 24.3, humidity: 55, light: 500 },
        { ownerId: 1, temperature: 19.8, humidity: 80, light: 150 },
    ];

    for (const reading of readingsData) {
        await db.insert(readings).values(reading);
    }

    console.log('Readings added successfully');
    process.exit(0);
}

addReadings().catch(console.error);