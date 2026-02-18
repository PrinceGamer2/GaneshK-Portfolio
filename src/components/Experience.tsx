"use client"

import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

export default function Experience() {
  const positions = [
    {
      title: "Vice President",
      company: "Digitopedia | Presidency University",
      period: "April 2025 – Present",
      points: [
        "Strategic Leadership: Steering the digital vision for the university’s premier marketing club.",
        "System Integration: Implementing AI automation workflows to streamline club operations and member outreach.",
        "Mentorship: Overseeing the Social Media, R&D, and PR teams to drive clarity and creative excellence."
      ]
    },
    {
      title: "Social Media Team Head",
      company: "Digitopedia | Presidency University",
      period: "September 2024 – April 2025",
      points: [
        "Content Architecture: Managed a 1 year 6 month tenure focused on increasing brand trust and visibility.",
        "Engagement Growth: Leveraged Canva and DaVinci Resolve to produce high-retention video content and graphics."
      ]
    }
  ];

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Leadership Experience</h2>
            <p className="text-primary font-mono text-sm tracking-widest uppercase">The Professional Journey</p>
          </div>
        </div>

        <div className="grid gap-8">
          {positions.map((pos, idx) => (
            <div 
              key={idx}
              className="glass-card p-8 md:p-12 rounded-2xl relative overflow-hidden group border-primary/10 hover:border-primary/30 transition-all duration-500"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Briefcase size={120} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
                <div className="lg:col-span-4 space-y-4">
                  <Badge variant="outline" className="text-primary border-primary/30 py-1 px-4 text-xs tracking-widest uppercase">
                    {idx === 0 ? "Current Role" : "Previous Role"}
                  </Badge>
                  <h3 className="text-3xl font-bold group-hover:text-primary transition-colors">{pos.title}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground font-medium">
                    <Calendar className="w-4 h-4 text-primary/60" />
                    <span>{pos.period}</span>
                  </div>
                  <p className="text-lg font-semibold text-secondary">{pos.company}</p>
                </div>
                
                <div className="lg:col-span-8 space-y-6">
                  <div className="grid gap-4">
                    {pos.points.map((point, pIdx) => (
                      <div key={pIdx} className="flex gap-4 items-start group/point">
                        <CheckCircle2 className="w-6 h-6 text-primary mt-1 shrink-0 group-hover/point:scale-110 transition-transform" />
                        <p className="text-muted-foreground leading-relaxed text-lg">
                          <span className="text-foreground font-bold">{point.split(':')[0]}:</span>
                          {point.split(':')[1]}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
