import React, { useState, useEffect } from 'react';

const Carousel = ({ slides, interval = 5000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
          return 0;
        }
        return prevProgress + 1;
      });
    }, interval / 100);

    return () => clearInterval(timer);
  }, [slides.length, interval]);

  return (
    <div className='relative w-full mx-auto overflow-hidden flex justify-center'>
      <div
        className='flex w-full transition-transform duration-300 ease-in-out'
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className='w-full flex-shrink-0'>
            {slide}
          </div>
        ))}
      </div>
      <div className='flex justify-between items-center mt-2 absolute bottom-2 mx-auto w-1/3 z-50'>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`flex-grow h-1 mx-0.5 hover:h-1.5 rounded-full transition-all cursor-pointer ${
              index === currentSlide ? 'bg-gray-400' : 'bg-gray-500'
            }`}
            onClick={() => setCurrentSlide(index)}
          >
            <div
              className='h-full bg-accent transition-all rounded-full duration-100 ease-linear'
              style={{
                width: `${
                  index === currentSlide
                    ? progress
                    : index < currentSlide
                    ? 100
                    : 0
                }%`,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
