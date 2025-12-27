import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { ShieldCheck, Lock, Github } from 'lucide-react';
import { useAppStore } from '@/store/appStore';

export function SecurityWarning() {
  const setStage = useAppStore((state) => state.setStage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 space-y-6"
      >
        <div className="flex items-center justify-center w-16 h-16 bg-green-500/10 rounded-full mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-green-500" />
        </div>

        <h2 className="text-2xl font-bold text-center">Безопасность данных</h2>

        <div className="space-y-4 text-gray-400 text-sm">
          <div className="flex gap-3">
            <Lock className="w-5 h-5 text-blue-400 shrink-0" />
            <p>
              Ваш пароль хранится только локально на вашем устройстве. Он используется для авторизации на серверах ОГУ при каждом обновлении данных.
            </p>
          </div>
          <div className="flex gap-3">
            <ShieldCheck className="w-5 h-5 text-green-400 shrink-0" />
            <p>
              Все данные обрабатываются прямо в вашем браузере. Мы не передаем вашу личную информацию на сторонние серверы.
            </p>
          </div>
          <div className="flex gap-3">
            <Github className="w-5 h-5 text-white shrink-0" />
            <p>
              Исходный код проекта полностью открыт на GitHub. Вы можете лично проверить, как работает приложение.
            </p>
          </div>
          <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
            <p className="opacity-70">
              Примечание: Это неофициальное приложение. Мы используем данные из вашего личного кабинета ОГУ исключительно для визуализации статистики.
            </p>
          </div>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Button 
            className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
            onClick={() => setStage('login')}
          >
            Я понимаю, продолжить
          </Button>
          <Button 
            variant="ghost" 
            className="w-full text-gray-500 hover:text-white"
            onClick={() => window.open('https://github.com/osu-platform/osu-recap', '_blank')}
          >
            Посмотреть исходный код
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
