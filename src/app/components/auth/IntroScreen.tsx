import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { useAppStore, useAuthStore } from '@/store/appStore';

export function IntroScreen() {
  const { setStage } = useAppStore();
  const { credentials } = useAuthStore();

  const handleStart = () => {
    if (credentials) {
      setStage('scraping'); // Skip login if we have credentials
    } else {
      setStage('security');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md space-y-8"
      >
        <h1 className="text-5xl font-bold tracking-tighter bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          ОГУ Recap
        </h1>
        <p className="text-xl text-gray-400">
          Твой персональный итог осеннего семестра 2025.
          Узнай, сколько времени ты провел в университете, кто твой любимый турникет и многое другое.
        </p>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
            onClick={handleStart}
          >
            {credentials ? 'Продолжить' : 'Начать'} <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
