import { db } from "../../configs/index.js";
import { Services } from "../../configs/schema.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, carId, serviceName, price, warrantyMonths, date, description } = req.body;
    try {
      const warrantyDate = new Date();
      warrantyDate.setMonth(warrantyDate.getMonth() + warrantyMonths);

      await db.insert(Services).values({
        userId,
        carId,
        serviceName,
        price,
        date: date ? new Date(date) : new Date(),
        warranty_expires: warrantyDate,
        description,
      });

      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: "Помилка додавання послуги" });
    }
  }
}
