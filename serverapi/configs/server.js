import express from "express";
import fetch from "node-fetch";
import { getStats } from "./queries.js";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { db } from "./configs/index.js";
import { Users, Cars, Services, ContactForm } from "./configs/schema.js";
import { eq, or, like, sql } from "drizzle-orm";


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// --- Користувач ---
app.get("/api/user/:id", async (req, res) => {
  try {
    const response = await db.select().from(Users).where(eq(Users.id, req.params.id));
    res.json(response[0] || null);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання користувача" });
  }
});

app.post("/api/user", async (req, res) => {
  try {
    await db.insert(Users).values(req.body);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Помилка додавання користувача" });
  }
});

// --- Авто ---
app.get("/api/cars", async (req, res) => {
  const { userId } = req.query;
  try {
    const response = await db.select().from(Cars).where(eq(Cars.user_id, userId));
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання авто" });
  }
});


app.post("/api/cars", async (req, res) => {
  const { user_id, brand, model, plate, vin } = req.body;

  // Базова валідація
  if (!user_id || !brand || !model || !plate || !vin) {
    return res.status(400).json({ error: "Всі поля обов'язкові" });
  }
  if (vin.length !== 17) {
    return res.status(400).json({ error: "VIN має містити рівно 17 символів" });
  }
  if (plate.length < 4) {
    return res.status(400).json({ error: "Номерний знак занадто короткий" });
  }

  try {
    // Перевірка на дублікати
    const existingCar = await db
      .select()
      .from(Cars)
      .where(or(eq(Cars.plate, plate), eq(Cars.vin, vin)));

    if (existingCar.length > 0) {
      return res.status(409).json({ error: "Авто з таким VIN або номером вже існує" });
    }

    // Додавання нового авто
    await db.insert(Cars).values({ user_id, brand, model, plate, vin });
    res.json({ success: true });
  } catch (err) {
    console.error("Помилка додавання авто:", err);
    res.status(500).json({ error: "Помилка додавання авто" });
  }
});




// --- Пошук авто ---
app.get("/api/cars/search", async (req, res) => {
  const { query } = req.query;
  try {      
    const response = await db
      .select()
      .from(Cars)
      .where(
        or(
          like(Cars.plate, `%${query}%`),
          like(Cars.vin, `%${query}%`)
        )
      );
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка пошуку авто" });
  }
});

// --- Послуги для авто ---
app.get("/api/cars/:carId/services", async (req, res) => {
  try {
    const response = await db.select().from(Services).where(eq(Services.carId, Number(req.params.carId))  );
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання послуг" });
  }
  

});

// --- Додавання послуги ---
app.post("/api/services", async (req, res) => {
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

    res.json({ success: true });
  } catch (err) {
    console.error("Помилка додавання послуги:", err);
    res.status(500).json({ error: "Помилка додавання послуги" });
  }
});


// --- Редагування послуги ---
app.put("/api/services/:id", async (req, res) => {
  try {
    const { serviceName, price, warranty_expires, date, description } = req.body;
    console.log("Update body:", req.body);

    await db.update(Services)
      .set({
        serviceName,
        price,
        warranty_expires: warranty_expires ? new Date(warranty_expires) : null,
        date: date ? new Date(date) : new Date(),
        description,
      })
      .where(eq(Services.id, req.params.id));

    res.json({ success: true });
  } catch (err) {
    console.error("Помилка редагування послуги:", err);
    res.status(500).json({ error: "Помилка редагування послуги" });
  }
});



// --- Видалення послуги ---
app.delete("/api/services/:id", async (req, res) => {
  try {
    await db.delete(Services).where(eq(Services.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Помилка видалення послуги" });
  }
});

// --- Невиконані завдання ---
app.get("/api/services/uncompleted", async (req, res) => {
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
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання невиконаних завдань" });
  }
});

// --- Контактна форма ---
app.post("/api/contact", async (req, res) => {
  const { name, phone, comment } = req.body;
  try {
    await db.insert(ContactForm).values({ name, phone, comment });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Помилка збереження контактної форми" });
  }
});

app.get("/api/contact", async (req, res) => {
  try {
    const response = await db.select().from(ContactForm);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання запитів" });
  }
});

app.delete("/api/contact/:id", async (req, res) => {
  try {
    await db.delete(ContactForm).where(eq(ContactForm.id, req.params.id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Помилка видалення запиту" });
  }
});

// --- VIN API ---
app.get("/api/vin/:vin", async (req, res) => {
  const vin = req.params.vin;
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
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Помилка отримання даних з VIN API" });
  }
});

// --- Статистика ---
app.get("/api/stats", async (req, res) => {
  try {
    const stats = await getStats();
    
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання статистики" });
  }
});


app.get("/api/user/:id/services", async (req, res) => {
  try {
    const response = await db
      .select()
      .from(Services)
      .where(eq(Services.userId, req.params.id));
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання послуг користувача" });
  }
});

app.get("/api/cars-with-services", async (req, res) => {
  try {
    const response = await db
      .select({
        carId: Cars.id,
        brand: Cars.brand,
        model: Cars.model,
        plate: Cars.plate,
        vin: Cars.vin,
        serviceName: Services.serviceName,
        price: Services.price,
        date: Services.date,
        warranty_expires: Services.warranty_expires,
        description: Services.description,
      })
      .from(Cars)
      .leftJoin(Services, eq(Cars.id, Services.carId));
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: "Помилка отримання авто з послугами" });
  }
});
app.get("/api/services/expired", async (req, res) => {
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

    res.json(response);
  } catch (err) {
    console.error("Помилка отримання прострочених гарантій:", err);
    res.status(500).json({ error: "Помилка отримання прострочених гарантій" });
  }
});



app.listen(3001, () => console.log("Backend running on port 3001"));