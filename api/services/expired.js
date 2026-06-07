import { db } from "../../configs/index.js";
import { Services, Cars, Users } from "../../configs/schema.js";
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
        description: Services.description,
        carId: Cars.id,
        carBrand: Cars.brand,
        carModel: Cars.model,
        carPlate: Cars.plate,
        carVin: Cars.vin,
        ownerId: Users.id,
        ownerFirstName: Users.firstname,
        ownerLastName: Users.lastname,
        ownerEmail: Users.email,
      })
      .from(Services)
      .leftJoin(Cars, eq(Services.carId, Cars.id))
      .leftJoin(Users, eq(Services.userId, Users.id))
      .where(sql`${Services.warranty_expires} < ${today.toISOString()}`);
    res.status(200).json(response);
  } catch {
    res.status(500).json({ error: "Помилка отримання прострочених гарантій" });
  }
}
