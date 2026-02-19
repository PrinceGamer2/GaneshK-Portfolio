'use client';

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, Trash2, Edit, LogOut, Upload } from 'lucide-react';

export default function AdminPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
            setError('Failed to login: ' + err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    if (!user) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <Card className="w-[400px]">
                    <CardHeader>
                        <CardTitle>Admin Login</CardTitle>
                        <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
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

                <Tabs defaultValue="certifications" className="w-full">
                    <TabsList>
                        <TabsTrigger value="certifications">Certifications</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="certifications">
                        <CertificationsManager />
                    </TabsContent>

                    <TabsContent value="achievements">
                        <AchievementsManager />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}

// ------------------- Certifications Manager -------------------

function CertificationsManager() {
    const [certs, setCerts] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        date: '',
        link: '',
        skills: ''
    });

    const fetchCerts = async () => {
        const q = query(collection(db, 'certifications'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        setCerts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => { fetchCerts(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            skills: formData.skills.split(',').map(s => s.trim()).filter(s => s)
        };

        try {
            if (editingId) {
                await updateDoc(doc(db, 'certifications', editingId), data);
            } else {
                await addDoc(collection(db, 'certifications'), data);
            }
            setIsOpen(false);
            resetForm();
            fetchCerts();
        } catch (e) {
            console.error("Error saving cert:", e);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await deleteDoc(doc(db, 'certifications', id));
            fetchCerts();
        }
    };

    const handleEdit = (cert: any) => {
        setFormData({
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            link: cert.link || '',
            skills: cert.skills ? cert.skills.join(', ') : ''
        });
        setEditingId(cert.id);
        setIsOpen(true);
    };

    const resetForm = () => {
        setFormData({ title: '', issuer: '', date: '', link: '', skills: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg">
                <h2 className="text-xl font-semibold">All Certifications</h2>
                <Button onClick={() => { resetForm(); setIsOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add New</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certs.map(cert => (
                    <Card key={cert.id} className="relative group">
                        <CardHeader>
                            <CardTitle className="text-lg">{cert.title}</CardTitle>
                            <CardDescription>{cert.issuer} • {cert.date}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-1">
                                {cert.skills?.map((s: string, i: number) => <Badge key={i} variant="secondary" className="text-[10px]">{s}</Badge>)}
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => handleEdit(cert)}><Edit className="h-3 w-3" /></Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(cert.id)}><Trash2 className="h-3 w-3" /></Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Certification' : 'Add Certification'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Issuer</Label>
                            <Input value={formData.issuer} onChange={e => setFormData({ ...formData, issuer: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Date</Label>
                            <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Link (Optional)</Label>
                            <Input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} />
                        </div>
                        <div>
                            <Label>Skills (Comma separated)</Label>
                            <Input value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

// ------------------- Achievements Manager -------------------

function AchievementsManager() {
    const [items, setItems] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        category: '',
        imageUrl: ''
    });

    const fetchItems = async () => {
        const q = query(collection(db, 'achievements'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => { fetchItems(); }, []);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `achievements/${Date.now()}_${file.name}`);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            setFormData(prev => ({ ...prev, imageUrl: url }));
        } catch (err) {
            console.error("Upload failed", err);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDoc(doc(db, 'achievements', editingId), formData);
            } else {
                await addDoc(collection(db, 'achievements'), formData);
            }
            setIsOpen(false);
            resetForm();
            fetchItems();
        } catch (e) {
            console.error("Error saving achievement:", e);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure?')) {
            await deleteDoc(doc(db, 'achievements', id));
            fetchItems();
        }
    };

    const handleEdit = (item: any) => {
        setFormData({
            title: item.title,
            description: item.description,
            date: item.date,
            category: item.category || '',
            imageUrl: item.imageUrl || ''
        });
        setEditingId(item.id);
        setIsOpen(true);
    };

    const resetForm = () => {
        setFormData({ title: '', description: '', date: '', category: '', imageUrl: '' });
        setEditingId(null);
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-card p-4 rounded-lg">
                <h2 className="text-xl font-semibold">All Achievements</h2>
                <Button onClick={() => { resetForm(); setIsOpen(true); }}><Plus className="mr-2 h-4 w-4" /> Add New</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map(item => (
                    <Card key={item.id} className="relative group overflow-hidden">
                        <div className="flex h-32">
                            {item.imageUrl && (
                                <div className="w-1/3 h-full">
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <div className="p-4 flex-1">
                                <h3 className="font-bold truncate">{item.title}</h3>
                                <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
                                <span className="text-xs text-muted-foreground block mt-2">{item.date}</span>
                            </div>
                        </div>
                        <div className="p-2 border-t flex justify-end gap-2 bg-muted/20">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(item)}><Edit className="h-4 w-4" /></Button>
                            <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit Achievement' : 'Add Achievement'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Title</Label>
                            <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>Date</Label>
                                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} required />
                            </div>
                            <div>
                                <Label>Category</Label>
                                <Input value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Award, Hackathon" />
                            </div>
                        </div>
                        <div>
                            <Label>Image</Label>
                            <div className="flex gap-2 items-center mt-1">
                                <Input type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                                {uploading && <Loader2 className="animate-spin h-4 w-4" />}
                            </div>
                            {formData.imageUrl && <div className="mt-2 text-xs text-green-500 truncate">Image uploaded</div>}
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
