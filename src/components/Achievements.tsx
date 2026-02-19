'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface Achievement {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
    category?: string;
}

export default function Achievements() {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const q = query(collection(db, 'achievements'), orderBy('date', 'desc'));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Achievement));
            } catch (error) {
                console.error("Error fetching achievements:", error);
                return [];
            }
        };

        fetchAchievements().then(data => {
            setAchievements(data);
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading Achievements...</div>;
    }

    if (achievements.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-black/20 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black mb-12 uppercase tracking-tight text-right">
                <span className="text-primary">Key</span> Achievements
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {achievements.map((achievement) => (
                    <Card key={achievement.id} className="overflow-hidden bg-card/30 border-primary/20 hover:border-primary transition-all duration-300">
                        <div className="flex flex-col md:flex-row h-full">
                            {achievement.imageUrl && (
                                <div className="md:w-1/3 relative h-48 md:h-auto overflow-hidden">
                                    {/* Fallback to simple img tag if optimization fails or config missing */}
                                    <img
                                        src={achievement.imageUrl}
                                        alt={achievement.title}
                                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                                    />
                                </div>
                            )}
                            <div className={`p-6 flex flex-col justify-between ${achievement.imageUrl ? 'md:w-2/3' : 'w-full'}`}>
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <Badge variant="outline" className="text-primary border-primary/50 text-xs">
                                            {achievement.category || 'Award'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground font-mono">
                                            {new Date(achievement.date).getFullYear()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                                        {achievement.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {achievement.description}
                                    </p>
                                </div>
                                {!achievement.imageUrl && (
                                    <div className="mt-4 flex justify-end">
                                        <Trophy className="text-primary/20 w-12 h-12" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </section>
    );
}
