import ParallaxBackground from '@/components/ParallaxBackground';
import Hero from '@/components/Hero';
import Experience from '@/components/Experience';
import TechStack from '@/components/TechStack';
import Contact from '@/components/Contact';

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ParallaxBackground />
      
      <div className="relative z-10">
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

        <Hero />
        
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
