import React, { useState } from "react";
import MasterDashboard from "./MasterDashboard";
import ReportsPage from "./ReportsPage";
import VinSpecSearch from "./VinSpecSearch";
import ServicesPage from "./ServicesPage";

import ExpiredServicesTable from "./ExpiredServicesTable";
import AdminContactPage from "./AdminContactPage";



const AdminDashboard = ({ services, cars, onEditService, onSearchClient, onGenerateReport }) => {
  const [activePage, setActivePage] = useState("reports");  
  const [vin, setVin] = useState("");
  return (
    <div className="min-h-screen bg-gray-100">
  
      {/* Навігація */}
      <nav className="bg-black text-white p-4 shadow-md">
        {/* Для великих екранів */}
        <div className="hidden md:flex justify-center gap-4">
          <button
            onClick={() => setActivePage("reports")}
            className={`px-4 py-2 rounded ${activePage === "reports" ? "bg-gray-700" : "bg-gray-900"}`}
          >
            Звітність та статистика
          </button>
          <button
            onClick={() => setActivePage("master")}
            className={`px-4 py-2 rounded ${activePage === "master" ? "bg-gray-700" : "bg-gray-900"}`}
          >
            Кабінет майстра
          </button>
          <button
            onClick={() => setActivePage("vinSearch")}
            className={`px-4 py-2 rounded ${activePage === "vinSearch" ? "bg-gray-700" : "bg-gray-900"}`}
          >
            VIN пошук
          </button>
          <button
            onClick={() => setActivePage("services")}
            className={`px-4 py-2 rounded ${activePage === "services" ? "bg-gray-700" : "bg-gray-900"}`}
          >
            Керування гарантіями
          </button>
          <button
            onClick={() => setActivePage("expired")}
            className={`px-4 py-2 rounded ${activePage === "expired" ? "bg-gray-700" : "bg-gray-900"}`}
          >
            Протерміновані гарантії
          </button>
          <button
            onClick={() => setActivePage("answers")}
            className={`px-4 py-2 rounded ${activePage === "answers" ? "bg-gray-700" : "bg-gray-900"}`}
          >
            Запити зв’язку
          </button>
        </div>
  
        {/* Для малих екранів */}
        <div className="md:hidden">
          <details className="w-full">
            <summary className="cursor-pointer px-4 py-2 bg-gray-900 rounded text-center">
              Меню
            </summary>
            <div className="flex flex-col gap-2 mt-2">
              <button onClick={() => setActivePage("reports")} className={`px-4 py-2 rounded ${activePage === "reports" ? "bg-gray-700" : "bg-gray-900"}`}>
                Звітність та статистика
              </button>
              <button onClick={() => setActivePage("master")} className={`px-4 py-2 rounded ${activePage === "master" ? "bg-gray-700" : "bg-gray-900"}`}>
                Кабінет майстра
              </button>
              <button onClick={() => setActivePage("vinSearch")} className={`px-4 py-2 rounded ${activePage === "vinSearch" ? "bg-gray-700" : "bg-gray-900"}`}>
                VIN пошук
              </button>
              <button onClick={() => setActivePage("services")} className={`px-4 py-2 rounded ${activePage === "services" ? "bg-gray-700" : "bg-gray-900"}`}>
                Керування гарантіями
              </button>
              <button onClick={() => setActivePage("expired")} className={`px-4 py-2 rounded ${activePage === "expired" ? "bg-gray-700" : "bg-gray-900"}`}>
                Протерміновані гарантії
              </button>
              <button onClick={() => setActivePage("answers")} className={`px-4 py-2 rounded ${activePage === "answers" ? "bg-gray-700" : "bg-gray-900"}`}>
                Запити зв’язку
              </button>
            </div>
          </details>
        </div>
      </nav>
  
      {/* Контент */}
      <main className="p-6">
        {activePage === "reports" && <ReportsPage services={services} cars={cars} onGenerateReport={onGenerateReport} />}
        {activePage === "master" && <MasterDashboard />}
        {activePage === "vinSearch" && <VinSpecSearch vin={vin} setVin={setVin} />}
        {activePage === "services" && (
          <ServicesPage services={services} cars={cars} onEditService={onEditService} onSearchClient={onSearchClient} />
        )}
        {activePage === "expired" && <ExpiredServicesTable />} {/* нова сторінка */}
        {activePage === "answers" && <AdminContactPage />}
      </main>
    </div>
  );
  
};

export default AdminDashboard;
