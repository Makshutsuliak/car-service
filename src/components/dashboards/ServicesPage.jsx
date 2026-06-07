import React, { useState, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "../ui/button";

const ServicesPage = () => {
  const [search, setSearch] = useState("");
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedService, setSelectedService] = useState(null);

  const printRef = useRef();

  const searchCar = async () => {
    const cleaned = search.trim();
    if (!cleaned) {
      setCars([]);
      setSelectedCar(null);
      setSelectedService(null);
      return;
    }
    try {
      const res = await fetch(`/api/cars/search?query=${encodeURIComponent(cleaned)}`);
      const data = await res.json();
      setCars(data);
      setSelectedCar(null);      
      setSelectedService(null);  
    } catch (error) {
      console.error("Помилка пошуку авто:", error);
    }
  };
  

  const fetchCarServices = async (carId) => {
    try {
      const res = await fetch(`/api/cars/${carId}/services`);
      const data = await res.json();

      // залишаємо лише ті послуги, дата яких <= сьогодні
      const today = new Date();
      const completed = data.filter(
        (service) => new Date(service.date) <= today
      );

      setServices(completed);
      setSelectedCar(carId);
      setSelectedService(null);
    } catch (error) {
      console.error("Помилка отримання послуг:", error);
    }
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("warranty-certificate.pdf");
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Гарантійні талони</h2>


        {/* Пошук авто завжди доступний */}
        <div className="shadow-md p-4 rounded border mb-6">
          <input
            type="text"
            placeholder="Пошук авто (VIN або номер)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 w-full mb-2 rounded"
          />
          <Button
            onClick={() => searchCar()}
            className="bg-black text-white px-4 py-2 rounded w-full"
          >
            Знайти авто
          </Button>
        </div>

        {/* Якщо знайдені авто і ще не вибрано конкретне авто */}
        {!selectedCar && cars.length > 0 && (
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-3">Знайдені авто</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {cars.map((car) => (
                <li
                  key={car.id}
                  onClick={() => fetchCarServices(car.id)}
                  className="border p-3 rounded cursor-pointer hover:bg-gray-100 shadow-sm min-h-[80px] hover:shadow-xl transition-shadow duration-300"
                >
                  {car.brand} {car.model} – {car.plate} (VIN: {car.vin})
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Якщо вибрано авто, показуємо послуги */}
        {selectedCar && !selectedService && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-3">Послуги для авто</h3>
            {services.length === 0 ? (
              <p className="text-center text-gray-600">
                Для цього авто немає виконаних послуг.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                  <li
                    key={service.id}
                    onClick={() => setSelectedService(service)}
                    className="border p-3 rounded cursor-pointer hover:bg-gray-100 shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    <strong>{service.serviceName}</strong> – {service.price} грн
                    <br />
                    Опис: {service.description || "—"}
                    <br />
                    Дата: {new Date(service.date).toLocaleDateString()}
                    <br />
                    Гарантія до:{" "}
                    {service.warranty_expires
                      ? new Date(service.warranty_expires).toLocaleDateString()
                      : "—"}
                  </li>
                ))}
              </ul>
            )}
            {/* Кнопка повернення до списку авто */}
            <div className="mt-4 text-center">
              <Button
                onClick={() => {
                  setSelectedCar(null);
                  setServices([]);
                }}
                className="bg-gray-600 text-white px-4 py-2 rounded"
              >
                Повернутись до списку авто
              </Button>
            </div>
          </div>
        )}
        {selectedService && (
          <div ref={printRef} className="bg-white p-10 rounded shadow-md mt-6 border">
            <h3 className="text-3xl font-bold text-center mb-6">
              Гарантійний талон
            </h3>

            <p className="mb-4 text-justify">
              Цей гарантійний талон підтверджує виконання робіт та надання послуг
              відповідно до стандартів нашого сервісного центру. Гарантія поширюється
              на виконані роботи та використані матеріали протягом зазначеного терміну.
            </p>

            <div className="mb-6">
              <p><strong>Авто:</strong> {cars.find((c) => c.id === selectedCar)?.brand} {cars.find((c) => c.id === selectedCar)?.model}</p>
              <p><strong>Номерний знак:</strong> {cars.find((c) => c.id === selectedCar)?.plate}</p>
              <p><strong>VIN:</strong> {cars.find((c) => c.id === selectedCar)?.vin}</p>
            </div>

            <h4 className="text-xl font-semibold mb-3">Послуга</h4>
            <p><strong>Назва:</strong> {selectedService.serviceName}</p>
            <p><strong>Опис:</strong> {selectedService.description || "—"}</p>
            <p><strong>Вартість:</strong> {selectedService.price} грн</p>
            <p><strong>Дата виконання:</strong> {new Date(selectedService.date).toLocaleDateString()}</p>
            <p><strong>Гарантія дійсна до:</strong> {new Date(selectedService.warranty_expires).toLocaleDateString()}</p>

            <p className="mt-6 text-sm text-gray-600 text-justify">
              Умови гарантії: гарантія не поширюється на випадки неправильного використання,
              механічні пошкодження, втручання сторонніх осіб або використання неякісних
              витратних матеріалів. Для отримання гарантійного обслуговування необхідно
              пред’явити цей талон.
            </p>

            <div className="mt-12 flex justify-between items-end">
              <div>
                <p><strong>Виконавець:</strong> ____________________</p>
                <p><strong>Дата видачі:</strong> {new Date().toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p><strong>Керівник:</strong> Ініціали К.К.</p>
                <p><strong>Печатка:</strong></p>
                <div className="border w-24 h-24 inline-block"></div>
              </div>
            </div>
          </div>
        )}

        {selectedService && (
          <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => setSelectedService(null)}
            className="bg-gray-600 text-white px-6 py-2 rounded shadow-md hover:bg-gray-700 transition"
          >
            Назад до послуг
          </button>
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-6 py-2 rounded shadow-md hover:bg-green-700 transition"
          >
            Завантажити PDF
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
