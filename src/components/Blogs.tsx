'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Blog {
    id: string;
    title: string;
    description: string;
    date: string;
    imageUrl?: string;
}

export default function Blogs() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const res = await fetch('/api/data?type=blogs');
                if (res.ok) {
                    const data = await res.json();
                    data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setBlogs(data);
                }
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading Blogs...</div>;
    }

    if (blogs.length === 0) {
        return null;
    }

    return (
        <section className="py-20 container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-black mb-12 uppercase tracking-tight">
                Latest <span className="text-primary">Blogs</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogs.map((blog) => (
                    <Card key={blog.id} className="bg-card/50 backdrop-blur-sm border-white/10 hover:border-primary/50 transition-all duration-300 group overflow-hidden">
                        {blog.imageUrl && (
                            <img src={blog.imageUrl} alt={blog.title} className="w-full h-48 object-cover transition-transform group-hover:scale-105" />
                        )}
                        <CardHeader className="pb-3">
                            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                                {blog.title}
                            </CardTitle>
                            <span className="text-xs text-muted-foreground font-mono mt-2 block">
                                {blog.date ? new Date(blog.date).toLocaleDateString() : ''}
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap line-clamp-3">
                                {blog.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
