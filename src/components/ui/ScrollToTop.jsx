import React, { useState, useEffect } from "react";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;

    if (scrollTop > scrollHeight / 4) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
        <a id="scrollToTopBtn"  onClick={scrollToTop}   
        className="fixed bottom-4 right-4 z-50 w-10 h-10 rounded-full  hover:bg-gray-200 bg-[#8d8b8b] p-2 text-white shadow transition"
            >
         <div
             onClick={scrollToTop}
            className="relative mx-[2px] mt-[6px] w-5 h-5 border-l-2 border-t-2 border-black rotate-45 cursor-pointer bg-transparent hover:bg-gray-200 transition"
            aria-label="Back to top"
         >
      
    </div>    
  </a>
      
    )
  );
};

export default ScrollToTop;
