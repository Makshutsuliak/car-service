import React from 'react'
import { Button } from './ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import { Link } from 'react-router-dom'
<link rel='stylesheet' href='./index.css'></link>
import data from "@/components/Shared/Data"

const { Category, servicesData, faqData } = data;

function Info() {
  return (
    <div className="md:m-5 z-10">
      {/* Карусель */}
      <div className="carousel">
        <Carousel>
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold whitespace-normal rounded-md transition-colors">
                  Ремонтуємо швидко, якісно та доступно.
                </h1>
                <div className="carousel_img w-full md:w-1/2">
                  <img
                    src="./carousel_1.jpg"
                    alt=""
                    className="w-full h-auto rounded-md object-cover"
                  />
                </div>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="carousel_img w-full md:w-1/2">
                  <img
                    src="./carousel_2.jpg"
                    alt=""
                    className="w-full h-auto rounded-md object-cover"
                  />
                </div>
                <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold whitespace-normal rounded-md transition-colors">
                  СТО, яке любить вашу машину так, як і ви
                </h1>
              </div>
            </CarouselItem>

            <CarouselItem>
              <div className="flex flex-col md:flex-row items-center gap-4">
                <h1 className="text-center md:text-left text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold whitespace-normal rounded-md transition-colors">
                  Відмінний сервіс для будь-якого авто — завжди поруч!
                </h1>
                <div className="carousel_img w-full md:w-1/2">
                  <img
                    src="./carousel_3.jpg"
                    alt=""
                    className="w-full h-auto rounded-md object-cover"
                  />
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Популярні послуги */}
      <div className="mt-20 md:mt-40">
        <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-bold mb-6">
          Найпопулярніші послуги
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Category.map((category, categoryIndex) => (
            <li
              key={categoryIndex}
              className="bg-[var(--bg-secondary)] hover:scale-105 transition-all hover:font-bold hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] rounded-lg shadow-md p-6 flex flex-col items-center"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-12 h-12 md:w-16 md:h-16"
                />
              </div>
              <h3 className="uppercase font-bold text-lg md:text-xl mb-2 text-center">
                {category.title}
              </h3>
              <ul className="list-inside text-sm md:text-base mb-4 text-center list-none ">
                {category.points.map((point, pointIndex) => (
                  <li key={pointIndex}>{point.description}</li>
                ))}
              </ul>
              <div className="flex gap-4 mt-auto">
                <Link to={"/complexservice"}>
                  <Button className="text-[var(--text-secondary)] shadow-none bg-transparent hover:scale-105 transition-all cursor-pointer hover:text-[var(--text-primary)]">
                    Детальніше
                  </Button>
                </Link>
                <Link to={"/contactform"}>
                  <Button className="hover:bg-[var(--bg-secondary)] hover:scale-105 transition-all cursor-pointer hover:text-primary">
                    Записатись
                  </Button>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}

export default Info