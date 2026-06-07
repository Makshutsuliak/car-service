import { db } from "../../../configs/index.js";
import { Services } from "../../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, query } = req;
  const { carId } = query;

  console.log("Incoming carId:", carId);

  if (method === "GET") {
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
