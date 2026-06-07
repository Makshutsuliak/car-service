import { db } from "../../configs/index.js";
import { Services, Cars } from "../../configs/schema.js";
import { eq, sql } from "drizzle-orm";

export default async function handler(req, res) {
  try {
    const today = new Date();
    const response = await db
      .select({
        id: Services.id,
        serviceName: Services.serviceName,
        price: Services.price,
        date: Services.date,
        warranty_expires: Services.warranty_expires,
        carId: Services.carId,
        carBrand: Cars.brand,
        carModel: Cars.model,
        carPlate: Cars.plate,
        carVin: Cars.vin,
      })
      .from(Services)
      .leftJoin(Cars, eq(Services.carId, Cars.id))
      .where(sql`${Services.date} > ${today.toISOString()}`);
    res.status(200).json(response);
  } catch {
    res.status(500).json({ error: "Помилка отримання невиконаних завдань" });
  }
}
