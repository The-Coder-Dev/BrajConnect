import { pgTable, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { business, verificationStatusEnum } from "./business";

export const documentTypeEnum = pgEnum("document_type", [
  "gst",
  "pan",
  "registration_certificate",
  "trade_license",
  "other"
]);

export const businessDocuments = pgTable("business_documents", {
  id: text("id").primaryKey(),
  businessId: text("businessId").notNull().references(() => business.id, { onDelete: "cascade" }),
  documentType: documentTypeEnum("documentType").notNull(),
  fileName: text("fileName").notNull(),
  storagePath: text("storagePath").notNull(),
  mimeType: text("mimeType").notNull(),
  verificationStatus: verificationStatusEnum("verificationStatus").default("not_submitted").notNull(),
  rejectionReason: text("rejectionReason"),
  uploadedAt: timestamp("uploadedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow().notNull(),
  deletedAt: timestamp("deletedAt", { mode: "date" }),
}, (table) => {
  return {
    businessIdIdx: index("documents_business_id_idx").on(table.businessId),
  }
});
