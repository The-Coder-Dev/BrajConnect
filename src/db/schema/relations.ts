import { relations } from "drizzle-orm";
import { user, session, account } from "./auth";
import { business } from "./business";
import { category } from "./category";
import { location } from "./location";
import { gallery } from "./gallery";
import { social } from "./social";
import { businessCategory } from "./business-category";
import { businessContact } from "./business-contact";
import { businessHours } from "./business-hours";
import { businessServices } from "./business-services";
import { businessDocuments } from "./business-documents";
import { subcategory } from "./subcategory";
import { dynamicFields } from "./dynamic-fields";
import { businessFields } from "./business-fields";
import { amenities } from "./amenities";
import { businessAmenities } from "./business-amenities";

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
  location: one(location, {
    fields: [business.id],
    references: [location.businessId],
  }),
  contact: one(businessContact, {
    fields: [business.id],
    references: [businessContact.businessId],
  }),
  businessCategories: many(businessCategory),
  gallery: many(gallery),
  socials: many(social),
  hours: many(businessHours),
  services: many(businessServices),
  documents: many(businessDocuments),
  businessFields: many(businessFields),
  businessAmenities: many(businessAmenities),
}));

export const categoryRelations = relations(category, ({ many }) => ({
  businessCategories: many(businessCategory),
  subcategories: many(subcategory),
  dynamicFields: many(dynamicFields),
}));

export const businessCategoryRelations = relations(businessCategory, ({ one }) => ({
  business: one(business, {
    fields: [businessCategory.businessId],
    references: [business.id],
  }),
  category: one(category, {
    fields: [businessCategory.categoryId],
    references: [category.id],
  }),
}));

export const locationRelations = relations(location, ({ one }) => ({
  business: one(business, {
    fields: [location.businessId],
    references: [business.id],
  }),
}));

export const businessContactRelations = relations(businessContact, ({ one }) => ({
  business: one(business, {
    fields: [businessContact.businessId],
    references: [business.id],
  }),
}));

export const businessHoursRelations = relations(businessHours, ({ one }) => ({
  business: one(business, {
    fields: [businessHours.businessId],
    references: [business.id],
  }),
}));

export const galleryRelations = relations(gallery, ({ one }) => ({
  business: one(business, {
    fields: [gallery.businessId],
    references: [business.id],
  }),
}));

export const businessServicesRelations = relations(businessServices, ({ one }) => ({
  business: one(business, {
    fields: [businessServices.businessId],
    references: [business.id],
  }),
}));

export const socialRelations = relations(social, ({ one }) => ({
  business: one(business, {
    fields: [social.businessId],
    references: [business.id],
  }),
}));

export const businessDocumentsRelations = relations(businessDocuments, ({ one }) => ({
  business: one(business, {
    fields: [businessDocuments.businessId],
    references: [business.id],
  }),
}));

export const subcategoryRelations = relations(subcategory, ({ one }) => ({
  category: one(category, {
    fields: [subcategory.categoryId],
    references: [category.id],
  }),
}));

export const dynamicFieldsRelations = relations(dynamicFields, ({ one, many }) => ({
  category: one(category, {
    fields: [dynamicFields.categoryId],
    references: [category.id],
  }),
  businessFields: many(businessFields),
}));

export const businessFieldsRelations = relations(businessFields, ({ one }) => ({
  business: one(business, {
    fields: [businessFields.businessId],
    references: [business.id],
  }),
  dynamicField: one(dynamicFields, {
    fields: [businessFields.dynamicFieldId],
    references: [dynamicFields.id],
  }),
}));

export const amenitiesRelations = relations(amenities, ({ many }) => ({
  businessAmenities: many(businessAmenities),
}));

export const businessAmenitiesRelations = relations(businessAmenities, ({ one }) => ({
  business: one(business, {
    fields: [businessAmenities.businessId],
    references: [business.id],
  }),
  amenity: one(amenities, {
    fields: [businessAmenities.amenityId],
    references: [amenities.id],
  }),
}));
