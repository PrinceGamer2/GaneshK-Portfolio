
"use client"

import { useEffect, useRef, useState } from 'react';

interface ParallaxBackgroundProps {
  /** 0 to 1 progress of the scroll sequence */
  scrubProgress: number;
}

export default function ParallaxBackground({ scrubProgress }: ParallaxBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Internal ref for smoothing the input scrubProgress
  const scrollRef = useRef({
    current: 0,
    target: scrubProgress,
    requestRef: 0
  });

  const frameCount = 163;

  const getFrameUrl = (index: number) => {
    const paddedIndex = index.toString().padStart(3, '0');
    return `https://iassbuoisrzfkqjvddai.supabase.co/storage/v1/object/public/My%20Video/frame_${paddedIndex}_delay-0.042s.webp`;
  };

  useEffect(() => {
    scrollRef.current.target = scrubProgress;
  }, [scrubProgress]);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setIsReady(true);
        }
      };
      img.onerror = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setImages(loadedImages);
          setIsReady(true);
        }
      };
      loadedImages[i] = img;
    }
  }, []);

  useEffect(() => {
    if (!isReady || images.length === 0 || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false }); // Optimization: no alpha
    if (!context) return;

    const renderFrame = (progress: number) => {
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * (frameCount - 1))
      );

      const img = images[frameIndex];
      // Defensive check: ensure image is loaded and not broken
      if (!img || !img.complete || img.naturalWidth === 0 || img.width === 0 || img.height === 0) {
        return;
      }

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const scale = Math.max(canvasWidth / img.width, canvasHeight / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvasWidth / 2) - (w / 2);
      const y = (canvasHeight / 2) - (h / 2);

      try {
        context.drawImage(img, x, y, w, h);
      } catch (e) {
        // Silently catch occasional race condition draw errors
      }
    };

    const animate = () => {
      // Smoothening with lerp
      const lerpFactor = 0.08;
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * lerpFactor;

      renderFrame(scrollRef.current.current);
      scrollRef.current.requestRef = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(scrollRef.current.current);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    scrollRef.current.requestRef = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(scrollRef.current.requestRef);
    };
  }, [isReady, images]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-background">
      <canvas
        ref={canvasRef}
        className="w-full h-full object-cover"
        style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.5s ease' }}
      />
      {/* Visual overlays for depth - heavily darkened on mobile to ensure text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background/90 lg:from-background/40 lg:via-transparent lg:to-background/80" />

      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-primary/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary animate-pulse">
              Calibrating Stream...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
