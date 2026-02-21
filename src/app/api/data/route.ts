import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data.json');

// Initialize data file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ certifications: [], achievements: [], blogs: [] }));
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');

        if (!type) {
            return NextResponse.json({ error: 'Type is required' }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        return NextResponse.json(data[type] || []);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { type, payload } = await req.json();

        if (!type || !payload) {
            return NextResponse.json({ error: 'Type and payload are required' }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        if (!data[type]) data[type] = [];

        // Add new item with an ID
        const newItem = { id: Date.now().toString(), ...payload };
        data[type] = [newItem, ...data[type]]; // Add to beginning (latest first)

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true, item: newItem });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { type, id, payload } = await req.json();

        if (!type || !id || !payload) {
            return NextResponse.json({ error: 'Type, id, and payload are required' }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        if (!data[type]) return NextResponse.json({ error: 'Table not found' }, { status: 404 });

        const index = data[type].findIndex((item: any) => item.id === id);
        if (index === -1) return NextResponse.json({ error: 'Item not found' }, { status: 404 });

        data[type][index] = { ...data[type][index], ...payload };

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update data' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const id = searchParams.get('id');

        if (!type || !id) {
            return NextResponse.json({ error: 'Type and id are required' }, { status: 400 });
        }

        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
        if (!data[type]) return NextResponse.json({ error: 'Table not found' }, { status: 404 });

        data[type] = data[type].filter((item: any) => item.id !== id);

        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete data' }, { status: 500 });
    }
}
