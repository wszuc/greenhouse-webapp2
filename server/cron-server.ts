import cron from 'node-cron';
import { syncFromRaspberryPi } from '../scripts/fetch_from_raspberry';

console.log('🚀 Starting Cron Server...');

// Start cron job - runs every minute
cron.schedule('* * * * *', async () => {
    console.log('🔄 Cron: Starting data synchronization...');
    try {
        await syncFromRaspberryPi();
        console.log('✅ Cron: Data sync completed successfully');
    } catch (error) {
        console.error('❌ Cron: Data sync failed:', error);
    }
});

console.log('🕐 Cron job started - running every minute');
console.log('📡 Cron server is now running alongside Next.js app');
console.log('💡 To stop: Press Ctrl+C');

// Keep the process alive
process.on('SIGINT', () => {
    console.log('\n🛑 Stopping cron server...');
    process.exit(0);
});
