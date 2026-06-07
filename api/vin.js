import fetch from "node-fetch";

export default async function handler(req, res) {
  const { method, query } = req;

  if (method === "GET") {
    const vin = query.vin;
    try {
      const response = await fetch(`https://api.auto.dev/vin/${vin}`, {
        headers: {
          Authorization: `Bearer ${process.env.AUTO_API_KEY}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const text = await response.text();
        return res.status(response.status).json({
          error: `VIN API error: ${response.status} ${response.statusText}`,
          details: text,
        });
      }
      const data = await response.json();
      return res.status(200).json(data);
    } catch {
      return res.status(500).json({ error: "Помилка отримання даних з VIN API" });
    }
  }

  return res.status(404).json({ error: "Route not found" });
}
