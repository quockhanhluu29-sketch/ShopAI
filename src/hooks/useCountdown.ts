import { useEffect, useState } from 'react';

export const useCountdown = (initialSeconds: number) => {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  useEffect(() => {
    if (timeLeft <= 0) return undefined;
    const timer = setInterval(() => setTimeLeft(value => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  return { timeLeft, isFinished: timeLeft === 0 };
};