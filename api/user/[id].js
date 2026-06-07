import { db } from "../../../configs/index.js";
import { Users } from "../../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const response = await db.select().from(Users).where(eq(Users.id, req.query.id));
      res.status(200).json(response[0] || null);
    } catch {
      res.status(500).json({ error: "Помилка отримання користувача" });
    }
  }
}
