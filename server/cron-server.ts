import cron from 'node-cron';
import { syncFromRaspberryPi } from '../scripts/fetch_from_raspberry';

console.log('Starting Cron Server...');

// Harmonogram cron (domyślnie co minutę)
const CRON_SCHEDULE = '* * * * *';

// Funkcja uruchamiająca synchronizację
async function runSync() {
    console.log(`[${new Date().toISOString()}] Cron: Starting data synchronization...`);
    try {
        await syncFromRaspberryPi();
        console.log(`[${new Date().toISOString()}] Cron: Data sync completed successfully`);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] Cron: Data sync failed:`, error);
    }
}

// Start cron job
cron.schedule(CRON_SCHEDULE, runSync);

console.log(`Cron job started with schedule: "${CRON_SCHEDULE}"`);
console.log('Cron server is now running alongside the Next.js app');

// Keep the process alive
process.on('SIGINT', () => {
    console.log('Stopping cron server...');
    process.exit(0);
});
