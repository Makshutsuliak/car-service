import React, { useEffect, useState } from "react";

const ExpiredServicesTable = () => {
  const [expiredServices, setExpiredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExpired = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/services/expired");
        const data = await res.json();
        if (data.error) {
          setError(data.error);
        } else {
          setExpiredServices(data);
        }
      } catch (err) {
        setError("Не вдалося отримати дані");
      } finally {
        setLoading(false);
      }
    };

    fetchExpired();
  }, []);

  if (loading) return <p className="text-center">Завантаження...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Протерміновані гарантії</h2>
      {expiredServices.length === 0 ? (
        <p className="text-center text-gray-600">Немає протермінованих гарантій.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Назва послуги</th>
                <th className="border p-2">Ціна</th>
                <th className="border p-2">Дата виконання</th>
                <th className="border p-2">Гарантія до</th>
                <th className="border p-2">Опис</th>
                <th className="border p-2">Власник</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Авто</th>
              </tr>
            </thead>
            <tbody>
              {expiredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="border p-2">{service.serviceName}</td>
                  <td className="border p-2">{service.price} грн</td>
                  <td className="border p-2">
                    {new Date(service.date).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="border p-2 text-red-600 font-semibold">
                    {new Date(service.warranty_expires).toLocaleDateString("uk-UA")}
                  </td>
                  <td className="border p-2">{service.description || "—"}</td>
                  <td className="border p-2">
                    {service.ownerFirstName} {service.ownerLastName}
                  </td>
                  <td className="border p-2">
                    <a
                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${service.ownerEmail}&su=Інформація про авто та гарантію&body=Шановний ${service.ownerFirstName} ${service.ownerLastName},%0A%0AАвто: ${service.carBrand} ${service.carModel} (${service.carPlate}, VIN: ${service.carVin})%0AПослуга: ${service.serviceName}%0AДата виконання: ${new Date(service.date).toLocaleDateString("uk-UA")}%0AГарантія до: ${new Date(service.warranty_expires).toLocaleDateString("uk-UA")}%0AОпис: ${service.description || "—"}%0A%0AЗ повагою, сервісний центр`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-words"
                    >
                      {service.ownerEmail}
                    </a>
                  </td>
                  <td className="border p-2">
                    {service.carBrand} {service.carModel} – {service.carPlate} <br className="md:hidden" />
                    <span className="text-gray-500 text-xs md:text-sm">VIN: {service.carVin}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExpiredServicesTable;
