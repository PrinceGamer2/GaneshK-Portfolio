"use client"

import { Badge } from "@/components/ui/badge";
import { Briefcase, Calendar, CheckCircle2 } from "lucide-react";

export default function Experience() {
  const positions = [
    {
      title: "Social Media Team Head",
      company: "Digitopedia Association of Presidency University",
      period: "2024 – Present",
      points: [
        "Leadership & Execution: Progressed from R&D and PR Team Member (2024-25) to Social Media Team Head, leading strategic content planning, boosted engagement, and cross-functional coordination for campus events.",
        "Research & Presentation: Presented my co-authored research paper at the National Seminar on “India’s Global Leadership in the 21st Century” at REVA University, Bengaluru.",
        "Mentorship & Accountability: Serving as Class Representative since the 1st semester, demonstrating consistent leadership, accountability, and strong team collaboration skills."
      ]
    },
    {
      title: "Personal Projects Handled",
      company: "Personal Projects",
      period: "2023 – Present",
      points: [
        "Content Strategy & SEO: Built and managed multiple hands-on digital projects, including Explainur.com, developing 30+ SEO-optimized blogs. Created and published numerous explainer videos.",
        "Video Production & Growth: Designed end-to-end 350+ educational videos (Achibition) and 108 AI Generated Motivational songs (Melodio), gaining practical exposure in content creation process, video production, and growth experimentation.",
        "Web Design & Tools: While creating various websites worked extensively with WordPress (CMS) using Elementor & Divi to build UI, and Plugins like RankMath SEO, Google Site Kit, WooCommerce, and created various AI-based videos and content. Developed strong working knowledge of Canva, Filmora, DaVinci Resolve, Ahrefs, SEMrush, and VidIQ.",
        "Continuous Learning: An enthusiastic quick learner who actively experiments, applies concepts in real-world projects, and continuously refines skills through hands-on execution."
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
                          {point.includes(':') ? (
                            <>
                              <span className="text-foreground font-bold">{point.split(':')[0]}:</span>
                              {point.substring(point.indexOf(':') + 1)}
                            </>
                          ) : (
                            point
                          )}
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
