import React, { useState, useEffect } from 'react';

const Slider = ({ children }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % React.Children.count(children));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [children]);

  return (
    <div className="relative w-full h-full">
      {React.Children.map(children, (child, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Slider;
