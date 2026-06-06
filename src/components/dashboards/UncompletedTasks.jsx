import React from "react";

const UncompletedTasks = ({ services, cars = [], onSelectTask }) => {
  return (
    <div className="mb-6">
      {services.length === 0 ? (
        <p className="text-xl font-semibold m-3 text-center">
          Немає невиконаних завдань.
        </p>
      ) : (
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((service) => {
            const car = cars.find((c) => c.id === service.carId);
            const serviceDate = new Date(service.date);
            const now = new Date();
            const showWarranty = serviceDate <= now;

            return (
              <li
                key={service.id}
                onClick={() => onSelectTask(service)}
                className="border p-4 rounded-lg shadow-md bg-white hover:bg-gray-100 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <strong className="block text-lg text-gray-900">
                    {service.serviceName}
                  </strong>
                  <span className="text-gray-700 font-medium">
                    {service.price} грн
                  </span>
                  <br />
                  <span className="text-sm text-gray-600">
                    Дата робіт:{" "}
                    {serviceDate.toLocaleString("uk-UA", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <br />
                  {showWarranty && (
                    <span className="text-sm text-gray-600">
                      Гарантія до:{" "}
                      {service.warranty_expires
                        ? new Date(service.warranty_expires).toLocaleDateString("uk-UA")
                        : "—"}
                    </span>
                  )}
                  {service.description && (
                    <p className="text-sm text-gray-700 mt-2">
                      <strong>Опис:</strong> {service.description}
                    </p>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-700">
                  <strong>Авто:</strong> {service.carBrand} {service.carModel}
                  <br />
                  <strong>Номер:</strong> {service.carPlate}
                  <br />
                  <strong>VIN:</strong> {service.carVin}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default UncompletedTasks;
