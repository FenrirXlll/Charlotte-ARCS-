
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface BannerSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
}

interface BannerSliderProps {
  slides: BannerSlide[];
  autoplay?: boolean;
  interval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({
  slides,
  autoplay = true,
  interval = 5000
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (autoplay && !isPaused) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, interval);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentSlide, autoplay, interval, isPaused]);

  return (
    <div 
      className="relative overflow-hidden h-[300px] md:h-[500px] lg:h-[600px]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div 
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="min-w-full h-full relative">
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-6 md:p-10">
              <div className="text-center text-white max-w-xl animate-scale-in">
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3">{slide.title}</h2>
                <p className="text-sm md:text-lg mb-6 max-w-lg mx-auto">{slide.subtitle}</p>
                <Button 
                  asChild
                  className="bg-white text-charlotte-dark hover:bg-white/90"
                >
                  <Link to={slide.buttonLink}>{slide.buttonText}</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 border-none text-white rounded-full h-10 w-10"
        onClick={prevSlide}
      >
        <ChevronLeft size={20} />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 hover:bg-white/40 border-none text-white rounded-full h-10 w-10"
        onClick={nextSlide}
      >
        <ChevronRight size={20} />
      </Button>

      {/* Dots Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === index ? 'bg-white w-7' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerSlider;
