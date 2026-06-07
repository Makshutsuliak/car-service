import { db } from "../configs/index.js";
import { Users, Services } from "../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, url, body } = req;

  // GET /api/user/:id
  if (url.startsWith("/api/user/") && method === "GET" && !url.endsWith("/services")) {
    const id = url.split("/api/user/")[1];
    try {
      const response = await db.select().from(Users).where(eq(Users.id, id));
      return res.status(200).json(response[0] || null);
    } catch {
      return res.status(500).json({ error: "Помилка отримання користувача" });
    }
  }

  // POST /api/user
  if (url === "/api/user" && method === "POST") {
    try {
      await db.insert(Users).values(body);
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка додавання користувача" });
    }
  }

  // GET /api/user/:id/services
  if (url.startsWith("/api/user/") && url.endsWith("/services") && method === "GET") {
    const id = url.split("/api/user/")[1].replace("/services", "");
    try {
      const response = await db.select().from(Services).where(eq(Services.userId, id));
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання послуг користувача" });
    }
  }

  // Якщо маршрут не знайдено
  return res.status(404).json({ error: "Route not found" });
}
