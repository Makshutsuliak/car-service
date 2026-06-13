import { db } from "../../configs/index.js";
import { ContactForm } from "../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  try {
    if (req.method === "POST") {
      const { name, phone, comment } = req.body;
      await db.insert(ContactForm).values({ name, phone, comment });
      return res.status(200).json({ success: true });
    }

    if (req.method === "GET") {
      const response = await db.select().from(ContactForm);
      return res.status(200).json(response);
    }

    if (req.method === "DELETE") {
      if (!id) return res.status(400).json({ error: "Не передано id" });
      await db.delete(ContactForm).where(eq(ContactForm.id, id));
      return res.status(200).json({ success: true });
    }

    // Якщо метод не підтримується
    return res.status(405).json({ error: "Метод не дозволений" });
  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ error: "Внутрішня помилка сервера" });
  }
}
