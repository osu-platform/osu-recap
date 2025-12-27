import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { BarChart3 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story6BuildingRating() {
  const { studentData } = useAppStore();

  const buildingStats = useMemo(() => {
    if (!studentData?.scud?.days) return [];

    const buildingCounts: Record<string, number> = {};
    let totalVisits = 0;

    studentData.scud.days.forEach(day => {
      day.sessions.forEach(session => {
        const building = session.entry.building;
        if (building) {
          buildingCounts[building] = (buildingCounts[building] || 0) + 1;
          totalVisits++;
        }
      });
    });

    return Object.entries(buildingCounts)
      .map(([name, count]) => ({
        name: name.replace(/корп\.?\s*/i, 'Корпус '),
        count,
        percent: Math.round((count / totalVisits) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4); // Top 4
  }, [studentData]);

  if (buildingStats.length === 0) return null;

  return (
    <StoryCard gradient="from-orange-600 via-red-500 to-pink-600">
      <div className="text-center space-y-8 max-w-2xl w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <BarChart3 size={64} className="mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl">Где ты бывал чаще всего</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-6 w-full max-w-md mx-auto"
        >
          {buildingStats.map((building, index) => (
            <motion.div
              key={building.name}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.2, type: 'spring' }}
              className="space-y-2"
            >
              <div className="flex justify-between text-xl">
                <span>{building.name}</span>
                <span>{building.percent}%</span>
              </div>
              <div className="h-12 bg-white/20 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${building.percent}%` }}
                  transition={{ delay: 1 + index * 0.2, duration: 1, ease: "easeOut" }}
                  className="absolute top-0 left-0 h-full bg-white/80"
                />
                <div className="absolute inset-0 flex items-center px-4 text-black/60 font-bold">
                   {building.count} посещений
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-xl opacity-80"
        >
          Твоя университетская география 🗺️
        </motion.div>
      </div>
    </StoryCard>
  );
}
