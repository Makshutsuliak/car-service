import { db } from "../../configs/index.js";
import { ContactForm } from "../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "DELETE") {
    try {
      await db.delete(ContactForm).where(eq(ContactForm.id, id));
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: "Помилка видалення запиту" });
    }
  }
}
