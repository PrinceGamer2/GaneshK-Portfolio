'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Award, ZoomIn, X } from 'lucide-react';

const certificates = [
    {
        name: "Build AI Agents & Automate Workflows with n8n",
        file: "CertificateOfCompletion_Build AI Agents and Automate Workflows with n8n_page-0001.jpg",
    },
    {
        name: "Future Agents AI Automation",
        file: "Future Agents AI Automation_.jpg",
    },
    {
        name: "Simpli Learn AI Automation",
        file: "Simpli Learn AI Automation_page-0001.jpg",
    },
    {
        name: "Copywriting Certificate",
        file: "Copywriting Certificate_.jpg",
    },
    {
        name: "Video Editing Certificate",
        file: "Video Editing Certificate_.jpg",
    },
    {
        name: "Digitopedia LOA SocialMedia Team Head",
        file: "Digitopedia LOA SocialMedia Team Head.jpg",
    }
];

export default function CertificateShowcase() {
    const [selectedCert, setSelectedCert] = useState<{ name: string; file: string } | null>(null);

    return (
        <section className="py-20 container mx-auto px-6 relative overflow-hidden" id="certificate-showcase">
            {/* Background Decorator */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="flex flex-col items-center mb-16">
                <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
                    <Award className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-center">
                    Certificate <span className="text-primary">Showcase</span>
                </h2>
                <p className="text-muted-foreground mt-4 text-center max-w-2xl font-medium">
                    A collection of my professional licenses, completions, and achievements distinguishing my expertise in AI automation, digital marketing, and multimedia.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {certificates.map((cert, index) => (
                    <Card
                        key={index}
                        className="group overflow-hidden bg-card border-white/5 hover:border-primary/50 transition-all duration-500 shadow-xl shadow-black/40 hover:shadow-primary/20 cursor-pointer"
                        onClick={() => setSelectedCert(cert)}
                    >
                        <CardContent className="p-0 relative aspect-[4/3] w-full bg-muted/20">
                            <img
                                src={`/certificates/${cert.file}`}
                                alt={cert.name}
                                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center backdrop-blur-md mb-4 border border-primary/30 text-primary">
                                        <ZoomIn className="w-5 h-5" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {cert.name}
                                    </h3>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedCert && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4 animate-in fade-in duration-300"
                    onClick={() => setSelectedCert(null)}
                >
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-300" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute -top-12 right-0 md:-right-12 p-2 bg-background/50 hover:bg-primary/20 text-white rounded-full transition-colors border border-white/10"
                            onClick={() => setSelectedCert(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={`/certificates/${selectedCert.file}`}
                            alt={selectedCert.name}
                            className="max-w-full max-h-[75vh] object-contain rounded-lg border border-white/10 shadow-2xl"
                        />
                        <p className="mt-4 text-lg font-bold text-center text-white">
                            {selectedCert.name}
                        </p>
                        <button
                            className="mt-6 px-8 py-2.5 bg-background border border-primary/50 text-white hover:bg-primary hover:text-white rounded-full transition-all font-bold tracking-widest uppercase text-xs shadow-lg"
                            onClick={() => setSelectedCert(null)}
                        >
                            Close Preview
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}
