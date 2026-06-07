import { getStats } from "../configs/queries.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const stats = await getStats();
      return res.status(200).json(stats);
    } catch {
      return res.status(500).json({ error: "Помилка отримання статистики" });
    }
  }
  return res.status(404).json({ error: "Route not found" });
}
