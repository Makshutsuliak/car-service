import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import ScrollToTop from "../ui/ScrollToTop";
import Header from "../Header";
import ClientDashboard from "../dashboards/ClientDashboard";
import MasterDashboard from "../dashboards/MasterDashboard";
import AdminDashboard from "../dashboards/AdminDashboard";

const Account = () => {
  const { user, isSignedIn } = useUser();
  const [cars, setCars] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [newCar, setNewCar] = useState({ brand: "", model: "", plate: "", vin: "" });
  const [isAdding, setIsAdding] = useState(false);

  
  useEffect(() => {
    if (isSignedIn) {
      fetchUserInfo();
    }
  }, [isSignedIn]);

  useEffect(() => {
    if (userInfo?.user_type === 0) {
      fetchUserCars();
    }
  }, [userInfo]);

  const fetchUserInfo = async () => {
    try {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();
      setUserInfo(data);
    } catch (error) {
      console.error("Помилка отримання інформації про користувача:", error);
    }
  };

  const fetchUserCars = async () => {
    try {
      const res = await fetch(`/api/cars?userId=${user.id}`);
      const data = await res.json();
      setCars(data);
    } catch (error) {
      console.error("Помилка отримання авто:", error);
    }
  };

  const handleAddCar = async () => {
    if (!newCar.brand || !newCar.model || !newCar.plate) return;
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, ...newCar }),
      });
  
      const data = await res.json();
      if (data.error) {
        console.error("Помилка:", data.error);
        return;
      }
  
      await fetchUserCars(); // оновлюємо список авто
      setIsAdding(false);
      setNewCar({ brand: "", model: "", plate: "", vin: "" }); // очищаємо форму
    } catch (error) {
      console.error("Помилка додавання авто:", error);
    }
  };
  

  const fetchCarServices = async (carId) => {
    try {
      const res = await fetch(`/api/cars/${carId}/services`);
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Помилка отримання послуг:", error);
    }
  };

  if (!userInfo) return <p>Завантаження...</p>;

  switch (userInfo.user_type) {
    case 2: // адміністратор
      return (
        <div>
          <Header />
          <ScrollToTop />
          <AdminDashboard services={services} cars={cars} />
        </div>
      );
    case 1: // майстер
      return (
        <div>
          <Header />
          <ScrollToTop />
          <MasterDashboard user={user} />
        </div>
      );
    default: // клієнт
      return (
        <div>
          <Header />
          <ScrollToTop />
          <ClientDashboard
            userInfo={userInfo}
            cars={cars}
            services={services}
            selectedCar={selectedCar}
            setSelectedCar={setSelectedCar}
            isSignedIn={isSignedIn}
            isAdding={isAdding}
            newCar={newCar}
            setNewCar={setNewCar}
            setIsAdding={setIsAdding}
            handleAddCar={handleAddCar}
            fetchCarServices={fetchCarServices}
          />
        </div>
      );
  }
};

export default Account;
