import React, { useState, useEffect } from 'react';

interface BackgroundCarouselProps {
  images: string[];
  transitionTime?: number;
}

const BackgroundCarousel: React.FC<BackgroundCarouselProps> = ({ 
  images, 
  transitionTime = 7000 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, transitionTime);

    return () => clearInterval(intervalId);
  }, [images.length, transitionTime]);

  return (
    <div className="fixed inset-0 w-full h-full">
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1500"
          style={{
            backgroundImage: `url('${image}')`,
            opacity: index === currentImageIndex ? 1 : 0,
            zIndex: index === currentImageIndex ? -1 : -2,
            filter: ' brightness(0.5)',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
};

export default BackgroundCarousel;