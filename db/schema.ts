import { pgTable, serial, text, varchar, doublePrecision, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: serial('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    password: text('password').notNull(),
});

export const readings = pgTable('readings', {
    id: serial('id').primaryKey(),
    ownerId: integer('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    temperature: doublePrecision('temperature').notNull(),
    humidity: doublePrecision('humidity').notNull(),
    light: doublePrecision('light').notNull(),
    createdAt: timestamp('created_at', { withTimezone: false }).defaultNow().notNull(),
});