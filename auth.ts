import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import z from 'zod';
import { db } from '@/db';
import { User } from '@/db/types';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await db.select().from(users).where(eq(users.username, email));
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user: ', error);
        throw new Error("Failed to fetch user");
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z.object({
                    email: z.string(), password: z.string().min(5)
                })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (passwordMatch) {
                        return {
                            email: user.username
                        };
                    }
                }
                console.log("Invalid credentials");
                return null;

            },
            async session({ session, token }) {
                session.user = token.user;
                return session;
            },
        },
        ),
    ],
});