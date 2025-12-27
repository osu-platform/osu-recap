import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { DoorOpen } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useMemo } from 'react';

export function Story7FavoriteTurnstile() {
  const { studentData } = useAppStore();

  const favoriteTurnstile = useMemo(() => {
    if (!studentData?.scud?.days) return null;

    const turnstileCounts: Record<string, { count: number; building: string; name: string }> = {};

    studentData.scud.days.forEach(day => {
      day.sessions.forEach(session => {
        const { building, turnstile } = session.entry;
        if (building && turnstile) {
          const key = `${building}-${turnstile}`;
          if (!turnstileCounts[key]) {
            turnstileCounts[key] = { count: 0, building, name: turnstile };
          }
          turnstileCounts[key].count++;
        }
      });
    });

    let maxTurnstile = null;
    let maxCount = 0;

    Object.values(turnstileCounts).forEach(item => {
      if (item.count > maxCount) {
        maxCount = item.count;
        maxTurnstile = item;
      }
    });

    if (!maxTurnstile) return null;

    return {
      name: maxTurnstile.name,
      building: maxTurnstile.building,
      count: maxCount
    };
  }, [studentData]);

  if (!favoriteTurnstile) return null;

  return (
    <StoryCard gradient="from-rose-500 via-pink-500 to-purple-600">
      <div className="text-center space-y-8 max-w-2xl">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <div className="relative inline-block">
            <DoorOpen size={72} className="mx-auto" />
            <motion.div
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 0.5,
                repeat: 3,
                delay: 0.5,
              }}
              className="absolute -top-2 -right-2 text-3xl"
            >
              ✨
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl mb-6">Твой любимый турникет</h2>
        </motion.div>

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 150 }}
          className="space-y-6"
        >
          <div className="inline-block px-12 py-6 bg-white/20 rounded-3xl backdrop-blur-sm">
            <div className="text-7xl mb-2">{favoriteTurnstile.name}</div>
            <div className="text-2xl opacity-90">({favoriteTurnstile.building})</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <p className="text-3xl">Ты прошёл через него</p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="text-7xl"
          >
            {favoriteTurnstile.count}
          </motion.div>
          <p className="text-3xl">раза</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-xl italic opacity-80 pt-4"
        >
          Он узнавал тебя с первого «пик» 🎯
        </motion.div>

        {/* Achievement badge style */}
        <motion.div
          initial={{ rotate: -180, scale: 0 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ delay: 1.7, type: 'spring' }}
          className="inline-block"
        >
          <div className="w-24 h-24 rounded-full bg-white/30 flex items-center justify-center border-4 border-white/50">
            <span className="text-4xl">🏆</span>
          </div>
        </motion.div>
      </div>
    </StoryCard>
  );
}
