'use client';

import { useState, useEffect } from 'react';
import ParallaxBackground from '@/components/ParallaxBackground';
import Hero from '@/components/Hero';
import Blogs from '@/components/Blogs';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';
import Certifications from '@/components/Certifications';
import Achievements from '@/components/Achievements';
import { Menu, X, ChevronDown } from 'lucide-react';

export default function Home() {
  const [animProgress, setAnimProgress] = useState(0);
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollPromptStatus, setScrollPromptStatus] = useState<'initial' | 'hidden' | 'continue'>('initial');

  // The total scroll distance for the sticky intro section (in vh)
  // Reduced to 300vh to make the overall sequence tighter
  const INTRO_SCROLL_HEIGHT = 300;
  // Percentage of the scroll height dedicated to the background frame animation
  // 0.66 of 300vh is 200vh, keeping the animation speed consistent but halving the hold distance
  const ANIMATION_END_THRESHOLD = 0.66;

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
        // This will reach 1.0 when totalProgress reaches ANIMATION_END_THRESHOLD
        const scrubbing = Math.min(1, totalProgress / ANIMATION_END_THRESHOLD);
        setAnimProgress(scrubbing);

        // Show hero content only after the animation is almost complete
        // and keep it visible throughout the "hold" phase
        const heroVisible = totalProgress >= ANIMATION_END_THRESHOLD - 0.05;
        setIsHeroVisible(heroVisible);

        if (scrollTop < 50) {
          setScrollPromptStatus('initial');
        } else if (!heroVisible) {
          setScrollPromptStatus('hidden');
        } else if (heroVisible && totalProgress < 0.99) {
          setScrollPromptStatus('continue');
        } else {
          setScrollPromptStatus('hidden');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="relative min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/50 backdrop-blur-xl transition-all">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <div className="text-2xl font-black tracking-tighter uppercase relative z-50">
            Ganesh<span className="text-primary">K.AI</span>
          </div>

          <nav className="hidden xl:flex items-center gap-8">
            <a href="#tech" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Stack</a>
            <a href="#experience" className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors">Experience</a>
            <a href="#contact" className="text-sm font-bold uppercase tracking-widest text-primary border border-primary/50 px-4 py-1 rounded-full hover:bg-primary hover:text-white transition-all">Hire Me</a>
          </nav>

          <nav className="hidden md:flex xl:hidden items-center gap-4">
            <a href="#tech" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Stack</a>
            <a href="#experience" className="text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">Experience</a>
            <a href="#contact" className="text-xs font-bold uppercase tracking-widest text-primary border border-primary/50 px-3 py-1 rounded-full hover:bg-primary hover:text-white transition-all">Hire Me</a>
          </nav>

          {/* Mobile Menu Toggle button */}
          <button
            className="md:hidden relative z-50 text-foreground hover:text-primary transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/5 md:hidden animate-in slide-in-from-top-4 fade-in duration-300">
            <nav className="flex flex-col items-center py-8 gap-6">
              <a href="#tech" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">Stack</a>
              <a href="#experience" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest hover:text-primary transition-colors">Experience</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest text-primary border border-primary/50 px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all">Hire Me</a>
            </nav>
          </div>
        )}
      </header>

      {/* Intro Section with pinned animation and hero text */}
      <section
        className="relative"
        style={{ height: `${INTRO_SCROLL_HEIGHT}vh` }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden z-10">
          <ParallaxBackground scrubProgress={animProgress} />
          <Hero isVisible={isHeroVisible} />

          {/* Scroll Prompt */}
          <div className={`absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 sm:gap-2 text-primary/80 transition-all duration-500 ${scrollPromptStatus === 'hidden' ? 'opacity-0 translate-y-4 pointer-events-none' : 'opacity-100 translate-y-0'}`}>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium text-center animate-pulse drop-shadow-lg glass-card px-3 py-1 rounded-full border-none bg-background/50">
              {scrollPromptStatus === 'initial' ? 'Scroll to explore' : 'Keep scrolling'}
            </span>
            <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 animate-bounce drop-shadow-md" />
          </div>
        </div>
      </section>
      {/* Content Section revealed after the intro */}
      <div className="relative z-20 bg-background border-t border-white/5 shadow-[0_-100px_100px_rgba(0,0,0,0.8)]">
        <div id="tech">
          <TechStack />
        </div>

        <div id="blogs">
          <Blogs />
        </div>

        <div id="experience">
          <Experience />
        </div>

        <div id="certifications">
          <Certifications />
        </div>

        <div id="achievements">
          <Achievements />
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
