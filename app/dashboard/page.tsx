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
            temperature2: readings.temperature2,
            temperature3: readings.temperature3,
            humidity: readings.humidity,
            soilHumidity: readings.soilHumidity,
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

    const temperature2Data = data.map(entry => ({
        value: entry.temperature2,
        time: entry.createdAt,
    }));

    const temperature3Data = data.map(entry => ({
        value: entry.temperature3,
        time: entry.createdAt,
    }));

    const humidityData = data.map(entry => ({
        value: entry.humidity,
        time: entry.createdAt,
    }));

    const soilHumidityData = data.map(entry => ({
        value: entry.soilHumidity,
        time: entry.createdAt,
    }));

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-100 via-green-50 to-white relative">
            <div className="absolute top-6 right-6 z-10">
                <form
                    action={async () => {
                        'use server';
                        await signOut({ redirectTo: '/' });
                    }}
                >
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 shadow-lg">
                        <PowerIcon className="w-5 h-5" />
                        <span>Wyloguj</span>
                    </button>
                </form>
            </div>

            <div className="pt-20 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
                            Panel Szklarni
                        </h1>
                        <p className="text-lg text-green-700 max-w-2xl mx-auto">
                            Monitorowanie parametrów środowiskowych w czasie rzeczywistym
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Temperatura 1
                            </h2>
                            <Graph pointsCount={temperatureData.length} data={temperatureData} />
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Temperatura 2
                            </h2>
                            <Graph pointsCount={temperature2Data.length} data={temperature2Data} />
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Temperatura 3
                            </h2>
                            <Graph pointsCount={temperature3Data.length} data={temperature3Data} />
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Wilgotność powietrza
                            </h2>
                            <Graph pointsCount={humidityData.length} data={humidityData} />
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Wilgotność gleby
                            </h2>
                            <Graph pointsCount={soilHumidityData.length} data={soilHumidityData} />
                        </div>

                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300">
                            <h2 className="text-xl font-bold mb-4 text-gray-800">
                                Oświetlenie
                            </h2>
                            <Graph pointsCount={data.length} data={data.map(entry => ({ value: entry.light, time: entry.createdAt }))} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
