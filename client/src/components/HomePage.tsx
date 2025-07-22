import { useState, useEffect } from "react";
import Categorie from "./Categorie";
import NavBar from "./NavBar/NavBar";
import Banner from "./Banner/Banner"
import Footer from "./Footer";

export default function HomePage() {
  const [showContent, setShowContent] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  


  useEffect(() => {
    const alreadyShown = sessionStorage.getItem("showContent");
    if (alreadyShown === "true") {
      setShowContent(true);
    }

    const images = [
      "/laptop.svg",
      "/vr.svg",
      "/audio.svg",
      "/equipment.svg"
    ];
    images.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const handleBannerComplete = () => {
    setShowContent(true);
    sessionStorage.setItem("showContent", "true");
  };

  return (
    <div className="overflow-hidden">
    <>
      <style>
        {`
          @keyframes slideInLeft {
            0% { transform: translateX(-100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          @keyframes slideInRight {
            0% { transform: translateX(100%); opacity: 0; }
            100% { transform: translateX(0); opacity: 1; }
          }
          .animate-slide-in-left { animation: slideInLeft 0.8s ease forwards; }
          .animate-slide-in-right { animation: slideInRight 0.8s ease forwards; }
        `}
      </style>

      {isDropdownVisible&& (
        <div className="fixed top-[8.5rem] inset-0 z-40 backdrop-blur-sm bg-black/1 transition-all duration-500"></div>
      )}

      {showContent && (
        <div className="fixed top-0 left-0 right-0 z-50 animate-slide-in-left">
          <NavBar onDropdownChange={setIsDropdownVisible} />
        </div>
      )}

      <div className="h-[80px]" />

      <Banner onComplete={handleBannerComplete} skipAnimation={showContent} />


      {showContent && (
        <div className="flex items-center justify-center animate-slide-in-right">
          <div className="w-full pb-4 mx-12 mt-4 grid sm:grid-cols-4 grid-cols-1  gap-12">
            <Categorie imgSrc="/laptop.svg" altText="Laptops" categoryName="Laptops" />
            <Categorie imgSrc="/vr.svg" altText="VR-Brille" categoryName="VR-Brille" />
            <Categorie imgSrc="/audio.svg" altText="Ton & Licht" categoryName="Ton & Licht" />
            <Categorie imgSrc="/equipment.svg" altText="Zubehör" categoryName="Zubehör" />
          </div>
        </div>
        
      )}
      {showContent &&(
        <Footer/>
      )}
    </>
    </div>
  );
}

