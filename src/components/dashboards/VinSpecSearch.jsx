import React, { useState } from "react";
import { Button } from "../ui/button";

const VinPage = ({ vin, setVin }) => {
  const [vinData, setVinData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const cleanVin = (input) => {
    return input.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  };

  const validateVin = (vinCode) => {
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/; 
    return vinRegex.test(vinCode);
  };

  const fetchVin = async () => {
    const cleanedVin = cleanVin(vin);

    if (!validateVin(cleanedVin)) {
      setError(" VIN має містити рівно 17 символів (латинські літери та цифри, без I, O, Q).");
      setVinData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/vin/${cleanedVin}`);
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setVinData(null);
      } else {
        setVinData(data);
      }
    } catch (err) {
      setError("Не вдалося з’єднатися з бекендом");
      setVinData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">VIN Декодер</h2>
      <input
        type="text"
        placeholder="Введіть VIN"
        value={vin}
        onChange={(e) => setVin(cleanVin(e.target.value))}
        className="border p-2 w-full mb-2 rounded"
      />
      <Button onClick={fetchVin} className="bg-blue-600 text-white px-4 py-2 rounded">
        Отримати дані
      </Button>

      {loading && <p className="mt-4">Завантаження...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}

      {vinData && (
        <div className="mt-6 grid grid-cols-2 gap-6">
          <div className="border p-4 rounded bg-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">Основна інформація</h3>
            <p><strong>VIN:</strong> {vinData.vin}</p>
            <p><strong>Валідність:</strong> {vinData.vinValid ? " Валідний" : " Невалідний"}</p>
            <p><strong>Походження:</strong> {vinData.origin}</p>
            <p><strong>WMI:</strong> {vinData.wmi}</p>
            <p><strong>Тип:</strong> {vinData.type}</p>
          </div>

          <div className="border p-4 rounded bg-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">Автомобіль</h3>
            <p><strong>Марка:</strong> {vinData.make}</p>
            <p><strong>Модель:</strong> {vinData.model}</p>
            <p><strong>Комплектація:</strong> {vinData.trim}</p>
            <p><strong>Стиль:</strong> {vinData.style}</p>
            <p><strong>Кузов:</strong> {vinData.body}</p>
            <p><strong>Двигун:</strong> {vinData.engine}</p>
            <p><strong>Привід:</strong> {vinData.drive}</p>
            <p><strong>Трансмісія:</strong> {vinData.transmission}</p>
          </div>

          {vinData.vehicle && (
            <div className="border p-4 rounded bg-white shadow-md col-span-2">
              <h3 className="text-lg font-semibold mb-2">Деталі виробника</h3>
              <p><strong>Рік:</strong> {vinData.vehicle.year}</p>
              <p><strong>Виробник:</strong> {vinData.vehicle.manufacturer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VinPage;
