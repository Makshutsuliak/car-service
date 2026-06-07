import { db } from "../../configs/index.js";
import { ContactForm } from "../../configs/schema.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { name, phone, comment } = req.body;
    try {
      await db.insert(ContactForm).values({ name, phone, comment });
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: "Помилка збереження контактної форми" });
    }
  }

  if (req.method === "GET") {
    try {
      const response = await db.select().from(ContactForm);
      res.status(200).json(response);
    } catch {
      res.status(500).json({ error: "Помилка отримання запитів" });
    }
  }
}
