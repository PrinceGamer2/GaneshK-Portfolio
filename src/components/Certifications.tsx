'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar } from 'lucide-react';

interface Certification {
    id: string;
    title: string;
    issuer: string;
    date: string;
    imageUrl?: string;
    link?: string;
    skills?: string[];
}

export default function Certifications() {
    const [certifications, setCertifications] = useState<Certification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertifications = async () => {
            try {
                const q = query(collection(db, 'certifications'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                const certs = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Certification));
                setCertifications(certs);
            } catch (error) {
                console.error("Error fetching certifications:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCertifications();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading Certifications...</div>;
    }

    if (certifications.length === 0) {
        return null; // Don't show section if empty
    }

    return (
        <section className="py-20 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black mb-12 uppercase tracking-tight">
                Certifications <span className="text-primary">&</span> Licenses
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certifications.map((cert) => (
                    <Card key={cert.id} className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 group">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start gap-4">
                                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                    {cert.title}
                                </CardTitle>
                                {cert.link && (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </a>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-medium">{cert.issuer}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                                <Calendar className="w-3 h-3" />
                                <span>{new Date(cert.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
                            </div>

                            {cert.skills && cert.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                    {cert.skills.map((skill, index) => (
                                        <Badge key={index} variant="secondary" className="text-[10px] px-2 py-0 h-5">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
