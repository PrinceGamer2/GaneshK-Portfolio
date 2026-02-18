"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu, Search, Target, Megaphone } from "lucide-react";

const skills = [
  { id: "#01", label: "AI Automation", icon: <Cpu className="w-4 h-4" /> },
  { id: "#02", label: "SEO & Organic Growth", icon: <Search className="w-4 h-4" /> },
  { id: "#03", label: "Content Strategy", icon: <Megaphone className="w-4 h-4" /> },
  { id: "#04", label: "Brand Positioning", icon: <Target className="w-4 h-4" /> },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          <div>
            <span className="text-primary font-medium tracking-[0.2em] uppercase text-sm mb-4 block animate-in fade-in slide-in-from-bottom-4 duration-1000">
              The Future of Digital Efficiency
            </span>
            <h1 className="text-7xl md:text-9xl font-black leading-none mb-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              PRINCE<br />
              <span className="text-primary">GANESH</span>
            </h1>
          </div>
          
          <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {skills.map((skill) => (
              <div 
                key={skill.id}
                className="glass-card px-4 py-2 rounded-full flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-white/5 hover:border-primary/50 transition-colors"
              >
                <span className="text-primary/70">{skill.id}</span>
                <span>{skill.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-center space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-500">
          <div className="space-y-6 lg:pl-8">
            <h2 className="text-2xl md:text-3xl font-bold leading-tight">
              Engineering Growth Through Intelligence & Leadership.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Vice President of Digitopedia and BBA scholar at Presidency University. 
              I bridge the gap between human psychology and automation to build 
              high-performance digital ecosystems.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="premium-button bg-primary text-white hover:bg-primary/90 px-8">
                Explore Work <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
