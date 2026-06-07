


import React, { useState } from "react";
import data from "@/components/Shared/Data"

const { Category, servicesData, faqData } = data;
const ITEMS_PER_PAGE = 10;

const FAQ = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const currentData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4 m-5">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Пошук за питанням..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-gray-300"
        />
      </div>

      {currentData.length > 0 ? (
        currentData.map((item) => (
          <details key={item.id} className="group [&_summary::-webkit-details-marker]:hidden">
            <summary
              className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 p-4 text-gray-900"
            >
              <h2 className="font-medium text-xl ">{item.question}</h2>
              <svg
                className="size-5 shrink-0 transition duration-300 group-open:-rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </summary>
            <p className="mt-4 px-4 leading-relaxed text-gray-700">{item.answer}</p>
          </details>
        ))
      ) : (
        <p className="text-center text-gray-500">Нічого не знайдено</p>
      )}

      {filteredData.length > 0 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded disabled:opacity-50"
          >
            Попередня
          </button>

          <span>
            Сторінка {currentPage} з {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded disabled:opacity-50"
          >
            Наступна
          </button>
        </div>
      )}
    </div>
  );
};

export default FAQ;