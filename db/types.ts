import { InferSelectModel } from 'drizzle-orm';
import { users, readings } from '@/db/schema';

export type User = InferSelectModel<typeof users>;
export type Reading = InferSelectModel<typeof readings>;
