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
    <div className='flex justify-between items-center shadow-sm p-5 m-5 mb-[100px] lg:mb-[0]'>
      <ScrollToTop />

      {/* меню */}
      <div className="dropdown relative flex justify-around z-50">
        <img
          className="mx-5 cursor-pointer"
          src="./logo.svg"
          alt="Логотип"
          width={150}
          height={300}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        <ul
          className={`absolute lg:static top-8 left-0 w-full sm:w-auto sm:bg-white shadow-md md:shadow-none lg:flex gap-16 text-center transition-all duration-300 ${isMenuOpen ? "block" : "hidden lg:flex"}`}
        >
          <Link to={"/"}>
            <li className="bg-white dropdown-item text-primary font-medium hover:scale-105 transition-all cursor-pointer p-3 md:p-0">
              Головна
            </li>
          </Link>
          <Link to={"/complexservice"}>
            <li className="bg-white text-primary dropdown-item font-medium hover:scale-105 transition-all cursor-pointer p-3 md:p-0">
              Послуги СТО
            </li>
          </Link>
          <Link to={"/contactform"}>
            <li className="bg-white text-primary dropdown-item font-medium hover:scale-105 transition-all cursor-pointer bg-color-primary p-3 md:p-0">
              Записатись на обслуговування
            </li>
          </Link>
          <Link to={"/questions"}>
            <li className="bg-white text-primary dropdown-item font-medium hover:scale-105 transition-all cursor-pointer bg-color-primary p-3 md:p-0">
              Відповіді на часті питання
            </li>
          </Link>
        </ul>
      </div>

      {isSignedIn ? (
        <div className='flex items-center gap-5'>
          <UserButton />
          <Link to="/account"><Button>Мій кабінет</Button></Link>
        </div>
      ) : (
        <SignInButton mode='modal' forceRedirectUrl='/'><Button>Увійти</Button></SignInButton>
      )}
    </div>
  );
};

export default Header;
