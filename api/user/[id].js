import { db } from "../../configs/index.js";
import { Users } from "../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, query } = req;
  const { id } = query;

  // Логування вхідних даних
  console.log("Incoming request:", { method, query, id });

  if (method === "GET") {
    try {
      const response = await db.select().from(Users).where(eq(Users.id, id));
      console.log("DB response:", response);
      return res.status(200).json(response[0] || null);
    } catch (err) {
      console.error("Помилка отримання користувача:", err);
      return res.status(500).json({ error: "Помилка отримання користувача", details: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
