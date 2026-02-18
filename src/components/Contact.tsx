"use client"

import { Button } from "@/components/ui/button";
import { Mail, Phone, ExternalLink } from "lucide-react";

export default function Contact() {
  return (
    <section className="py-32 relative">
      <div className="container mx-auto px-6 max-w-5xl text-center">
        <div className="glass-card p-12 md:p-20 rounded-[3rem] border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
          
          <div className="space-y-12 relative z-10">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                Let's Build The <span className="text-primary">Future</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-xl mx-auto">
                Ready to automate your growth or architect your next digital empire? Let's connect.
              </p>
            </div>

            <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 md:gap-10">
              <a 
                href="tel:+916268544601" 
                className="flex items-center gap-2 sm:gap-3 text-[10px] xs:text-sm sm:text-lg md:text-2xl font-bold hover:text-primary transition-colors group whitespace-nowrap"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 shrink-0">
                  <Phone className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                +91 6268 544601
              </a>
              
              <div className="w-px h-8 sm:h-12 bg-white/10 shrink-0"></div>
              
              <a 
                href="mailto:gamerprince2.0@gmail.com" 
                className="flex items-center gap-2 sm:gap-3 text-[10px] xs:text-sm sm:text-lg md:text-2xl font-bold hover:text-primary transition-colors group whitespace-nowrap"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 shrink-0">
                  <Mail className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                </div>
                gamerprince2.0@gmail.com
              </a>
            </div>

            <div className="pt-8">
              <Button size="lg" className="premium-button bg-primary text-white hover:bg-primary/90 px-12 h-14 text-lg font-bold uppercase tracking-widest">
                Get Started <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-20 text-muted-foreground text-sm font-mono tracking-widest uppercase flex items-center justify-center gap-2">
            <span>© 2025 GANESH K</span>
            <span className="text-primary">•</span>
            <span>AI ARCHITECT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
