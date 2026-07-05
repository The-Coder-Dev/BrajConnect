import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { USER_ROLES } from "@/lib/auth/roles";

export const userRoleEnum = pgEnum("user_role", USER_ROLES);

export const user = pgTable("user", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	role: userRoleEnum("role").default("visitor").notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull()
});

export const session = pgTable("session", {
	id: text("id").primaryKey(),
	expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
	token: text("token").notNull().unique(),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull(),
	ipAddress: text("ipAddress"),
	userAgent: text("userAgent"),
	userId: text("userId").notNull().references(() => user.id)
});

export const account = pgTable("account", {
	id: text("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: text("userId").notNull().references(() => user.id),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { mode: "date" }),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { mode: "date" }),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
	updatedAt: timestamp("updatedAt", { mode: "date" }).notNull()
});

export const verification = pgTable("verification", {
	id: text("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
	createdAt: timestamp("createdAt", { mode: "date" }),
	updatedAt: timestamp("updatedAt", { mode: "date" })
});
