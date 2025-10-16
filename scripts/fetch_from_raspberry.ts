import 'dotenv/config';
import dayjs from 'dayjs';
import { db } from '@/db'; // importujemy gotowy db z pool i schema
import { readings, events } from '@/db/schema';

const OWNER_ID = 1;

interface SensorReading {
    temperature: number;
    temperature2: number;
    temperature3: number;
    humidity: number;
    soilHumidity: number;
    light: number;
    timestamp: string; // ISO 8601
}

interface EventEntry {
    info: string;
    date: string;
    uid?: string;
}

async function fetchSensorData(): Promise<{ readings: SensorReading[]; events: EventEntry[] }> {
    const res = await fetch('http://192.168.1.16:8000/synchronize-data');
    if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
    const json = await res.json();

    const readingsJson = json.conditions || [];
    const eventsJson = json.events || [];

    const readingsData: SensorReading[] = readingsJson.map((entry: any) => ({
        temperature: entry.temp_1,
        temperature2: entry.temp_2 || entry.temp_1,
        temperature3: entry.temp_3 || entry.temp_1,
        humidity: entry.humidity,
        soilHumidity: entry.soil_humidity || entry.humidity,
        light: entry.lighting,
        timestamp: entry.date,
    }));

    const eventsData: EventEntry[] = eventsJson.map((entry: any) => ({
        info: entry.info,
        uid: entry.uid,
        date: entry.date,
    }));

    return { readings: readingsData, events: eventsData };
}

async function insertReadings(readingsData: SensorReading[]) {
    if (!readingsData.length) return;
    await db.insert(readings).values(
        readingsData.map(r => ({
            ownerId: OWNER_ID,
            temperature: r.temperature,
            temperature2: r.temperature2,
            temperature3: r.temperature3,
            humidity: r.humidity,
            soilHumidity: r.soilHumidity,
            light: r.light,
            createdAt: dayjs(r.timestamp).toDate()
        }))
    );
}

async function insertEvents(eventsData: EventEntry[]) {
    if (!eventsData.length) return;
    await db.insert(events).values(
        eventsData.map(e => ({
            info: e.info,
            uid: e.uid || 'raspberry',
            createdAt: dayjs(e.date).toDate()
        }))
    );
}

export async function syncFromRaspberryPi() {
    const { readings: readingsData, events: eventsData } = await fetchSensorData();
    await insertReadings(readingsData);
    await insertEvents(eventsData);
}
