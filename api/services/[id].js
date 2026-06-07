import { db } from "../../configs/index.js";
import { Services } from "../../configs/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "PUT") {
    try {
      const { serviceName, price, warranty_expires, date, description } = req.body;
      await db.update(Services)
        .set({
          serviceName,
          price,
          warranty_expires: warranty_expires ? new Date(warranty_expires) : null,
          date: date ? new Date(date) : new Date(),
          description,
        })
        .where(eq(Services.id, id));
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: "Помилка редагування послуги" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await db.delete(Services).where(eq(Services.id, id));
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: "Помилка видалення послуги" });
    }
  }
}
