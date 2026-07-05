import { relations } from "drizzle-orm/_relations";
import { user, session, account } from "./auth";
import { business } from "./business";
import { category } from "./category";
import { location } from "./location";
import { gallery } from "./gallery";
import { social } from "./social";

export const userRelations = relations(user, ({ many }) => ({
	sessions: many(session),
	accounts: many(account),
	businesses: many(business),
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}));

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}));

export const businessRelations = relations(business, ({ one, many }) => ({
	owner: one(user, {
		fields: [business.ownerId],
		references: [user.id],
	}),
	category: one(category, {
		fields: [business.categoryId],
		references: [category.id],
	}),
	location: one(location, {
		fields: [business.id],
		references: [location.businessId],
	}),
	gallery: many(gallery),
	socials: many(social),
}));

export const categoryRelations = relations(category, ({ many }) => ({
	businesses: many(business),
}));

export const locationRelations = relations(location, ({ one }) => ({
	business: one(business, {
		fields: [location.businessId],
		references: [business.id],
	}),
}));

export const galleryRelations = relations(gallery, ({ one }) => ({
	business: one(business, {
		fields: [gallery.businessId],
		references: [business.id],
	}),
}));

export const socialRelations = relations(social, ({ one }) => ({
	business: one(business, {
		fields: [social.businessId],
		references: [business.id],
	}),
}));
