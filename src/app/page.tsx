import ParallaxBackground from '@/components/ParallaxBackground';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';

export default function Home() {
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
            <a href="#contact" className="text-sm font-bold uppercase tracking-widest text-primary">Hire Me</a>
          </nav>
        </div>
      </header>

      {/* Intro Section: Animation + Hero pinned for 400vh of scroll */}
      <section className="relative h-[400vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">
          <ParallaxBackground scrubDistance={400} />
          <Hero />
        </div>
      </section>
      
      {/* Content Section: This scrolls up after the intro is done */}
      <div className="relative z-20 bg-background shadow-[0_-50px_100px_rgba(0,0,0,0.5)]">
        <div id="tech">
          <TechStack />
        </div>
        
        <div id="experience">
          <Experience />
        </div>
        
        <div id="contact">
          <Contact />
        </div>
      </div>
    </main>
  );
}
