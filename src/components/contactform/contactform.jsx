import { useState, useRef } from "react";
import Header from "../header";
import Footer from "../footer";

const Contactform = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    comment: "",
  });
  const [message, setMessage] = useState("");

  // локальна змінна для збереження часу останнього запиту
  const lastSubmitTime = useRef(null);

  const cleanInput = (value) => value.trim();

  const formatPhone = (value) => {
    let digits = value.replace(/\D/g, "");
    if (!digits.startsWith("380")) {
      digits = "380" + digits.replace(/^380/, "");
    }
    digits = digits.substring(0, 12);

    let formatted = "+";
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length > 3) formatted += " (" + digits.substring(3, 5) + ")";
    if (digits.length > 5) formatted += " " + digits.substring(5, 8);
    if (digits.length > 8) formatted += "-" + digits.substring(8, 10);
    if (digits.length > 10) formatted += "-" + digits.substring(10, 12);

    return formatted;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let cleanedValue = cleanInput(value);

    if (name === "name") {
      cleanedValue = cleanedValue.replace(/[^А-Яа-яA-Za-z\s]/g, "");
    }

    if (name === "phone") {
      cleanedValue = formatPhone(cleanedValue);
    }

    if (name === "comment") {
      cleanedValue = value.replace(/;/g, "");
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: cleanedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = Date.now();
    if (lastSubmitTime.current && now - lastSubmitTime.current < 2 * 60 * 1000) {
      setMessage("Ви вже надсилали дані. Спробуйте ще раз через 2 хвилини!");
      return;
    }

    const digits = formData.phone.replace(/\D/g, "");

    if (!formData.name || !formData.phone) {
      setMessage("Будь ласка, заповніть всі обов'язкові поля!");
      return;
    }

    if (!(digits.startsWith("380") && digits.length === 12)) {
      setMessage("Телефон має починатися з 380 та містити 12 цифр!");
      return;
    }

    try {
      const res = await fetch("${VITE_API_URL}/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("Ваші дані успішно відправлено!");
        setFormData({ name: "", phone: "", comment: "" });
        lastSubmitTime.current = now; // зберігаємо час відправки
      } else {
        setMessage("Помилка при відправленні даних!");
      }
    } catch (error) {
      setMessage("Сталася помилка: " + error.message);
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-lg m-10 mx-auto p-6 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold text-center mb-4">Залиште свої дані</h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* поля форми */}
          <div>
            <label className="block text-gray-700">Ім'я:</label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Телефон:</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+380 (__) ___-__-__" className="w-full border p-2 rounded" required />
          </div>
          <div>
            <label className="block text-gray-700">Коментар:</label>
            <textarea name="comment" value={formData.comment} onChange={handleInputChange} className="w-full border p-2 rounded min-h-[100px]" maxLength={500}></textarea>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Відправити</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default Contactform;
