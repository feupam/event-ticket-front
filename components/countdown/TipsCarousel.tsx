import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { tips } from './tips';

export function TipsCarousel() {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
      <AlertCircle className="h-6 w-6 flex-shrink-0 text-yellow-400" />
      <p className="text-sm text-white">{tips[currentTipIndex]}</p>
    </div>
  );
}