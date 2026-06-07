import { db } from "../../configs/index.js";
import { Cars } from "../../configs/schema.js";
import { eq, or } from "drizzle-orm";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { userId } = req.query;
    try {
      const response = await db.select().from(Cars).where(eq(Cars.user_id, userId));
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання авто" });
    }
  }

  if (req.method === "POST") {
    const { user_id, brand, model, plate, vin } = req.body;
    if (!user_id || !brand || !model || !plate || !vin) {
      return res.status(400).json({ error: "Всі поля обов'язкові" });
    }
    if (vin.length !== 17) {
      return res.status(400).json({ error: "VIN має містити рівно 17 символів" });
    }
    try {
      const existingCar = await db
        .select()
        .from(Cars)
        .where(or(eq(Cars.plate, plate), eq(Cars.vin, vin)));

      if (existingCar.length > 0) {
        return res.status(409).json({ error: "Авто з таким VIN або номером вже існує" });
      }

      await db.insert(Cars).values({ user_id, brand, model, plate, vin });
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка додавання авто" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
