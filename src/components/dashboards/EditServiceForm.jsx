import React, { useState, useEffect } from "react";

const EditServiceForm = ({ service, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    serviceName: "",
    price: "",
    warranty_expires: "",
    date: "",
    description: "",
  });

  useEffect(() => {
    if (service) {
      setFormData({
        serviceName: service.serviceName || "",
        price: service.price || "",
        warranty_expires: service.warranty_expires
          ? new Date(service.warranty_expires).toISOString().slice(0, 10)
          : "",
        date: service.date
          ? new Date(service.date).toISOString().slice(0, 10)
          : "",
        description: service.description || "",
      });
    }
  }, [service]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseInt(formData.price, 10),
      warranty_expires: formData.warranty_expires
        ? new Date(formData.warranty_expires)
        : null,
      date: formData.date ? new Date(formData.date) : new Date(),
    });
    
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border p-4 rounded bg-white shadow-md"
    >
      <h3 className="text-lg font-semibold mb-4">Редагування послуги</h3>

      <label className="block mb-2">
        Назва послуги:
        <input
          type="text"
          name="serviceName"
          value={formData.serviceName}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Ціна:
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Гарантія до:
        <input
          type="date"
          name="warranty_expires"
          value={formData.warranty_expires}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Дата створення:
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        Опис:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border p-2 w-full min-h-[80px]"
          maxLength={500}
        />
      </label>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Зберегти
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Відмінити
        </button>
      </div>
    </form>
  );
};

export default EditServiceForm;
