"use client"

import { useEffect, useRef, useState } from 'react';

interface ParallaxBackgroundProps {
  /** The distance in vh units for the animation scrubbing */
  scrubDistance?: number;
}

export default function ParallaxBackground({ scrubDistance = 400 }: ParallaxBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isReady, setIsReady] = useState(false);
  
  // Ref to track scroll-based progress for smoothness (interpolation)
  const scrollRef = useRef({
    current: 0,
    target: 0,
    requestRef: 0
  });

  const frameCount = 163;
  
  const getFrameUrl = (index: number) => {
    const paddedIndex = index.toString().padStart(3, '0');
    return `https://iassbuoisrzfkqjvddai.supabase.co/storage/v1/object/public/My%20Video/frame_${paddedIndex}_delay-0.042s.webp`;
  };

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    // Preload frames
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
        // Handle error by marking as loaded anyway to not block the UI
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
    const context = canvas.getContext('2d');
    if (!context) return;

    const renderFrame = (progress: number) => {
      // Map 0-1 progress to frame index
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(progress * (frameCount - 1))
      );
      
      const img = images[frameIndex];
      if (!img || !img.complete) return;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width / 2) - (w / 2);
      const y = (canvas.height / 2) - (h / 2);
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, w, h);
    };

    const animate = () => {
      // Smoothen the scroll value: current + (target - current) * lerpFactor
      const lerpFactor = 0.1; // Lower is smoother/slower, Higher is more responsive
      scrollRef.current.current += (scrollRef.current.target - scrollRef.current.current) * lerpFactor;
      
      renderFrame(scrollRef.current.current);
      scrollRef.current.requestRef = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(scrollRef.current.current);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      
      // Calculate how much we've scrolled through the intro section
      const totalScrubPx = (scrubDistance * winHeight) / 100 - winHeight;
      
      if (totalScrubPx > 0) {
        // Set target progress (0 to 1)
        scrollRef.current.target = Math.min(1, Math.max(0, scrollTop / totalScrubPx));
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    handleResize();
    scrollRef.current.requestRef = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(scrollRef.current.requestRef);
    };
  }, [isReady, images, scrubDistance]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover"
        style={{ opacity: isReady ? 0.7 : 0, transition: 'opacity 1s ease' }}
      />
      {/* Dynamic overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20" />
      
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background z-50">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-16 h-16 border-2 border-primary/20 rounded-full" />
              <div className="absolute top-0 left-0 w-16 h-16 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-primary animate-pulse">
              Buffering Reality Stream...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}