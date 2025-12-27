import { motion } from 'motion/react';
import { StoryCard } from '../StoryCard';
import { MessageSquare, FileText } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function Story13DigitalActivity() {
  const { studentData } = useAppStore();
  
  const statementsCount = studentData?.statements?.total || 0;
  const messagesCount = studentData?.messages?.total_teacher_dialogs || 0;
  const totalActivity = Math.min(statementsCount + messagesCount, 10);

  return (
    <StoryCard gradient="from-orange-500 via-red-500 to-rose-600">
      <div className="text-center space-y-8 max-w-2xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="flex justify-center gap-6"
        >
          <motion.div
            initial={{ rotate: -180 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.4, type: 'spring' }}
          >
            <FileText size={64} />
          </motion.div>
          <motion.div
            initial={{ rotate: 180 }}
            animate={{ rotate: 0 }}
            transition={{ delay: 0.6, type: 'spring' }}
          >
            <MessageSquare size={64} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <h2 className="text-4xl mb-6">Личный кабинет</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="space-y-6"
        >
          <p className="text-2xl">За семестр ты:</p>

          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring' }}
            className="flex items-center justify-center gap-6 bg-white/20 backdrop-blur-sm rounded-2xl p-6"
          >
            <FileText size={48} />
            <div className="text-left">
              <div className="text-5xl mb-2">{statementsCount}</div>
              <div className="text-xl">обращения оформил</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="flex items-center justify-center gap-6 bg-white/20 backdrop-blur-sm rounded-2xl p-6"
          >
            <MessageSquare size={48} />
            <div className="text-left">
              <div className="text-5xl mb-2">{messagesCount}</div>
              <div className="text-xl">сообщений преподавателям</div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="space-y-3 pt-4"
        >
          <p className="text-2xl">Университет — это диалог 💬</p>
          <p className="text-lg opacity-80">
            {totalActivity > 5 
              ? "Ты активно взаимодействовал с системой" 
              : totalActivity > 0 
                ? "Ты начал осваивать цифровые сервисы"
                : "Пока тишина... Может, стоит заглянуть в ЛК? 😉"}
          </p>
        </motion.div>

        {/* Activity indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.3 }}
          className="flex justify-center gap-3"
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 2.5 + i * 0.05, type: 'spring' }}
              className={`w-3 h-3 rounded-full ${
                i < totalActivity ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </motion.div>
      </div>
    </StoryCard>
  );
}
