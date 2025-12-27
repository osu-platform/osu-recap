import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { CheckCircle2 } from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { useEffect } from 'react';

export function Story8Attendance({ onSkip }: { onSkip?: () => void }) {
  const studentData = useAppStore((state) => state.studentData);
  
  // Calculate attendance percentage
  let totalClasses = 0;
  let attendedClasses = 0;

  if (studentData?.attendance?.days) {
    studentData.attendance.days.forEach(day => {
      day.classes.forEach(cls => {
        totalClasses++;
        if (cls.attendance.status === 'present') {
          attendedClasses++;
        } else if (cls.attendance.status === 'partial') {
          attendedClasses += 0.5; // Count partial as half? Or maybe based on time?
        }
      });
    });
  }

  useEffect(() => {
    if (totalClasses === 0 && onSkip) {
      onSkip();
    }
  }, [totalClasses, onSkip]);

  if (totalClasses === 0) return null;

  const percentage = Math.round((attendedClasses / totalClasses) * 100);
  const circumference = 2 * Math.PI * 100;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <StoryCard gradient="from-purple-600 via-indigo-600 to-blue-600">
      <div className="text-center space-y-8 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        >
          <CheckCircle2 size={72} className="mx-auto" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-4xl mb-6">Ты ходил на пары</h2>
        </motion.div>

        {/* Circular progress */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative inline-block"
        >
          <svg width="280" height="280" className="transform -rotate-90">
            <circle
              cx="140"
              cy="140"
              r="100"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="20"
            />
            <motion.circle
              cx="140"
              cy="140"
              r="100"
              fill="none"
              stroke="white"
              strokeWidth="20"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ delay: 0.8, duration: 2, ease: 'easeOut' }}
            />
          </svg>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="absolute inset-0 flex flex-col items-center justify-center"
          >
            <div className="text-7xl">{percentage}%</div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="space-y-4"
        >
          <p className="text-3xl">
            {percentage >= 90 ? 'Потрясающий результат! 🏆' : 
             percentage >= 70 ? 'Отличный результат 💪' : 
             'Главное — участие 😉'}
          </p>
          <p className="text-xl opacity-80">За семестр ты посетил {percentage}% занятий</p>
        </motion.div>

        {/* Success indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2 }}
          className="flex justify-center gap-3 pt-4"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 2.4 + i * 0.1, type: 'spring' }}
              className="text-3xl"
            >
              {i < Math.round(percentage / 20) ? '✓' : '·'}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </StoryCard>
  );
}
