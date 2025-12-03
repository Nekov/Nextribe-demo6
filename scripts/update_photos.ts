
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

const updates = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        images: ['https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        images: ['https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1470770903676-69b98201ea1c?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        images: ['https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '44444444-4444-4444-4444-444444444444',
        images: ['https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '55555555-5555-5555-5555-555555555555',
        images: ['https://images.unsplash.com/photo-1518182170546-0766ca6fdd69?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '66666666-6666-6666-6666-666666666666',
        images: ['https://images.unsplash.com/photo-1516939884455-1445c8652f83?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505576391880-b3f9d713dc4f?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '77777777-7777-7777-7777-777777777777',
        images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '88888888-8888-8888-8888-888888888888',
        images: ['https://images.unsplash.com/photo-1504280506541-aca1d6d885b6?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: '99999999-9999-9999-9999-999999999999',
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        images: ['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=600&auto=format&fit=crop']
    },
    {
        id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
        title: 'Ancient Forest Treehouse',
        location: 'Bialowieza Forest',
        country_id: 'POL',
        capacity: 2,
        total_price: 110000,
        available_shares_pct: 100,
        expected_roi_pct: 12.8,
        images: ['https://images.unsplash.com/photo-1488413587848-2604974975d0?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=600&auto=format&fit=crop'],
        amenities: ['Treehouse Living', 'Bison Watching', 'Secluded', 'Nature Sounds']
    }
];

async function updatePhotos() {
    console.log('Updating opportunity photos...');

    for (const item of updates) {
        // Upsert to handle both updates and the new Treehouse insert
        const { error } = await supabase
            .from('opportunities')
            .upsert({
                id: item.id,
                images: item.images,
                // Include other fields for the new item case, existing items will just update images/these fields if they match
                ...(item.title ? {
                    title: item.title,
                    location: item.location,
                    country_id: item.country_id,
                    capacity: item.capacity,
                    total_price: item.total_price,
                    available_shares_pct: item.available_shares_pct,
                    expected_roi_pct: item.expected_roi_pct,
                    amenities: item.amenities
                } : {})
            }, { onConflict: 'id' });

        if (error) {
            console.error(`Error updating ${item.id}:`, error);
        } else {
            console.log(`Updated ${item.id}`);
        }
    }
    console.log('Photo updates complete.');
}

updatePhotos();
