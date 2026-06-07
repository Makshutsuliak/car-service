import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ReportsPage = () => {
  const [stats, setStats] = useState({
    monthlyExpenses: [],
    monthlyOrders: [],
    yearlyCars: [],
    servicesDistribution: [],
    servicesPerOwner: [],
    servicesByPriceRange: [],
  });

  useEffect(() => {
    fetch("${VITE_API_URL}/api/stats")
      .then((res) => res.json())
      .then((data) =>
        setStats({
          monthlyExpenses: data.monthlyExpenses || [],
          monthlyOrders: data.monthlyOrders || [],
          yearlyCars: data.yearlyCars || [],
          servicesDistribution: data.servicesDistribution || [],
          servicesPerOwner: data.servicesPerOwner || [],
          servicesByPriceRange: data.servicesByPriceRange||[],
        })
      )
      .catch((err) => console.error("Error loading stats:", err));
  }, []);

  const avgExpensesData = {
    labels: stats.monthlyExpenses.map((m) => m.month),
    datasets: [
      {
        label: "Сума витрат (грн)",
        data: stats.monthlyExpenses.map((m) => m.sum_spent),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const ordersData = {
    labels: stats.monthlyOrders.map((m) => m.month),
    datasets: [
      {
        label: "Кількість замовлень",
        data: stats.monthlyOrders.map((m) => m.orders_count),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  const carsData = {
    labels: stats.yearlyCars.map((y) => y.year),
    datasets: [
      {
        label: "Авто обслуговувалось",
        data: stats.yearlyCars.map((y) => y.serviced_cars),
        backgroundColor: "rgba(255, 206, 86, 0.5)",
      },
    ],
  };

  const servicesDistribution = {
    labels: stats.servicesDistribution.map((s) => s.service_name),
    datasets: [
      {
        label: "Послуги",
        data: stats.servicesDistribution.map((s) => s.usage_count),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
      },
    ],
  };

  const servicesPerOwnerData = {
    labels: stats.servicesPerOwner.map((o) => `${o.firstname} ${o.lastname}`),
    datasets: [
      {
        label: "Послуги на власника",
        data: stats.servicesPerOwner.map((o) => Number(o.services_count)),
        backgroundColor: "rgba(153, 102, 255, 0.5)",
      },
    ],
  };
  const servicesByPriceRangeData = {
    labels: stats.servicesByPriceRange.map((s) => s.price_range),
    datasets: [
      {
        label: "Послуги за ціновими діапазонами",
        data: stats.servicesByPriceRange.map((s) => Number(s.services_count)),
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(153, 102, 255, 0.5)",
        ],
      },
    ],
  };
  



  return (
    <div className="mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Звітність</h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Витрати клієнтів щомісячно", chart: <Line data={avgExpensesData} /> },
          { title: "Кількість замовлень", chart: <Bar data={ordersData} /> },
          { title: "Кількість авто, що обслуговувалось по роках", chart: <Bar data={carsData} /> },
          { title: "Кількість наданих послуг за типом", chart: <Pie data={servicesDistribution} /> },
          { title: "Кількість послуг для клієнта", chart: <Bar data={servicesPerOwnerData} /> },
          { title: "Послуги за ціновими діапазонами", chart: <Bar data={servicesByPriceRangeData} /> },
        ].map((item, idx) => (
          <div
            key={idx}
            className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-200 transition-colors flex flex-col"
          >
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <div className="h-64"> {/* однакова висота для всіх */}
              {React.cloneElement(item.chart, {
                options: {
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                },
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
}
export default ReportsPage;
