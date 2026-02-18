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

    const renderFrame = (index: number) => {
      const img = images[index];
      if (!img || !img.complete) return;

      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width / 2) - (w / 2);
      const y = (canvas.height / 2) - (h / 2);
      
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, x, y, w, h);
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(0);
    };

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      
      // Calculate how much we've scrolled through the intro section
      // scrubDistance is in vh, so scrubDistance * winHeight / 100 is the pixel distance
      const totalScrubPx = (scrubDistance * winHeight) / 100 - winHeight;
      
      if (totalScrubPx <= 0) return;

      // Fraction of the scrub section we've completed
      const scrollFraction = Math.min(1, Math.max(0, scrollTop / totalScrubPx));
      
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * (frameCount - 1))
      );
      
      requestAnimationFrame(() => renderFrame(frameIndex));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReady, images, scrubDistance]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: isReady ? 0.6 : 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background" />
      
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-mono text-xs tracking-widest uppercase text-primary">Initializing Neural Interface...</p>
          </div>
        </div>
      )}
    </div>
  );
}
