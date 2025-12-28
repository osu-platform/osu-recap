import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { GraduationCap, Star } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function Story14Moodle() {
  const { studentData } = useAppStore();
  const progress = studentData?.progress;

  const passedCount = progress?.totalPassed || 0;
  const averageGrade = progress?.averageGrade || 0;

  return (
    <StoryCard gradient="from-rose-600 via-purple-600 to-indigo-700">
      <div className="text-center space-y-4 md:space-y-8 max-w-2xl w-full">
        <motion.div
          initial={{ y: -50, opacity: 0, rotate: -180 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
        >
          <GraduationCap className="mx-auto w-16 h-16 md:w-20 md:h-20" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl md:text-4xl mb-4 md:mb-6">Твоя успеваемость</h2>
          <p className="text-lg md:text-2xl opacity-90">За этот семестр:</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4 md:space-y-6"
        >
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 150 }}
            className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 inline-block w-full md:w-auto md:min-w-[400px]"
          >
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
              <div className="text-5xl md:text-7xl">{passedCount}</div>
              <div className="text-left text-lg md:text-2xl">предметов<br />сдано</div>
            </div>
            
            <div className="flex justify-center gap-1 flex-wrap max-w-[300px] mx-auto">
              {[...Array(Math.min(passedCount, 20))].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.2 + i * 0.05 }}
                  className="w-1.5 h-6 md:w-2 md:h-8 bg-white/60 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          {averageGrade > 0 && (
            <motion.div
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 1.5, type: 'spring', stiffness: 150 }}
              className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 md:p-8 inline-block w-full md:w-auto md:min-w-[400px]"
            >
              <p className="text-lg md:text-xl mb-2 md:mb-4">Средний балл</p>
              <div className="flex items-center justify-center gap-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 2, type: 'spring' }}
                  className="text-6xl md:text-8xl"
                >
                  {averageGrade.toFixed(1)}
                </motion.div>
              </div>
              
              <div className="flex justify-center gap-2 mt-4">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 2.3 + i * 0.1, type: 'spring' }}
                  >
                    <Star 
                      fill={i < Math.round(averageGrade) ? 'white' : 'transparent'} 
                      className={`${i < Math.round(averageGrade) ? 'opacity-100' : 'opacity-40'} w-6 h-6 md:w-8 md:h-8`}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.8 }}
          className="text-2xl opacity-90"
        >
          {averageGrade >= 4.5 ? "Отличная работа! 🎓" : "Так держать! 💪"}
        </motion.div>
      </div>
    </StoryCard>
  );
}
