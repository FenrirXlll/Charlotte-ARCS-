
import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Set page as loaded after a small delay to trigger animations
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.645, 0.045, 0.355, 1.000]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex justify-center">
        <div className="w-full max-w-6xl">
          <AnimatePresence mode="wait">
            <motion.div
              key="page-content"
              initial="initial"
              animate={isPageLoaded ? "animate" : "initial"}
              exit="exit"
              variants={pageVariants}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
      
      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button 
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 p-3 bg-charlotte-primary text-white rounded-full shadow-lg hover:bg-charlotte-primary/90 transition-all z-50"
            aria-label="Scroll to top"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
