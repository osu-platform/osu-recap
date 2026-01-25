import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { GraduationCap } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function Story14Moodle() {
  const { studentData } = useAppStore();
  const progress = studentData?.progress;

  const module1Passed = progress?.module1Stats.passedCount || 0;
  const module1Avg = progress?.module1Stats.averageGrade || 0;
  
  const module2Passed = progress?.module2Stats.passedCount || 0;
  const module2Avg = progress?.module2Stats.averageGrade || 0;
  
  const finalPassed = progress?.finalStats.passedCount || 0;
  const finalAvg = progress?.finalStats.averageGrade || 0;

  return (
    <StoryCard gradient="from-violet-600 via-purple-600 to-fuchsia-700">
      <div className="text-center space-y-4 max-w-2xl w-full px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-2"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-1">Твоя успеваемость</h2>
        </motion.div>

        {/* Модули в одном блоке */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          {/* Модуль 1 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">1</div>
                <span className="text-lg font-semibold">Первый модуль</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">{module1Passed}</div>
                  <div className="text-xs opacity-70">сдано</div>
                </div>
                {module1Avg > 0 && (
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">{module1Avg.toFixed(2)}</div>
                    <div className="text-xs opacity-70">ср. балл</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Модуль 2 */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">2</div>
                <span className="text-lg font-semibold">Второй модуль</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold">{module2Passed}</div>
                  <div className="text-xs opacity-70">сдано</div>
                </div>
                {module2Avg > 0 && (
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300">{module2Avg.toFixed(2)}</div>
                    <div className="text-xs opacity-70">ср. балл</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Итоги семестра - большой блок */}
        <motion.div
          initial={{ y: 50, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring' }}
          className="bg-gradient-to-br from-pink-500/30 to-purple-600/30 backdrop-blur-sm rounded-3xl p-6 md:p-8 border-2 border-white/20 mt-6"
        >
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            <GraduationCap className="mx-auto w-12 h-12 mb-3" />
            <div className="text-xl md:text-2xl font-semibold mb-4">Итоги семестра</div>
          </motion.div>
          
          <div className="flex items-center justify-center gap-8 md:gap-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.6, type: 'spring', stiffness: 200 }}
              className="text-center"
            >
              <motion.div
                className="text-5xl md:text-7xl font-bold mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                {finalPassed}
              </motion.div>
              <div className="text-sm md:text-base opacity-80">предметов<br/>сдано</div>
            </motion.div>
            
            {finalAvg > 0 && (
              <>
                <div className="w-px h-16 bg-white/20" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
                  className="text-center"
                >
                  <motion.div
                    className="text-5xl md:text-7xl font-bold mb-2 text-yellow-300"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ delay: 2.2, duration: 0.5 }}
                  >
                    {finalAvg.toFixed(2)}
                  </motion.div>
                  <div className="text-sm md:text-base opacity-80">средний<br/>балл</div>
                </motion.div>
              </>
            )}
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="mt-6 text-lg md:text-xl"
          >
            {finalAvg >= 4.5 ? "Отличная работа! 🎓" : finalAvg >= 3.5 ? "Хороший результат! 💪" : "Так держать! 📚"}
          </motion.div>
        </motion.div>
      </div>
    </StoryCard>
  );
}
