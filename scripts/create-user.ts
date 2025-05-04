require('dotenv/config');
const bcrypt = require('bcryptjs');
const { db } = require('@/db');
const { users } = require('@/db/schema');


export async function main() {
    const username = 'admin1';
    const plainPassword = 'admin1';

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await db.insert(users).values({
        username,
        password: hashedPassword,
    });

    console.log(`✅ Użytkownik "${username}" został dodany.`);
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Błąd przy tworzeniu użytkownika:', err);
    process.exit(1);
});
