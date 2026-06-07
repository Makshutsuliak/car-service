import { db } from "../../configs/index.js";
import { Users } from "../../configs/schema.js";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      await db.insert(Users).values(req.body);
      res.status(200).json({ success: true });
    } catch {
      res.status(500).json({ error: "Помилка додавання користувача" });
    }
  }
}
