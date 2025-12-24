
import React, { useState, useEffect } from 'react';
import { LOGO_URL } from '../constants';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-8 transition-opacity duration-1000">
      <div className="w-full max-w-md text-center flex flex-col items-center">
        {/* Logo in Loading Screen */}
        <img 
          src={LOGO_URL} 
          alt="HaiZhi Logo" 
          className="w-12 h-12 md:w-16 md:h-16 object-contain mb-6 animate-pulse"
        />
        
        <h2 className="text-2xl md:text-3xl font-serif text-gold mb-1.5 md:mb-2 tracking-[0.2em] md:tracking-[0.3em] uppercase animate-pulse">海智星光凝聚中...</h2>
        <p className="text-red-600 text-[8px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] mb-6 md:mb-8 font-bold">正在组装智造星系矩阵</p>
        
        <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="flex justify-between w-full mt-2 text-[8px] md:text-[10px] text-gold/60 tracking-widest uppercase">
          <span>矩阵合成进度</span>
          <span>{progress}%</span>
        </div>
      </div>
      
      <div className="absolute bottom-8 md:bottom-12 text-center text-white/30 text-[8px] md:text-[10px] uppercase tracking-widest max-w-xs leading-relaxed px-4">
        请在弹出提示中允许摄像头访问权限，开启智造之旅。
      </div>
    </div>
  );
};

export default LoadingScreen;
