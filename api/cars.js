import { db } from "../configs/index.js";
import { Cars, Services } from "../configs/schema.js";
import { eq, or, like } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, url, query, body } = req;

  // --- Отримати авто користувача ---
  if (method === "GET" && url.endsWith("/api/cars")) {
    const { userId } = query;
    try {
      const response = await db.select().from(Cars).where(eq(Cars.user_id, userId));
      return res.status(200).json(response);
    } catch (err) {
      console.error("Помилка отримання авто:", err);
      return res.status(500).json({ error: "Помилка отримання авто" });
    }
  }

  // --- Додати авто ---
  if (method === "POST" && url.endsWith("/api/cars")) {
    const { user_id, brand, model, plate, vin } = body;
    if (!user_id || !brand || !model || !plate || !vin) {
      return res.status(400).json({ error: "Всі поля обов'язкові" });
    }
    if (vin.length !== 17) {
      return res.status(400).json({ error: "VIN має містити рівно 17 символів" });
    }
    if (plate.length < 4) {
      return res.status(400).json({ error: "Номерний знак занадто короткий" });
    }
    try {
      const existingCar = await db.select().from(Cars).where(or(eq(Cars.plate, plate), eq(Cars.vin, vin)));
      if (existingCar.length > 0) {
        return res.status(409).json({ error: "Авто з таким VIN або номером вже існує" });
      }
      await db.insert(Cars).values({ user_id, brand, model, plate, vin });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Помилка додавання авто:", err);
      return res.status(500).json({ error: "Помилка додавання авто" });
    }
  }

  // --- Пошук авто ---
  if (method === "GET" && url.endsWith("/api/cars/search")) {
    const { query: q } = query;
    try {
      const response = await db.select().from(Cars).where(or(like(Cars.plate, `%${q}%`), like(Cars.vin, `%${q}%`)));
      return res.status(200).json(response);
    } catch (err) {
      console.error("Помилка пошуку авто:", err);
      return res.status(500).json({ error: "Помилка пошуку авто" });
    }
  }

  // --- Послуги для авто ---
  if (method === "GET" && url.includes("/api/cars/") && url.endsWith("/services")) {
    const { carId } = query;
    console.log("Incoming carId:", carId);
    try {
      const response = await db.select().from(Services).where(eq(Services.carId, carId));
      return res.status(200).json(response);
    } catch (err) {
      console.error("Помилка отримання послуг:", err);
      return res.status(500).json({ error: "Помилка отримання послуг" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
