import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useAppStore, useAuthStore } from '@/store/appStore';
import { osuParser } from '@/services/osu-parser';
import { Loader2 } from 'lucide-react';

export function LoginForm() {
  const { setStage, setLoadingMessage } = useAppStore();
  const { setCredentials } = useAuthStore();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'login' | 'password'>('login');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'login') {
      if (login.trim()) setStep('password');
      return;
    }

    if (!password.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const success = await osuParser.login(login, password);
      if (success) {
        setCredentials(login, password);
        setStage('scraping');
      } else {
        setError('Неверный логин или пароль');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6">
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6 md:space-y-8"
        onSubmit={handleSubmit}
      >
        <div className="space-y-2">
          <h2 className="text-xl md:text-3xl font-light">
            {step === 'login' ? 'Ваш логин от ЛК ОГУ' : 'Теперь пароль'}
          </h2>
          <p className="text-sm md:text-base text-gray-500">
            {step === 'login' ? 'Обычно это электронная почта' : 'Тот же, что вы используете для входа на сайт'}
          </p>
        </div>

        <div className="space-y-4">
          {step === 'login' ? (
            <Input
              autoFocus
              type="text"
              placeholder="Например, example@mail.com"
              className="text-lg md:text-2xl p-4 md:p-6 bg-transparent border-b-2 border-zinc-800 rounded-none focus-visible:ring-0 focus-visible:border-white transition-colors placeholder:text-zinc-700"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          ) : (
            <Input
              autoFocus
              type="password"
              placeholder="••••••••"
              className="text-lg md:text-2xl p-4 md:p-6 bg-transparent border-b-2 border-zinc-800 rounded-none focus-visible:ring-0 focus-visible:border-white transition-colors placeholder:text-zinc-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}
          
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full py-4 md:py-6 text-base md:text-lg rounded-full"
          disabled={(step === 'login' ? !login : !password) || isLoading}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader2 className="w-5 h-5 md:w-6 md:h-6" />
            </motion.div>
          ) : (
            step === 'login' ? 'Далее' : 'Войти'
          )}
        </Button>
        
        {step === 'password' && (
          <button 
            type="button"
            className="text-sm text-gray-500 hover:text-white transition-colors"
            onClick={() => setStep('login')}
          >
            Назад к логину
          </button>
        )}
      </motion.form>
    </div>
  );
}
