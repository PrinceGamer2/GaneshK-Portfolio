"use client"

import { useEffect, useRef, useState } from 'react';

export default function ParallaxBackground() {
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
        // Fallback for failed loads to keep count consistent
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

      // Cover logic for canvas
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
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const maxScroll = docHeight - winHeight;
      
      if (maxScroll <= 0) return;

      const scrollFraction = scrollTop / maxScroll;
      // Map scroll to frame index
      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );
      
      requestAnimationFrame(() => renderFrame(frameIndex));
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    
    // Trigger initial render
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isReady, images]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        className="w-full h-full object-cover transition-opacity duration-1000"
        style={{ opacity: isReady ? 0.5 : 0 }}
      />
      {/* Overlay to blend with the dark theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background opacity-90" />
      
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-background">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
