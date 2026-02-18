"use client"

import { Search, Zap, Layout, PenTool } from "lucide-react";

export default function TechStack() {
  const stack = [
    {
      title: "SEO & Growth",
      desc: "Specialized in organic visibility and data-driven impact to dominate search landscapes.",
      tools: ["Google Search Console", "Semrush", "Data Analysis"],
      icon: <Search className="w-8 h-8 text-primary" />
    },
    {
      title: "AI Automation",
      desc: "Architecting complex workflows using N8N and Make to eliminate manual redundancy.",
      tools: ["N8N", "Make.com", "API Integration"],
      icon: <Zap className="w-8 h-8 text-primary" />
    },
    {
      title: "Design & Web",
      desc: "Advanced WordPress development paired with professional design in Canva and Adobe tools.",
      tools: ["WordPress", "Elementor", "Canva Pro"],
      icon: <Layout className="w-8 h-8 text-primary" />
    },
    {
      title: "Content & Copy",
      desc: "Certified copywriting and professional-grade video editing in DaVinci Resolve.",
      tools: ["DaVinci Resolve", "Direct Response Copy", "Storyboarding"],
      icon: <PenTool className="w-8 h-8 text-primary" />
    }
  ];

  return (
    <section className="py-24 bg-background/50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-black uppercase">Technical Toolkit</h2>
          <div className="h-1 w-24 bg-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stack.map((item, idx) => (
            <div 
              key={idx}
              className="glass-card p-8 rounded-2xl flex flex-col justify-between hover:translate-y-[-8px] transition-all duration-300 border-white/5 hover:border-primary/40 group"
            >
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  {item.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold uppercase tracking-tight">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2">
                {item.tools.map((tool) => (
                  <span key={tool} className="text-[10px] uppercase font-bold tracking-widest text-primary/80 px-2 py-1 rounded bg-primary/5">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
