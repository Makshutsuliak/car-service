import fetch from "node-fetch";

export default async function handler(req, res) {
  const vin = req.query.vin;
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
    res.status(200).json(data);
  } catch {
    res.status(500).json({ error: "Помилка отримання даних з VIN API" });
  }
}
