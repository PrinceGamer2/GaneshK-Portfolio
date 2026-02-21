'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Edit, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simple auth check using localStorage
        const auth = localStorage.getItem('adminAuth');
        if (auth === 'true') setIsAuthenticated(true);
        setLoading(false);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'admin123') {
            localStorage.setItem('adminAuth', 'true');
            setIsAuthenticated(true);
            setError('');
        } else {
            setError('Invalid password');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>Enter the master password to access CMS.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className="text-sm text-destructive">{error}</p>}
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <Button variant="outline" onClick={handleLogout} className="gap-2">
                        <LogOut className="h-4 w-4" /> Logout
                    </Button>
                </div>

                <Tabs defaultValue="blogs" className="w-full">
                    <TabsList>
                        <TabsTrigger value="blogs">Blogs</TabsTrigger>
                        <TabsTrigger value="certifications">Certifications</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="blogs">
                        <Manager type="blogs" />
                    </TabsContent>

                    <TabsContent value="certifications">
                        <Manager type="certifications" />
                    </TabsContent>

                    <TabsContent value="achievements">
                        <Manager type="achievements" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// Universal Manager for Blogs, Certifications, and Achievements
function Manager({ type }: { type: 'blogs' | 'certifications' | 'achievements' }) {
    const [items, setItems] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        imageUrl: '',
        link: '', // specific for certs
        issuer: '', // specific for certs
        category: '', // specific for achievements
        skills: '' // specific for certs
    });

    const fetchItems = async () => {
        const res = await fetch(`/api/data?type=${type}`);
        if (res.ok) {
            const data = await res.json();
            // Sort by date desc (though API returns latest first via array unshift, sorting guarantees it)
            data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setItems(data);
        }
    };

    useEffect(() => { fetchItems(); }, [type]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const uploadData = new FormData();
            uploadData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: uploadData
            });
            const data = await res.json();
            if (data.url) {
                setFormData(prev => ({ ...prev, imageUrl: data.url }));
            } else {
                alert("Image upload failed");
            }
        } catch (err) {
            console.error(err);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let processedData = { ...formData };
        if (type === 'certifications' && processedData.skills) {
            processedData.skills = (processedData.skills as any).split(',').map((s: string) => s.trim()).filter((s: string) => s) as any;
        }

        try {
            if (editingId) {
                await fetch(`/api/data`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, id: editingId, payload: processedData })
                });
            } else {
                await fetch(`/api/data`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, payload: processedData })
                });
            }
            setIsOpen(false);
            resetForm();
            fetchItems();
        } catch (e) {
            console.error(`Error saving ${type}:`, e);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await fetch(`/api/data?type=${type}&id=${id}`, { method: 'DELETE' });
            fetchItems();
        }
    };

    const handleEdit = (item: any) => {
        setFormData({
            title: item.title || '',
            description: item.description || '',
            date: item.date || '',
            imageUrl: item.imageUrl || '',
            link: item.link || '',
            issuer: item.issuer || '',
            category: item.category || '',
            skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || '')
        });
        setEditingId(item.id);
        setIsOpen(true);
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', date: '', imageUrl: '', link: '', issuer: '', category: '', skills: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg">
                <h2 className="text-xl font-semibold capitalize">All {type}</h2>
                <Button onClick={() => { resetForm(); setIsOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add New</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map(item => (
                    <Card key={item.id} className="relative group overflow-hidden">
                        <div className="flex flex-col h-full">
                            {item.imageUrl && (
                                <div className="h-32 w-full overflow-hidden">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-4 flex-1">
                                <h3 className="font-bold truncate">{item.title}</h3>
                                {type === 'certifications' && <p className="text-sm text-muted-foreground">{item.issuer}</p>}
                                <p className="text-sm text-muted-foreground line-clamp-2 mt-2">{item.description}</p>
                                <span className="text-xs text-muted-foreground block mt-2">{item.date}</span>

                                {type === 'certifications' && Array.isArray(item.skills) && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {item.skills.map((s: string, i: number) => <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>)}
                                    </div>
                                )}
                            </div>
                            <div className="p-2 border-t flex justify-end gap-2 bg-muted/20">
                                <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                                <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="capitalize">{editingId ? `Edit ${type.replace(/s$/, '')}` : `Add ${type.replace(/s$/, '')}`}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
                        <div>
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>

                        {(type === 'blogs' || type === 'achievements') && (
                            <div>
                                <Label>Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                            </div>
                        )}

                        {type === 'certifications' && (
                            <>
                                <div>
                                    <Label>Issuer</Label>
                                    <Input value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required />
                                </div>
                                <div>
                                    <Label>Description / Comments</Label>
                                    <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                                </div>
                            </>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date</Label>
                                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                            {type === 'achievements' && (
                                <div>
                                    <Label>Category</Label>
                                    <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Award, Hackathon" />
                                </div>
                            )}
                        </div>

                        {type === 'certifications' && (
                            <>
                                <div>
                                    <Label>Link (Optional)</Label>
                                    <Input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                                </div>
                                <div>
                                    <Label>Skills (Comma separated)</Label>
                                    <Input value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                                </div>
                            </>
                        )}

                        <div>
                            <Label>Image</Label>
                            <div className="flex gap-2 items-center mt-1">
                                <Input type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                                {uploading && <Loader2 className="animate-spin h-4 w-4" />}
                            </div>
                            {formData.imageUrl && <div className="mt-2 text-xs text-green-500 truncate">Image available</div>}
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={uploading}>Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
