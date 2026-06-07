import { db } from "../../configs/index.js";
import { Users } from "../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  if (method === "GET") {
    try {
      const response = await db.select().from(Users).where(eq(Users.id, id));
      return res.status(200).json(response[0] || null);
    } catch (err) {
      return res.status(500).json({ error: "Помилка отримання користувача" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
