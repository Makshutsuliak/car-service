import { pgTable, serial, varchar, integer, timestamp, smallint, text } from "drizzle-orm/pg-core";

export const Users = pgTable("users", {
  id: varchar("id",50).primaryKey(),
  email: varchar("email", { length: 100 }).notNull(),
  firstname: varchar("firstname", { length: 50 }).notNull(),
  lastname: varchar("lastname", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  user_type: smallint("user_type").default(0),
});

export const Cars = pgTable("cars", {
    id: serial("id").primaryKey(),
    user_id: varchar("user_id",50).notNull(),
    brand: varchar("brand", 100).notNull(),
    model: varchar("model", 100).notNull(),
    plate: varchar("plate", 20).notNull().unique(),
    vin: varchar("vin",17).notNull().unique(),
  });

export const Services = pgTable("services", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id",50).notNull().references(() => Users.id, { onDelete: "cascade" }),
  carId: integer("car_id").notNull().references(() => Cars.id, { onDelete: "cascade" }),
  serviceName: varchar("service_name", { length: 255 }).notNull(),
  date: timestamp("date").defaultNow().notNull(),
  price: integer("price").notNull(), 
  warranty_expires:timestamp("warranty_expires"),
  description:text("description"),
});

export const ContactForm = pgTable("contact_form", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  comment: varchar("comment", { length: 500 }).notNull(),
});
