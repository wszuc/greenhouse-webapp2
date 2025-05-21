import { PowerIcon } from '@heroicons/react/24/outline';
import { Graph } from '../ui/Graph';
import { auth, signOut } from '@/auth';
import { db } from '@/db';
import { readings, users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function Dashboard() {
    const session = await auth();
    const username = session?.user.email;

    const data = await db
        .select({
            temperature: readings.temperature,
            humidity: readings.humidity,
            light: readings.light,
            createdAt: readings.createdAt,
        })
        .from(users)
        .innerJoin(readings, eq(users.id, readings.ownerId))
        .where(eq(users.username, username));

    console.log("Data: ", data);

    const temperatureData = data.map(entry => ({
        value: entry.temperature,
        time: entry.createdAt,
    }));

    const humidityData = data.map(entry => ({
        value: entry.humidity,
        time: entry.createdAt,
    }));

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
                <div>
                    <h2 className="text-xl font-semibold mb-4">Temperatura 🌡️</h2>
                    <Graph pointsCount={temperatureData.length} data={temperatureData} />
                </div>
                <div>
                    <h2 className="text-xl font-semibold mb-4">Wilgotność 💧</h2>
                    <Graph pointsCount={humidityData.length} data={humidityData} />
                </div>
            </div>

            <form
                action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                }}
                className="mt-12"
            >
                <button className="bg-blue-500 font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <PowerIcon className="w-6" />
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </form>
        </main>
    );
}
