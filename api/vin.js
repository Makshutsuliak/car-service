import fetch from "node-fetch";

export default async function handler(req, res) {
  const { method, url, query } = req;

  // --- Основний VIN пошук ---
  if (method === "GET" && /^\/api\/vin\/[^/]+$/.test(url)) {
    const { vin } = query;
    try {
      const response = await fetch(`https://api.auto.dev/vin/${vin}`, {
        headers: {
          Authorization: `Bearer ${process.env.AUTO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Помилка VIN API" });
    }
  }

  // --- Додатковий запит: наприклад, історія авто ---
  if (method === "GET" && url.endsWith("/api/vin/history")) {
    const { vin } = query;
    try {
      const response = await fetch(`https://api.auto.dev/vin/${vin}/history`, {
        headers: {
          Authorization: `Bearer ${process.env.AUTO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Помилка VIN history API" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
