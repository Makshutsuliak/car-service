import React from "react";
import { Button } from "../ui/button";

const ClientDashboard = ({
  userInfo,
  cars,
  services,
  selectedCar,
  setSelectedCar,
  isSignedIn,
  isAdding,
  newCar,
  setNewCar,
  setIsAdding,
  handleAddCar,
  fetchCarServices
}) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-6xl mx-auto p-10">
        <div className="bg-white shadow-lg rounded-lg p-8 flex flex-col gap-6">
          {userInfo && (
            <div className="min-w-[250px] p-5 shadow-sm border rounded">
              <h2 className="text-2xl font-bold mb-4 text-center">Особистий кабінет</h2>
              <div className="space-y-3">
                <p><strong>Прізвище:</strong> {userInfo.lastname}</p>
                <p><strong>Ім'я:</strong> {userInfo.firstname}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Перша авторизація:</strong> {new Date(userInfo.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}

          {isSignedIn ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              {/* Ліва колонка: авто */}
              <div className="p-5 shadow-sm border rounded">
                <h2 className="text-xl font-semibold mb-4">Ваші авто</h2>
                {cars.length === 0 ? (
                  <p className="mb-4">У вас ще немає зареєстрованого авто.</p>
                ) : (
                  <ul className="mb-4 list-none">
                    {cars.map((car) => (
                      <li
                        key={car.id}
                        onClick={() => {
                          fetchCarServices(car.id);
                          setSelectedCar(car);
                        }}
                        className="border p-3 rounded cursor-pointer hover:bg-gray-100 shadow-sm mb-2"
                      >
                        {car.brand} {car.model} – {car.plate} ({car.vin})
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  onClick={() => setIsAdding(true)}
                  className="bg-black text-white px-4 py-2 rounded w-full shadow-md"
                >
                  Додати авто
                </Button>

                {isAdding && (
                  <div className="mt-4 shadow-md border p-4 rounded">
                    <h3 className="text-lg font-semibold mb-2">Додавання авто</h3>
                    <input
                      type="text"
                      placeholder="Марка авто"
                      className="border p-2 w-full my-2"
                      value={newCar.brand}
                      onChange={(e) => setNewCar({ ...newCar, brand: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Модель авто"
                      className="border p-2 w-full my-2"
                      value={newCar.model}
                      onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Номерний знак"
                      className="border p-2 w-full my-2"
                      value={newCar.plate}
                      onChange={(e) => setNewCar({ ...newCar, plate: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="VIN"
                      className="border p-2 w-full my-2"
                      value={newCar.vin}
                      onChange={(e) => setNewCar({ ...newCar, vin: e.target.value })}
                    />
                    <Button
                      onClick={handleAddCar}
                      className="bg-green-600 text-white px-4 py-2 rounded w-full mt-2 shadow-md"
                    >
                      Зберегти
                    </Button>
                    <Button
                      onClick={() => setIsAdding(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded w-full mt-2 shadow-md"
                    >
                      Відмінити
                    </Button>
                  </div>
                )}
              </div>

              {/* Права колонка: послуги */}
              {selectedCar && (
                <div className="p-5 shadow-sm border rounded">
                  <h2 className="text-xl font-semibold mb-3">Послуги для вибраного авто:</h2>
                  {!Array.isArray(services) || services.length === 0 ? (
                    <p>Немає наданих послуг.</p>
                  ) : (
                    <ul className="list-none">
                      {services.map((service) => (
                        <li key={service.id} className="border p-3 rounded mb-2 shadow-sm">
                          <strong>{service.serviceName}</strong> – {new Date(service.date).toLocaleString()}
                          <br />Ціна: {service.price} грн
                          <br />Гарантія до: {new Date(service.warranty_expires).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                  )}


                </div>
              )}
            </div>
          ) : (
            <p>Будь ласка, увійдіть у систему, щоб переглянути ваші авто.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
