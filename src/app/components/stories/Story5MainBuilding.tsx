import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { Building2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story5MainBuilding() {
  const { studentData } = useAppStore();

  const mainBuilding = useMemo(() => {
    if (!studentData?.scud?.days) return null;

    const buildingCounts: Record<string, number> = {};

    studentData.scud.days.forEach(day => {
      day.sessions.forEach(session => {
        // Use entry building
        const building = session.entry.building;
        if (building) {
          // Normalize building name if needed
          buildingCounts[building] = (buildingCounts[building] || 0) + 1;
        }
      });
    });

    let maxBuilding = '';
    let maxCount = 0;

    Object.entries(buildingCounts).forEach(([building, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxBuilding = building;
      }
    });

    if (!maxBuilding) return null;

    // Extract number if possible (e.g. "корп.1" -> "1")
    const match = maxBuilding.match(/корп\.?\s*(\d+)/i);
    const buildingNumber = match ? `№${match[1]}` : maxBuilding;

    return {
      fullName: maxBuilding,
      display: buildingNumber,
      visits: maxCount
    };
  }, [studentData]);

  if (!mainBuilding) return null;

  return (
    <StoryCard gradient="from-amber-600 via-orange-600 to-rose-600">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <Building2 className="w-16 h-16 md:w-20 md:h-20 mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-4xl mb-4 md:mb-8">Твой основной корпус</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
          className="relative"
        >
          <div className="text-7xl md:text-9xl mb-2 md:mb-4">{mainBuilding.display}</div>
          
          {/* Glow effect */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute inset-0 bg-white/20 rounded-full blur-3xl -z-10"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-2 md:space-y-3"
        >
          <p className="text-lg md:text-2xl opacity-90">Здесь прошло больше всего времени</p>
          <p className="text-lg md:text-xl opacity-75">Это место знает тебя лучше всех 🏛️</p>
          <p className="text-base md:text-lg opacity-60 mt-2">({mainBuilding.visits} посещений)</p>
        </motion.div>

        {/* Simple building illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-2 pt-2 md:pt-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: i === 2 ? 120 : 80 }}
              transition={{ delay: 1.4 + i * 0.1, type: 'spring' }}
              className={`w-8 md:w-12 bg-white/30 rounded-t-lg ${i === 2 ? 'bg-white/50' : ''}`}
            />
          ))}
        </motion.div>
      </div>
    </StoryCard>
  );
}
