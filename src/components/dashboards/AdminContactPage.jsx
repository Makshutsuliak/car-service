import React, { useEffect, useState } from "react";

const AdminContactPage = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Помилка отримання запитів:", error);
    }
  };
  
  const deleteRequest = async (id) => {
    try {
      await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error) {
      console.error("Помилка видалення запиту:", error);
    }
  };
  

  const copyPhone = (phone) => {
    navigator.clipboard.writeText(phone);
    alert(`Номер ${phone} скопійовано у буфер обміну`);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Запити клієнтів</h2>

        {requests.length === 0 ? (
          <p className="text-center text-gray-600">Немає нових запитів.</p>
        ) : (
          <ul className="space-y-4">
            {requests.map((req) => (
              <li
                key={req.id}
                className="border p-4 rounded shadow-sm flex justify-between items-center hover:shadow-md transition"
              >
                <div>
                  <p><strong>Ім’я:</strong> {req.name}</p>
                  <p>
                    <strong>Телефон:</strong>{" "}
                    <span
                      className="text-blue-600 cursor-pointer hover:underline"
                      onClick={() => copyPhone(req.phone)}
                    >
                      {req.phone}
                    </span>{" "}
                    |{" "}
                    <a
                      href={`tel:${req.phone}`}
                      className="text-green-600 hover:underline"
                    >
                      Дзвонити
                    </a>
                  </p>
                  <p><strong>Коментар:</strong> {req.comment}</p>
                </div>
                <button
                  onClick={() => deleteRequest(req.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                >
                  Виконано
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminContactPage;
