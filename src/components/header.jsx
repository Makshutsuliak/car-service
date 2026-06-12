import { SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Button } from './ui/button';
import ScrollToTop from './ui/ScrollToTop';
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isSignedIn } = useUser();

  return (
    <div className="flex justify-between items-center 
                shadow-sm p-3 md:p-5 m-3 md:m-5 
                mb-[60px] lg:mb-[0] w-full max-w-screen-xl mx-auto relative">
  <ScrollToTop />

  {/* Логотип + меню */}
  <div className="dropdown relative flex flex-col md:flex-row justify-around w-full md:w-auto">
    <img
      className="mx-3 cursor-pointer"
      src="/logo.svg"
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
      <Link to={"/"}><li className="dropdown-item">Головна</li></Link>
      <Link to={"/complexservice"}><li className="dropdown-item">Послуги СТО</li></Link>
      <Link to={"/contactform"}><li className="dropdown-item">Записатись</li></Link>
      <Link to={"/questions"}><li className="dropdown-item">Відповіді на питання</li></Link>

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
  <div className="flex items-center gap-3 absolute right-3 top-3 md:static md:mt-0">
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
</div>

  );
};

export default Header;
