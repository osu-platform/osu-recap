import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { MapPin, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story7_5TurnstileJourney() {
  const { studentData } = useAppStore();

  const journeys = useMemo(() => {
    if (!studentData?.scud?.days) return null;

    const journeyCounts: Record<string, { from: string; to: string; count: number }> = {};
    let maxCount = 0;

    studentData.scud.days.forEach(day => {
      day.sessions.forEach(session => {
        const from = session.entry.building;
        const to = session.exit.building;

        if (from && to && from !== to) {
          const key = `${from}->${to}`;
          if (!journeyCounts[key]) {
            journeyCounts[key] = { from, to, count: 0 };
          }
          journeyCounts[key].count++;
          if (journeyCounts[key].count > maxCount) maxCount = journeyCounts[key].count;
        }
      });
    });

    return {
      items: Object.values(journeyCounts)
        .map(j => ({
          ...j,
          from: j.from.replace(/корп\.?\s*/i, 'Корпус '),
          to: j.to.replace(/корп\.?\s*/i, 'Корпус ')
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3),
      maxCount
    };
  }, [studentData]);

  if (!journeys || journeys.items.length === 0) return null;

  return (
    <StoryCard gradient="from-purple-500 via-pink-500 to-rose-500">
      <div className="text-center space-y-8 max-w-2xl w-full px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <MapPin size={72} className="mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl mb-4">Путешествие по корпусам</h2>
          <p className="text-xl opacity-90">Твоя карта перемещений</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="space-y-4 w-full max-w-lg mx-auto"
        >
          {journeys.items.map((journey, index) => (
            <motion.div
              key={index}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8 + index * 0.2, type: 'spring' }}
              className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 text-left">
                  <div className="text-lg opacity-90">Вход</div>
                  <div className="text-2xl font-bold">{journey.from}</div>
                </div>
                
                <motion.div
                  animate={{
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                  }}
                >
                  <ArrowRight size={32} />
                </motion.div>
                
                <div className="flex-1 text-right">
                  <div className="text-lg opacity-90">Выход</div>
                  <div className="text-2xl font-bold">{journey.to}</div>
                </div>
              </div>
              
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                className="mt-4 flex items-center gap-2"
              >
                <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(journey.count / journeys.maxCount) * 100}%` }}
                    transition={{ delay: 1.2 + index * 0.2, duration: 1 }}
                    className="h-full bg-white rounded-full"
                  />
                </div>
                <span className="text-lg min-w-[60px] text-right">{journey.count}x</span>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="space-y-3 pt-4"
        >
          <p className="text-2xl">Самый популярный маршрут</p>
          <p className="text-xl opacity-80 italic mt-4">
            Настоящий исследователь кампуса!
          </p>
        </motion.div>

        {/* Map dots animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="flex justify-center gap-8 pt-4"
        >
          {['🏛️', '�', '⚽', '🏃'].map((emoji, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
              className="text-4xl"
            >
              {emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </StoryCard>
  );
}
