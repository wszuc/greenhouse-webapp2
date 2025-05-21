import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { readings } from '@/db/schema';
import dayjs from 'dayjs';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL!;
const OWNER_ID = 1; // Zakładam, że znasz ID użytkownika – ustaw go tu.

const client = new Client({ connectionString: DATABASE_URL });
const db = drizzle(client);

interface SensorReading {
    temperature: number;
    humidity: number;
    light: number;
    timestamp: string; // ISO 8601
}

async function fetchSensorData(): Promise<SensorReading[]> {
    const res = await fetch('http://192.168.1.46:8000/sensors/all?limit=50');
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
    const json = await res.json();
    console.log(json);
    return json.map((entry: any) => ({
        temperature: entry.temp_1,
        humidity: entry.humidity,
        light: entry.lighting,
        timestamp: entry.date,
    }));
}

async function insertReadings(readingsData: SensorReading[]) {
    for (const reading of readingsData) {
        await db.insert(readings).values({
            ownerId: OWNER_ID,
            temperature: reading.temperature,
            humidity: reading.humidity,
            light: reading.light,
            createdAt: dayjs(reading.timestamp).toDate()
        });
    }
    console.log(`[✓] Inserted ${readingsData.length} readings.`);
}

async function main() {
    try {
        await client.connect();
        const data = await fetchSensorData();
        await insertReadings(data);
    } catch (err) {
        console.error('[!] Error:', err);
    } finally {
        await client.end();
    }
}

main();
