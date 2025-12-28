import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Hand } from 'lucide-react';
import { useState, useEffect } from 'react';

export function NavigationHints() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000); // Hide after 5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
        >
          <div className="bg-black/50 backdrop-blur-md rounded-2xl px-4 py-3 md:px-6 md:py-4 text-white">
            <div className="flex items-center gap-6">
              {/* Left tap hint */}
              <div className="flex items-center gap-2">
                <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm">Назад</span>
              </div>

              {/* Swipe hint */}
              <div className="flex items-center gap-2 border-l border-r border-white/30 px-6">
                <motion.div
                  animate={{
                    x: [-10, 10, -10],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Hand className="w-4 h-4 md:w-5 md:h-5" />
                </motion.div>
                <span className="text-xs md:text-sm">Свайп</span>
              </div>

              {/* Right tap hint */}
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm">Вперёд</span>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
              </div>
            </div>

            {/* Tap center hint */}
            <div className="text-center mt-2 text-[10px] md:text-xs opacity-75">
              Тап по центру — пауза
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
