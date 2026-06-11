import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import ScrollToTop from './ui/ScrollToTop';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user) {
      fetchUser(); 
    }
  }, [isSignedIn, user]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`/api/user/${user.id}`);
      const data = await res.json();

      if (!data) {
        await addUser();
      }
    } catch (error) {
      console.error("Помилка отримання користувача:", error);
    }
  };

  const addUser = async () => {
    try {
      const userEmail = user.emailAddresses && user.emailAddresses[0]?.emailAddress;
      if (!userEmail) throw new Error('Email is not available');

      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: user.id,
          lastname: user.lastName,
          firstname: user.firstName,
          email: userEmail,
          user_type: "0",
        }),
      });

      if (res.ok) {
        setMessage("Ваші дані успішно відправлено!");
      } else {
        setMessage("Помилка при відправленні даних!");
      }
    } catch (error) {
      console.error("Помилка додавання користувача:", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center 
                shadow-sm p-3 md:p-5 m-3 md:m-5 
                mb-[60px] lg:mb-[0] w-full max-w-[1200px] mx-auto">
  <ScrollToTop />

  {/* Логотип + меню */}
  <div className="dropdown relative flex flex-col md:flex-row justify-around w-full md:w-auto">
    <img
      className="mx-3 cursor-pointer"
      src="./logo.svg"
      alt="Логотип"
      width={120}
      height={200}
      onClick={() => setIsMenuOpen(!isMenuOpen)}
    />

    <ul
      className={`absolute md:static top-8 left-0 w-full md:w-auto 
                  sm:bg-white shadow-md md:shadow-none 
                  md:flex gap-6 text-center transition-all duration-300 
                  ${isMenuOpen ? "block" : "hidden md:flex"}`}
    >
      <Link to={"/"}>
        <li className="dropdown-item text-primary font-medium 
                       hover:scale-105 transition-all cursor-pointer 
                       p-2 md:p-0">
          Головна
        </li>
      </Link>
      <Link to={"/complexservice"}>
        <li className="dropdown-item text-primary font-medium 
                       hover:scale-105 transition-all cursor-pointer 
                       p-2 md:p-0">
          Послуги СТО
        </li>
      </Link>
      <Link to={"/contactform"}>
        <li className="dropdown-item text-primary font-medium 
                       hover:scale-105 transition-all cursor-pointer 
                       p-2 md:p-0">
          Записатись
        </li>
      </Link>
      <Link to={"/questions"}>
        <li className="dropdown-item text-primary font-medium 
                       hover:scale-105 transition-all cursor-pointer 
                       p-2 md:p-0">
          Відповіді на питання
        </li>
      </Link>
    </ul>
  </div>

  {/* Кнопки справа */}
  {isSignedIn ? (
    <div className='flex items-center gap-3 mt-3 md:mt-0'>
      <UserButton />
      <Link to="/account"><Button size="sm">Мій кабінет</Button></Link>
    </div>
  ) : (
    <SignInButton mode='modal' forceRedirectUrl='/'>
      <Button size="sm">Увійти</Button>
    </SignInButton>
  )}
</div>

  );
};

export default Header;
