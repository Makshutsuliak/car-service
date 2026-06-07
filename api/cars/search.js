import { db } from "../../configs/index.js";
import { Cars } from "../../configs/schema.js";
import { or, like } from "drizzle-orm";

export default async function handler(req, res) {
  const { query } = req.query;
  try {
    const response = await db
      .select()
      .from(Cars)
      .where(or(like(Cars.plate, `%${query}%`), like(Cars.vin, `%${query}%`)));
    res.status(200).json(response);
  } catch {
    res.status(500).json({ error: "Помилка пошуку авто" });
  }
}
