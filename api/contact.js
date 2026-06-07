import { db } from "../configs/index.js";
import { ContactForm } from "../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, url, query, body } = req;

  // POST /api/contact
  if (url === "/api/contact" && method === "POST") {
    try {
      await db.insert(ContactForm).values(body);
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка збереження контактної форми" });
    }
  }

  // GET /api/contact
  if (url === "/api/contact" && method === "GET") {
    try {
      const response = await db.select().from(ContactForm);
      return res.status(200).json(response);
    } catch {
      return res.status(500).json({ error: "Помилка отримання запитів" });
    }
  }

  // DELETE /api/contact/:id
  if (url.startsWith("/api/contact/") && method === "DELETE") {
    try {
      await db.delete(ContactForm).where(eq(ContactForm.id, query.id));
      return res.status(200).json({ success: true });
    } catch {
      return res.status(500).json({ error: "Помилка видалення запиту" });
    }
  }

  return res.status(404).json({ error: "Route not found" });
}
