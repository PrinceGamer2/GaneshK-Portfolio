'use client';

import { useState, useEffect } from 'react';
import ParallaxBackground from '@/components/ParallaxBackground';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';

export default function Home() {
  const [animProgress, setAnimProgress] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  
  // The total scroll distance for the sticky intro section (in vh)
  const INTRO_SCROLL_HEIGHT = 800; 
  // Percentage of the scroll height dedicated to the background frame animation (0.7 = 70%)
  const ANIMATION_END_THRESHOLD = 0.7; 

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      
      // Calculate total pixels available for scrubbing in the intro container
      const totalScrubPx = (INTRO_SCROLL_HEIGHT * winHeight) / 100 - winHeight;
      
      if (totalScrubPx > 0) {
        // Absolute progress from 0 to 1 within the intro section
        const totalProgress = Math.min(1, Math.max(0, scrollTop / totalScrubPx));
        
        // Calculate the scrubbing progress for the 163 frames
        // This will reach 1.0 when totalProgress reaches ANIMATION_END_THRESHOLD (70% scroll)
        const scrubbing = Math.min(1, totalProgress / ANIMATION_END_THRESHOLD);
        setAnimProgress(scrubbing);

        // Show hero content only after the animation is almost complete
        // and keep it visible throughout the "hold" phase (70% to 100%)
        setIsHeroVisible(totalProgress >= ANIMATION_END_THRESHOLD - 0.05);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 py-6 border-b border-white/5 bg-background/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter uppercase">
            Ganesh<span className="text-primary">K.AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#experience" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Experience</a>
            <a href="#tech" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Stack</a>
            <a href="#contact" className="text-sm font-bold uppercase tracking-widest text-primary border border-primary/50 px-4 py-1 rounded-full hover:bg-primary hover:text-white transition-all">Hire Me</a>
          </nav>
        </div>
      </header>

      {/* Intro Section with pinned animation and hero text */}
      <section 
        className="relative" 
        style={{ height: `${INTRO_SCROLL_HEIGHT}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
          <ParallaxBackground scrubProgress={animProgress} />
          <Hero isVisible={isHeroVisible} />
        </div>
      </section>
      
      {/* Content Section revealed after the long "hold" intro */}
      <div className="relative z-20 bg-background border-t border-white/5 shadow-[0_-100px_100px_rgba(0,0,0,0.8)]">
        <div id="tech">
          <TechStack />
        </div>
        
        <div id="experience">
          <Experience />
        </div>
        
        <div id="contact">
          <Contact />
        </div>

        <footer className="py-12 border-t border-white/5 text-center text-muted-foreground text-xs font-mono tracking-widest uppercase">
          Built with Precision • 2025
        </footer>
      </div>
    </main>
  );
}
