import { db } from "../configs/index.js";
import { Services, Cars, Users } from "../configs/schema.js";
import { eq, or, like, sql } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, url, query, body } = req;

  // --- Додавання послуги ---
  if (method === "POST" && url === "/api/services") {
    try {
      const { userId, carId, serviceName, price, warrantyMonths, date, description } = body;
      const warrantyDate = new Date();
      warrantyDate.setMonth(warrantyDate.getMonth() + warrantyMonths);

      await db.insert(Services).values({
        userId,
        carId,
        serviceName,
        price,
        date: date ? new Date(date) : new Date(),
        warranty_expires: warrantyDate,
        description,
      });

      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка додавання послуги" });
    }
  }

  // --- Редагування / Видалення ---
  if (url.startsWith("/api/services/") && method === "PUT") {
    const id = query.id;
    try {
      const { serviceName, price, warranty_expires, date, description } = body;
      await db.update(Services)
        .set({
          serviceName,
          price,
          warranty_expires: warranty_expires ? new Date(warranty_expires) : null,
          date: date ? new Date(date) : new Date(),
          description,
        })
        .where(eq(Services.id, id));
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка редагування послуги" });
    }
  }

  if (url.startsWith("/api/services/") && method === "DELETE") {
    const id = query.id;
    try {
      await db.delete(Services).where(eq(Services.id, id));
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка видалення послуги" });
    }
  }

  // --- Невиконані ---
  if (url === "/api/services/uncompleted" && method === "GET") {
    try {
      const today = new Date();
      const response = await db
        .select({
          id: Services.id,
          serviceName: Services.serviceName,
          price: Services.price,
          date: Services.date,
          warranty_expires: Services.warranty_expires,
          carId: Services.carId,
          carBrand: Cars.brand,
          carModel: Cars.model,
          carPlate: Cars.plate,
          carVin: Cars.vin,
        })
        .from(Services)
        .leftJoin(Cars, eq(Services.carId, Cars.id))
        .where(sql`${Services.date} > ${today.toISOString()}`);
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання невиконаних завдань" });
    }
  }

  // --- Прострочені ---
  if (url === "/api/services/expired" && method === "GET") {
    try {
      const today = new Date();
      const response = await db
        .select({
          id: Services.id,
          serviceName: Services.serviceName,
          price: Services.price,
          date: Services.date,
          warranty_expires: Services.warranty_expires,
          description: Services.description,
          carId: Cars.id,
          carBrand: Cars.brand,
          carModel: Cars.model,
          carPlate: Cars.plate,
          carVin: Cars.vin,
          ownerId: Users.id,
          ownerFirstName: Users.firstname,
          ownerLastName: Users.lastname,
          ownerEmail: Users.email,
        })
        .from(Services)
        .leftJoin(Cars, eq(Services.carId, Cars.id))
        .leftJoin(Users, eq(Services.userId, Users.id))
        .where(sql`${Services.warranty_expires} < ${today.toISOString()}`);
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання прострочених гарантій" });
    }
  }

  // --- Якщо маршрут не знайдено ---
  return res.status(404).json({ error: "Route not found" });
}
