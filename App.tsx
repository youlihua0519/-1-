
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Scene3D from './components/Scene3D';
import HandTracker from './components/HandTracker';
import UIOverlay from './components/UIOverlay';
import LoadingScreen from './components/LoadingScreen';
import { AppState, HandData } from './types';
import { PHOTO_COUNT, MUSIC_URL } from './constants';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOADING);
  const [handData, setHandData] = useState<HandData | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music from constants
  useEffect(() => {
    const audio = new Audio(MUSIC_URL);
    audio.loop = true;
    audioRef.current = audio;
    
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      if (isMuted) audioRef.current.pause();
      else {
        audioRef.current.play().catch(e => {
          console.log("Audio play blocked - wait for user interaction", e);
        });
      }
    }
  }, [isMuted]);

  const handleHandData = useCallback((data: HandData) => {
    setHandData(data);
    
    setAppState(current => {
      if (data.gesture === 'OPEN') {
        if (current !== AppState.SCATTER) {
          const randomIndex = Math.floor(Math.random() * PHOTO_COUNT);
          setCurrentPhotoIndex(randomIndex);
        }
        return AppState.SCATTER;
      } else if (data.gesture === 'FIST') {
        return AppState.TREE;
      }
      return current;
    });

    if (data.gesture === 'SWIPE_LEFT') {
      setCurrentPhotoIndex(prev => (prev + 1) % PHOTO_COUNT);
    } else if (data.gesture === 'SWIPE_RIGHT') {
      setCurrentPhotoIndex(prev => (prev - 1 + PHOTO_COUNT) % PHOTO_COUNT);
    }
  }, []);

  const handleLoadingComplete = () => {
    setAppState(AppState.TREE);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {appState === AppState.LOADING && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}
      
      <Scene3D 
        appState={appState} 
        currentPhotoIndex={currentPhotoIndex} 
      />
      
      <HandTracker onData={handleHandData} />
      
      <UIOverlay 
        isMuted={isMuted} 
        setIsMuted={setIsMuted} 
        currentGesture={handData?.gesture || 'NONE'}
        currentPhotoIndex={currentPhotoIndex}
      />
    </div>
  );
};

export default App;
