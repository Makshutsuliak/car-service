import pool from "./db.js";


export async function getStats() {
  const monthlyExpenses = await pool.query(`
    SELECT TO_CHAR(date, 'YYYY-MM') AS month, SUM(price) AS sum_spent
    FROM services
    GROUP BY month
    ORDER BY month;
  `);

  const monthlyOrders = await pool.query(`
    SELECT TO_CHAR(date, 'YYYY-MM') AS month, COUNT(*) AS orders_count
    FROM services
    GROUP BY month
    ORDER BY month;
  `);

  const yearlyCars = await pool.query(`
    SELECT DATE_PART('year', date) AS year, COUNT(DISTINCT car_id) AS serviced_cars
    FROM services
    GROUP BY year
    ORDER BY year;
  `);

  const servicesDistribution = await pool.query(`
    SELECT service_name, COUNT(*) AS usage_count
    FROM services
    GROUP BY service_name
    ORDER BY usage_count DESC;
  `);

  const servicesPerOwner = await pool.query(`
    SELECT u.id, u.firstname, u.lastname, COUNT(s.id) AS services_count
    FROM services s
    JOIN users u ON s.user_id = u.id
    GROUP BY u.id, u.firstname, u.lastname
    ORDER BY services_count DESC;
  `);

  const servicesByPriceRange = await pool.query(`
   SELECT 
  CASE 
    WHEN price BETWEEN 0 AND 5000 THEN '0-5000'
    WHEN price BETWEEN 5001 AND 10000 THEN '5001-10000'
    WHEN price BETWEEN 10001 AND 15000 THEN '10001-15000'
    WHEN price BETWEEN 15001 AND 20000 THEN '15001-20000'
    WHEN price > 20000 THEN '20000+'
  END AS price_range,
  COUNT(*) AS services_count,
  CASE 
    WHEN price BETWEEN 0 AND 5000 THEN 1
    WHEN price BETWEEN 5001 AND 10000 THEN 2
    WHEN price BETWEEN 10001 AND 15000 THEN 3
    WHEN price BETWEEN 15001 AND 20000 THEN 4
    WHEN price > 20000 THEN 5
  END AS sort_order
FROM services
GROUP BY price_range, sort_order
ORDER BY sort_order;
`);
  
  return {
    monthlyExpenses: monthlyExpenses.rows,
    monthlyOrders: monthlyOrders.rows,
    yearlyCars: yearlyCars.rows,
    servicesDistribution: servicesDistribution.rows,
    servicesPerOwner: servicesPerOwner.rows,
    servicesByPriceRange: servicesByPriceRange.rows,
  };
  
}
