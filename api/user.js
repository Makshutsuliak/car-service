import { db } from "../configs/index.js";
import { Users, Services } from "../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, url, query, body } = req;

  // --- GET /api/user/:id ---
  if (method === "GET" && /^\/api\/user\/[^/]+$/.test(url)) {
    const { id } = query;
    try {
      const response = await db.select().from(Users).where(eq(Users.id, id));
      return res.status(200).json(response[0] || null);
    } catch (err) {
      console.error("Помилка отримання користувача:", err);
      return res.status(500).json({ error: "Помилка отримання користувача" });
    }
  }

  // --- POST /api/user ---
  if (method === "POST" && url === "/api/user") {
    try {
      await db.insert(Users).values(body);
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error("Помилка додавання користувача:", err);
      return res.status(500).json({ error: "Помилка додавання користувача" });
    }
  }

  // --- GET /api/user/:id/services ---
  if (method === "GET" && /^\/api\/user\/[^/]+\/services$/.test(url)) {
    const { id } = query;
    try {
      const response = await db.select().from(Services).where(eq(Services.userId, id));
      return res.status(200).json(response);
    } catch (err) {
      console.error("Помилка отримання послуг користувача:", err);
      return res.status(500).json({ error: "Помилка отримання послуг користувача" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
