import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import ScrollToTop from './ui/ScrollToTop';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      if (!data) await addUser();
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

      if (!res.ok) throw new Error("Помилка при відправленні даних!");
    } catch (error) {
      console.error("Помилка додавання користувача:", error);
    }
  };

  return (
    <header className="flex justify-between items-center 
                      shadow-sm p-3 md:p-5 m-3 md:m-5 
                      mb-[60px] w-full lg:mb-[0]  mx-auto relative">
      <ScrollToTop />

      {/* Логотип + меню */}
      <div className="dropdown relative flex items-center">
        <img
          className="mx-3 cursor-pointer"
          src="/logo.svg"
          alt="Логотип"
          width={120}
          height={200}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />

        <ul
          className={`absolute md:static top-14 left-0 w-full md:w-auto 
                      sm:bg-white shadow-md md:shadow-none 
                      md:flex gap-6 text-center transition-all duration-300 
                      ${isMenuOpen ? "block" : "hidden md:flex"}`}
        >
          <Link to={"/"}><li className="dropdown-item text-[var(--text-secondary)]">Головна</li></Link>
          <Link to={"/complexservice"}><li className="dropdown-item text-[var(--text-secondary)]">Послуги СТО</li></Link>
          <Link to={"/contactform"}><li className="dropdown-item text-[var(--text-secondary)]">Записатись на обслуговування</li></Link>
          <Link to={"/questions"}><li className="dropdown-item text-[var(--text-secondary)]">Відповіді на часті питання</li></Link>

          {/* Авторизація тільки на мобільних */}
          <li className="block md:hidden mt-2">
            {isSignedIn ? (
              <Link to="/account"><Button size="sm">Мій кабінет</Button></Link>
            ) : (
              <SignInButton mode="modal" forceRedirectUrl="/">
                <Button size="sm">Увійти</Button>
              </SignInButton>
            )}
          </li>
        </ul>
      </div>

      {/* UserButton завжди справа */}
      <div className="flex items-center gap-3 absolute right-3 top-3 md:static">
        <UserButton />
        {isSignedIn ? (
          <div className="hidden md:flex">
            <Link to="/account"><Button size="sm">Мій кабінет</Button></Link>
          </div>
        ) : (
          <div className="hidden md:flex">
            <SignInButton mode="modal" forceRedirectUrl="/">
              <Button size="sm">Увійти</Button>
            </SignInButton>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
