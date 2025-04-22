import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Define password schema
export const passwords = pgTable("passwords", {
  id: serial("id").primaryKey(),
  plaintext: text("plaintext").notNull(),
  hash: text("hash").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertPasswordSchema = createInsertSchema(passwords).pick({
  plaintext: true,
  hash: true,
  createdAt: true,
});

export const passwordGenerationSchema = z.object({
  count: z.number().min(1).max(100).default(5),
  length: z.number().min(8).max(32).default(12),
  costFactor: z.number().min(10).max(14).default(10),
  options: z.object({
    uppercase: z.boolean().default(true),
    lowercase: z.boolean().default(true),
    numbers: z.boolean().default(true),
    special: z.boolean().default(true),
    easyToRead: z.boolean().default(false),
  }),
});

export type InsertPassword = z.infer<typeof insertPasswordSchema>;
export type Password = typeof passwords.$inferSelect;
export type PasswordGenerationOptions = z.infer<typeof passwordGenerationSchema>;
export type GeneratedPassword = {
  password: string;
  hash: string;
};
