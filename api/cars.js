import { db } from "../configs/index.js";
import { Cars, Services } from "../configs/schema.js";
import { eq, or, like } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, url, query, body } = req;

  // GET /api/cars
  if (url === "/api/cars" && method === "GET") {
    try {
      const response = await db.select().from(Cars).where(eq(Cars.user_id, query.userId));
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання авто" });
    }
  }

  // POST /api/cars
  if (url === "/api/cars" && method === "POST") {
    const { user_id, brand, model, plate, vin } = body;
    if (!user_id || !brand || !model || !plate || !vin) {
      return res.status(400).json({ error: "Всі поля обов'язкові" });
    }
    if (vin.length !== 17) {
      return res.status(400).json({ error: "VIN має містити рівно 17 символів" });
    }
    try {
      const existingCar = await db.select().from(Cars).where(or(eq(Cars.plate, plate), eq(Cars.vin, vin)));
      if (existingCar.length > 0) {
        return res.status(409).json({ error: "Авто з таким VIN або номером вже існує" });
      }
      await db.insert(Cars).values({ user_id, brand, model, plate, vin });
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка додавання авто" });
    }
  }

  // GET /api/cars/search
  if (url === "/api/cars/search" && method === "GET") {
    try {
      const response = await db.select().from(Cars).where(or(like(Cars.plate, `%${query.query}%`), like(Cars.vin, `%${query.query}%`)));
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка пошуку авто" });
    }
  }

  // GET /api/cars/:carId/services
  if (url.startsWith("/api/cars/") && url.endsWith("/services") && method === "GET") {
    try {
      const response = await db.select().from(Services).where(eq(Services.carId, Number(query.carId)));
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання послуг" });
    }
  }

  // GET /api/cars-with-services
  if (url === "/api/cars-with-services" && method === "GET") {
    try {
      const response = await db
        .select({
          carId: Cars.id,
          brand: Cars.brand,
          model: Cars.model,
          plate: Cars.plate,
          vin: Cars.vin,
          serviceName: Services.serviceName,
          price: Services.price,
          date: Services.date,
          warranty_expires: Services.warranty_expires,
          description: Services.description,
        })
        .from(Cars)
        .leftJoin(Services, eq(Cars.id, Services.carId));
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання авто з послугами" });
    }
  }

  return res.status(404).json({ error: "Route not found" });
}
