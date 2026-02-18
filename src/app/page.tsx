
'use client';

import { useState, useEffect } from 'react';
import ParallaxBackground from '@/components/ParallaxBackground';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const SCRUB_DISTANCE = 500; // vh

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const winHeight = window.innerHeight;
      const totalScrubPx = (SCRUB_DISTANCE * winHeight) / 100 - winHeight;
      
      if (totalScrubPx > 0) {
        const progress = Math.min(1, Math.max(0, scrollTop / totalScrubPx));
        setScrollProgress(progress);
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

      {/* Intro Section with pinned animation */}
      <section className="relative h-[500vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <ParallaxBackground scrubProgress={scrollProgress} />
          <Hero isVisible={scrollProgress >= 0.95} />
        </div>
      </section>
      
      {/* Content Section revealed after intro */}
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
