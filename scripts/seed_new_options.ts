
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

const newCountries = [
    { id: 'SVK', name: 'Slovakia', status: 'proposed', progress: 10, description: 'Discover the hidden gems of the High Tatras and sustainable tourism in Slovakia.', locations_proposed: 2, locations_target: 10 },
    { id: 'FIN', name: 'Finland', status: 'proposed', progress: 15, description: 'Experience the serenity of Nordic forests and lakes in Finland.', locations_proposed: 3, locations_target: 10 },
    { id: 'PRT', name: 'Portugal', status: 'proposed', progress: 20, description: 'Enjoy the sunny coastlines and vibrant culture of Portugal.', locations_proposed: 4, locations_target: 10 },
    { id: 'CRI', name: 'Costa Rica', status: 'proposed', progress: 25, description: 'Immerse yourself in the biodiversity and "Pura Vida" lifestyle of Costa Rica.', locations_proposed: 5, locations_target: 10 }
];

const newOpportunities = [
    {
        id: '77777777-7777-7777-7777-777777777777',
        title: 'High Tatras Eco Cabin',
        location: 'High Tatras',
        country_id: 'SVK',
        capacity: 4,
        total_price: 95000,
        available_shares_pct: 100,
        expected_roi_pct: 12.5,
        images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=600&auto=format&fit=crop'],
        amenities: ['Mountain View', 'Hiking Trails', 'Sustainable Wood', 'Fireplace']
    },
    {
        id: '88888888-8888-8888-8888-888888888888',
        title: 'Nordic Forest Tiny House',
        location: 'Nuuksio National Park',
        country_id: 'FIN',
        capacity: 2,
        total_price: 85000,
        available_shares_pct: 100,
        expected_roi_pct: 11.8,
        images: ['https://images.unsplash.com/photo-1504280506541-aca1d6d885b6?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?q=80&w=600&auto=format&fit=crop'],
        amenities: ['Forest Immersion', 'Berry Picking', 'Minimalist Design', 'Sauna']
    },
    {
        id: '99999999-9999-9999-9999-999999999999',
        title: 'Algarve Glamping Dome',
        location: 'Algarve',
        country_id: 'PRT',
        capacity: 2,
        total_price: 75000,
        available_shares_pct: 100,
        expected_roi_pct: 14.0,
        images: ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=600&auto=format&fit=crop'],
        amenities: ['Ocean Breeze', 'Stargazing', 'Outdoor Bath', 'Yoga Deck']
    },
    {
        id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
        title: 'Costa Rica Eco Lodge',
        location: 'Monteverde',
        country_id: 'CRI',
        capacity: 6,
        total_price: 180000,
        available_shares_pct: 100,
        expected_roi_pct: 13.2,
        images: ['https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?q=80&w=600&auto=format&fit=crop', 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?q=80&w=600&auto=format&fit=crop'],
        amenities: ['Rainforest View', 'Wildlife Watching', 'Sustainable Materials', 'Hammocks']
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

async function seed() {
    console.log('Seeding new countries...');
    const { error: countryError } = await supabase.from('countries').upsert(newCountries);
    if (countryError) {
        console.error('Error seeding countries:', countryError);
    } else {
        console.log('Countries seeded successfully.');
    }

    console.log('Seeding new opportunities...');
    const { error: oppError } = await supabase.from('opportunities').upsert(newOpportunities);
    if (oppError) {
        console.error('Error seeding opportunities:', oppError);
    } else {
        console.log('Opportunities seeded successfully.');
    }
}

seed();
