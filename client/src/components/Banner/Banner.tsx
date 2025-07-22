import React, { useState, useEffect } from "react";

type BannerProps = {
  onComplete: () => void;
  skipAnimation?: boolean;
};


const Banner: React.FC<BannerProps> = ({ onComplete, skipAnimation = false }) => {
  const [showSecond, setShowSecond] = useState(skipAnimation);

  useEffect(() => {
    if (!skipAnimation && showSecond) {
      const timer = setTimeout(() => {
        onComplete(); 
      }, 1000); 
      return () => clearTimeout(timer);
    }
  }, [showSecond, onComplete, skipAnimation]);

  if (skipAnimation) {
    return (
      <div className="relative overflow-hidden h-[300px] bg-transparent flex items-center justify-center">
        <span className="text-[8vw] font-large text-[black] text-shadow-lg">
          Such dir was aus
        </span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden h-[300px] bg-transparent flex items-center justify-center">
      <style>
        {`
          @keyframes scaleInOut {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            25% {
              transform: scale(1);
              opacity: 1;
            }
            75% {
              transform: scale(1);
              opacity: 1;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }

          @keyframes scaleInStay {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          .animate-scale-in-out {
            animation: scaleInOut 2s ease forwards;
          }

          .animate-scale-in-stay {
            animation: scaleInStay 1s ease forwards;
          }
        `}
      </style>

      {!showSecond && (
        <div
          className="absolute flex h-[full] bg-transparent animate-scale-in-out"
          onAnimationEnd={() => setShowSecond(true)}
        >
          <span className="text-[6vw] font-large text-[black] text-shadow-lg">
            Willkommen bei Gimme Gear!
          </span>
        </div>
      )}

      {showSecond && (
        <div className="absolute flex h-[full] bg-transparent animate-scale-in-stay">
          <span className="text-[8vw] font-large text-[black] text-shadow-lg">
            Such dir was aus
          </span>
        </div>
      )}
    </div>
  );
};

export default Banner;