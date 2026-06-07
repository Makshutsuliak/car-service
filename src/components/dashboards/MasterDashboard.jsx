import React, { useState, useEffect, useRef } from "react";
import EditServiceForm from "./EditServiceForm";
import VinSpecSearch from "./VinSpecSearch";
import { Button } from "../ui/button";
import UncompletedTasks from "./UncompletedTasks";

const MasterDashboard = ({ user }) => {
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [uncompletedServices, setUncompletedServices] = useState([]);
  const [showUncompleted, setShowUncompleted] = useState(false);
  const [vin, setVin] = useState("");
  const vinDecoderRef = useRef(null);

  const servicesRef = useRef(null);
  const cleanVin = (value) => value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  const [search, setSearch] = useState("");
  const [newService, setNewService] = useState({ serviceName: "", price: "", warrantyMonths: "" });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    if (selectedCar && services.length > 0 && servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [services, selectedCar, editingService]);

  const fetchCarServices = async (carId) => {
    try {
      const res = await fetch(`${VITE_API_URL}/api/cars/${carId}/services`);
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
      setSelectedCar(carId);
      setSearch("");
      setCars([]);
    } catch (error) {
      console.error("Помилка отримання послуг для авто:", error);
    }
  };


  const searchCar = async () => {
    if (!search.trim()) {
      setCars([]);
      return;
    }
    try {
      const res = await fetch(`${VITE_API_URL}/api/cars/search?query=${search}`);
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error("Помилка пошуку авто:", error);
    }
  };

  const addService = async (carId, serviceName, price, warrantyMonths, date, description) => {
    try {
      await fetch("${VITE_API_URL}/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          carId,
          serviceName,
          price,
          warrantyMonths,
          date,
          description,
        }),
      });
      fetchCarServices(carId);
    } catch (error) {
      console.error("Помилка додавання послуги:", error);
    }
  };


  const editService = async (serviceId, updates) => {
    try {
      await fetch(`${VITE_API_URL}/api/services/${serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      fetchCarServices(selectedCar);
    } catch (error) {
      console.error("Помилка редагування послуги:", error);
    }
  };

  const deleteService = async (serviceId) => {
    try {
      await fetch(`${VITE_API_URL}/api/services/${serviceId}`, { method: "DELETE" });
      fetchCarServices(selectedCar);
    } catch (error) {
      console.error("Помилка видалення послуги:", error);
    }
  };

  const fetchUncompletedServices = async () => {
    try {
      const res = await fetch("/api/services/uncompleted");
      const data = await res.json();
      setUncompletedServices(data);
    } catch (error) {
      console.error("Помилка отримання невиконаних завдань:", error);
    }
  };




  const handleVinClick = (vinValue) => {
    setVin(cleanVin(vinValue));
    if (vinDecoderRef.current) { vinDecoderRef.current.scrollIntoView({ behavior: "smooth" }); }
  };

  useEffect(() => {
    if (showUncompleted) {
      fetchUncompletedServices();
    }
  }, [showUncompleted]);



  return (
    <div className="bg-white text-black min-h-screen">


      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">Кабінет майстра</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Лівий стовпець — пошук авто */}
          <div className="shadow-md p-3 md:p-4 rounded border min-h-[120px]">
            <input
              type="text"
              placeholder="Пошук авто (VIN або номер)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 w-full mb-2 rounded"
            />
            <Button
              onClick={() => { searchCar(search); setEditingService(null); 
                setServices([]); }}
              className="bg-black text-white px-4 py-2 rounded w-full"
            >
              Знайти авто
            </Button>

            <div className="mt-4 min-h-[150px]">
              <h3 className="text-xl font-semibold mb-3">Знайдені авто</h3>
              {cars.length === 0 ? (
                <p>Нічого не знайдено.</p>
              ) : (
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cars.map((car) => (
                    <li
                      key={car.id}
                      onClick={() => fetchCarServices(car.id)}
                      className="border p-3 rounded cursor-pointer hover:bg-gray-100 shadow-sm min-h-[80px] hover:shadow-xl transition-shadow duration-300"
                    >
                      {car.brand} {car.model} – {car.plate} (
                      <span className="text-black
             cursor-pointer hover: shadow-sm" onClick={() => handleVinClick(car.vin)}
                      >
                        VIN: {car.vin}
                      </span>
                      )
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Правий стовпець — невиконані завдання */}
          <div className="shadow-md p-3 md:p-4 rounded border min-h-[120px] flex flex-col">
            <h3 className="text-xl font-semibold mb-3 text-center">Невиконані завдання</h3>
            <Button
              onClick={() => setShowUncompleted(!showUncompleted)}
              className="bg-black text-white px-4 py-2 rounded shadow-md w-full"
            >
              Переглянути невиконані завдання
            </Button>
            {showUncompleted && (
              <div className="mt-4 flex-1">
                <UncompletedTasks
                  services={uncompletedServices}
                  cars={cars}
                  onSelectTask={(service) => {
                    setEditingService(service);   // відкриваємо редактор
                    setShowUncompleted(false);    // закриваємо меню невиконаних
                    setSelectedCar(service.carId); // вибираємо авто для контексту
                    setServices([service]);       // можна одразу показати цей сервіс
                  }}
                />

              </div>
            )}
          </div>
        </div>


        {/* Послуги для авто + форма редагування */}
        <section ref={servicesRef} className="border p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-semibold mb-3 text-center">Послуги для авто</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {selectedCar && (
              <div className="min-w-[250px] min-h-[100px]">
                {services.length === 0 ? (
                  <p>Немає послуг.</p>
                ) : (
                  <ul className="space-y-4">
                    {services.map((service) => {
                      const serviceDate = new Date(service.date);
                      const now = new Date();
                      const showWarranty = serviceDate <= now; // гарантію показуємо лише якщо дата вже настала

                      return (
                        <li
                          key={service.id}
                          className="border p-3 md:p-4 rounded shadow-md min-h-[100px] hover:shadow-lg transition-shadow duration-300"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <strong>{service.serviceName}</strong> – {service.price} грн
                              <br />
                              Дата робіт: {serviceDate.toLocaleDateString("uk-UA")}
                              <br />
                              {showWarranty && (
                                <>
                                  Гарантія до:{" "}
                                  {service.warranty_expires
                                    ? new Date(service.warranty_expires).toLocaleDateString("uk-UA")
                                    : "—"}
                                </>
                              )}
                              {service.description && (
                                <div className="text-gray-600 mt-1">Опис: {service.description}</div>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={() => setEditingService(service)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                              >
                                Редагувати
                              </Button>
                              <Button
                                onClick={() => deleteService(service.id)}
                                className="bg-red-600 text-white px-3 py-1 rounded"
                              >
                                Видалити
                              </Button>
                            </div>
                          </div>
                        </li>
                      );
                    })}

                  </ul>
                )}
              </div>
            )}

            {editingService && (
              <div className="min-w-[250px] min-h-[200px]">
                <EditServiceForm
                  service={editingService}
                  onSave={(updates) => {
                    editService(editingService.id, updates);
                    setEditingService(null);
                  }}
                  onCancel={() => setEditingService(null)}
                />
              </div>
            )}

          </div>
          {selectedCar && (
            <div className="shadow-md border p-4 rounded mt-6 min-h-[180px]">
              <h3 className="text-lg font-semibold mb-2">Додати нову послугу</h3>

              <input
                type="text"
                placeholder="Назва послуги"
                className="border p-2 w-full mb-2"
                value={newService.serviceName}
                onChange={(e) => setNewService({ ...newService, serviceName: e.target.value })}
              />

              <input
                type="number"
                placeholder="Ціна"
                className="border p-2 w-full mb-2"
                value={newService.price}
                onChange={(e) => setNewService({ ...newService, price: e.target.value })}
              />

              <input
                type="number"
                placeholder="Гарантія (місяці)"
                className="border p-2 w-full mb-2"
                value={newService.warrantyMonths}
                onChange={(e) => setNewService({ ...newService, warrantyMonths: e.target.value })}
              />

              <input
                type="date"
                placeholder="Дата створення"
                className="border p-2 w-full mb-2"
                value={newService.date}
                onChange={(e) => setNewService({ ...newService, date: e.target.value })}
              />

              <textarea
                placeholder="Опис"
                className="border p-2 w-full mb-2 min-h-[80px]"
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
              />

              <Button
                onClick={() => {
                  addService(
                    selectedCar,
                    newService.serviceName,
                    newService.price,
                    newService.warrantyMonths,
                    newService.date,
                    newService.description
                  );
                  setNewService({
                    serviceName: "",
                    price: "",
                    warrantyMonths: 12,
                    date: "",
                    description: "",
                  });
                }}
                className="bg-black text-white px-4 py-2 rounded w-full"
              >
                Зберегти
              </Button>
            </div>
          )}




        </section>
        <div ref={vinDecoderRef} className="border p-4 rounded-lg shadow-md mb-6">  <VinSpecSearch vin={vin} setVin={setVin} /></div>

      </div>

    </div>
  );
};

export default MasterDashboard;
