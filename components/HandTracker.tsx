
import React, { useEffect, useRef } from 'react';
import { HandData } from '../types';

interface HandTrackerProps {
  onData: (data: HandData) => void;
}

declare const Hands: any;
declare const Camera: any;
declare const drawConnectors: any;
declare const drawLandmarks: any;
declare const HAND_CONNECTIONS: any;

const HandTracker: React.FC<HandTrackerProps> = ({ onData }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastX = useRef<number | null>(null);
  const handsRef = useRef<any>(null);
  const cameraRef = useRef<any>(null);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    if (typeof Hands === 'undefined' || typeof Camera === 'undefined') return;

    const hands = new Hands({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });
    handsRef.current = hands;

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.65,
      minTrackingConfidence: 0.65,
    });

    hands.onResults((results: any) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        
        if (typeof drawConnectors !== 'undefined' && typeof HAND_CONNECTIONS !== 'undefined') {
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, { color: '#FFD700', lineWidth: 2 });
        }
        if (typeof drawLandmarks !== 'undefined') {
          drawLandmarks(ctx, landmarks, { color: '#D42426', lineWidth: 1, radius: 2 });
        }

        const gesture = detectGesture(landmarks);
        onData({ landmarks, gesture });
      } else {
        onData({ landmarks: [], gesture: 'NONE' });
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (handsRef.current && videoRef.current) {
          await handsRef.current.send({ image: videoRef.current });
        }
      },
      width: 320,
      height: 240,
    });
    cameraRef.current = camera;
    camera.start().catch((err: any) => console.error("Camera failed to start:", err));

    return () => {
      if (cameraRef.current) cameraRef.current.stop();
      if (handsRef.current) handsRef.current.close();
    };
  }, [onData]);

  const detectGesture = (landmarks: any[]) => {
    const wrist = landmarks[0];
    const palmCenter = landmarks[9]; 
    const tips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]]; 
    const thumbTip = landmarks[4];
    
    const distToPalm = tips.map(t => Math.sqrt(Math.pow(t.x - palmCenter.x, 2) + Math.pow(t.y - palmCenter.y, 2)));
    const avgPalmDist = distToPalm.reduce((a, b) => a + b, 0) / tips.length;
    
    const thumbToPalmDist = Math.sqrt(Math.pow(thumbTip.x - palmCenter.x, 2) + Math.pow(thumbTip.y - palmCenter.y, 2));

    const distToWrist = tips.map(t => Math.sqrt(Math.pow(t.x - wrist.x, 2) + Math.pow(t.y - wrist.y, 2)));
    const avgWristDist = distToWrist.reduce((a, b) => a + b, 0) / tips.length;

    let swipe: 'NONE' | 'SWIPE_LEFT' | 'SWIPE_RIGHT' = 'NONE';
    const currentX = wrist.x;
    if (lastX.current !== null) {
      const diff = currentX - lastX.current;
      if (diff > 0.08) swipe = 'SWIPE_RIGHT';
      else if (diff < -0.08) swipe = 'SWIPE_LEFT';
    }
    lastX.current = currentX;

    if (swipe !== 'NONE') return swipe;
    
    if (avgPalmDist < 0.15 && thumbToPalmDist < 0.18) return 'FIST';
    if (avgWristDist > 0.32) return 'OPEN';
    
    return 'NONE';
  };

  return (
    <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 pointer-events-none border border-gold/50 rounded-lg bg-black/50 overflow-hidden shadow-2xl w-[120px] md:w-[240px]">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} width={240} height={180} className="w-full h-auto" />
      <div className="text-center text-[7px] md:text-[10px] text-gold py-0.5 md:py-1 uppercase tracking-widest font-bold bg-black/80">手势感知系统</div>
    </div>
  );
};

export default HandTracker;
