
import React, { useState } from 'react';
import { LOGO_URL } from '../constants';

interface UIOverlayProps {
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  currentGesture: string;
  currentPhotoIndex: number;
}

const UIOverlay: React.FC<UIOverlayProps> = ({ isMuted, setIsMuted, currentGesture, currentPhotoIndex }) => {
  const [showGuide, setShowGuide] = useState(true);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4 md:p-6 z-30">
      {/* Header with Logo and Brand */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <div className="flex items-center gap-1.5 md:gap-2 mb-1 md:mb-2">
            <img 
              src={LOGO_URL} 
              alt="Logo" 
              className="w-5 h-5 md:w-8 md:h-8 object-contain"
            />
          </div>
          <h1 className="text-xl md:text-3xl font-serif text-gold tracking-widest animate-pulse-gold uppercase leading-tight">海智在线 · 圣诞特辑</h1>
          <p className="text-[9px] md:text-xs text-red-500 font-medium tracking-widest mt-0.5 md:mt-1">用中国产能服务世界制造</p>
        </div>
        
        <button 
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 md:p-3 bg-gold/10 hover:bg-gold/20 border border-gold/40 rounded-full transition-all duration-300"
        >
          {isMuted ? (
            <svg className="w-4 h-4 md:w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
          ) : (
            <svg className="w-4 h-4 md:w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
          )}
        </button>
      </div>

      {/* Footer & Guide */}
      <div className="flex flex-row justify-start items-end w-full">
        <div className="bg-black/60 backdrop-blur-lg p-3.5 md:p-5 rounded-xl md:rounded-2xl border border-gold/30 max-w-[220px] md:max-w-xs pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-2 md:mb-3 border-b border-gold/10 pb-1.5 md:pb-2">
            <span className="text-gold font-bold text-[9px] md:text-xs tracking-widest uppercase">交互指南</span>
            <button onClick={() => setShowGuide(!showGuide)} className="text-[8px] md:text-[10px] text-red-500 uppercase hover:underline font-bold">
              {showGuide ? '收起' : '展开'}
            </button>
          </div>
          {showGuide && (
            <ul className="text-[10px] md:text-[12px] text-white/90 space-y-2 md:space-y-3 font-medium">
              <li className="flex items-center gap-2 md:gap-3">
                <span className="text-base md:text-lg">🖐️</span>
                <span><strong className="text-gold block leading-tight">张开手掌</strong> 邂逅海智全球故事</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <span className="text-base md:text-lg">✊</span>
                <span><strong className="text-gold block leading-tight">紧握拳头</strong> 点燃海智圣诞树</span>
              </li>
              <li className="flex items-center gap-2 md:gap-3">
                <span className="text-base md:text-lg">↔️</span>
                <span><strong className="text-gold block leading-tight">左右挥动</strong> 切换照片</span>
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UIOverlay;
