import React from 'react'
import '../index.css'
function Footer() {
  return (
    
    <footer className="bg-gray-100">
   
    <div className="relative mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8 lg:pt-15">
         

    <div className="lg:flex lg:items-end lg:justify-between">
      <div>
        

      <p className=' text-gray-500 font-bold  text-xl  text-center '>Виникли питання? Телефонуй!</p>
      <p className=' text-gray-500 font-bold  text-xl  text-center m-5 '>+380999999999</p>
        <p className="mx-auto mt-6 max-w-md text-center leading-relaxed text-gray-500 lg:text-left">
        Графік роботи: Пн-Пт 9:00 - 18:00, Сб 9:00 - 15:00
        </p>
      </div>

      <ul
        className="mt-12 flex flex-wrap justify-center gap-6 md:gap-8 lg:mt-0 lg:justify-end lg:gap-12"
      >
        <li>
          <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> Про Нас </a>
        </li>

        <li>
          <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> Проєкти </a>
        </li>

        <li>
          <a className="text-gray-700 transition hover:text-gray-700/75" href="#"> Блог </a>
        </li>
      </ul>
    </div>

    <p className="mt-12 text-center text-sm text-gray-500 lg:text-right">
      Copyright &copy; 2026. All rights reserved.
    </p>
  </div>
</footer>)
}

export default Footer
