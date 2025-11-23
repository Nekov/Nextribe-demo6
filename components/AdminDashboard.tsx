import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CabinOpportunity, CountryData } from '../types';
import { Plus, Edit, Trash2, X, Save, MapPin, DollarSign, Users, TrendingUp, Image as ImageIcon } from 'lucide-react';

const AdminDashboard = () => {
    const [opportunities, setOpportunities] = useState<CabinOpportunity[]>([]);
    const [countries, setCountries] = useState<CountryData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentOpp, setCurrentOpp] = useState<Partial<CabinOpportunity>>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setIsLoading(true);
        const [oppsData, countriesData] = await Promise.all([
            api.getOpportunities(),
            api.getCountries()
        ]);
        setOpportunities(oppsData);
        setCountries(countriesData);
        setIsLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this opportunity?')) {
            const success = await api.deleteOpportunity(id);
            if (success) {
                setOpportunities(opportunities.filter(o => o.id !== id));
            } else {
                alert('Failed to delete opportunity');
            }
        }
    };

    const handleEdit = (opp: CabinOpportunity) => {
        setCurrentOpp(opp);
        setIsEditing(true);
    };

    const handleAddNew = () => {
        setCurrentOpp({
            title: '',
            location: '',
            country: countries[0]?.name || '',
            capacity: 2,
            totalPrice: 100000,
            availableSharesPct: 100,
            expectedRoiPct: 10,
            images: [''],
            amenities: []
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!currentOpp.title || !currentOpp.location || !currentOpp.totalPrice) {
            alert('Please fill in all required fields');
            return;
        }

        // Ensure images is an array of strings
        const images = Array.isArray(currentOpp.images) && currentOpp.images.length > 0 && currentOpp.images[0] !== ''
            ? currentOpp.images
            : ['https://placehold.co/600x400?text=No+Image'];

        const oppData = {
            ...currentOpp,
            images,
            amenities: currentOpp.amenities || []
        } as any; // Type casting for simplicity in this demo

        let success = false;
        if (currentOpp.id) {
            success = await api.updateOpportunity(currentOpp.id, oppData);
        } else {
            const newOpp = await api.createOpportunity(oppData);
            success = !!newOpp;
        }

        if (success) {
            setIsEditing(false);
            loadData();
        } else {
            alert('Failed to save opportunity');
        }
    };

    if (isLoading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold">Listings Management</h1>
                <button
                    onClick={handleAddNew}
                    className="w-full sm:w-auto bg-gold text-primary px-4 py-2.5 md:py-2 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Listing
                </button>
            </div>

            {isEditing ? (
                <div className="bg-primary-light p-6 rounded-xl border border-gray-700 max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentOpp.id ? 'Edit Listing' : 'New Listing'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Title</label>
                            <input
                                type="text"
                                value={currentOpp.title || ''}
                                onChange={e => setCurrentOpp({ ...currentOpp, title: e.target.value })}
                                className="w-full bg-primary border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={currentOpp.location || ''}
                                        onChange={e => setCurrentOpp({ ...currentOpp, location: e.target.value })}
                                        className="w-full bg-primary border border-gray-700 rounded p-2 pl-9 text-white focus:border-gold outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Country</label>
                                <select
                                    value={currentOpp.country || ''}
                                    onChange={e => setCurrentOpp({ ...currentOpp, country: e.target.value })}
                                    className="w-full bg-primary border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
                                >
                                    <option value="">Select Country</option>
                                    {countries.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Total Price ($)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="number"
                                        value={currentOpp.totalPrice || 0}
                                        onChange={e => setCurrentOpp({ ...currentOpp, totalPrice: Number(e.target.value) })}
                                        className="w-full bg-primary border border-gray-700 rounded p-2 pl-9 text-white focus:border-gold outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Capacity</label>
                                <div className="relative">
                                    <Users className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="number"
                                        value={currentOpp.capacity || 0}
                                        onChange={e => setCurrentOpp({ ...currentOpp, capacity: Number(e.target.value) })}
                                        className="w-full bg-primary border border-gray-700 rounded p-2 pl-9 text-white focus:border-gold outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Available Shares (%)</label>
                                <input
                                    type="number"
                                    value={currentOpp.availableSharesPct || 0}
                                    onChange={e => setCurrentOpp({ ...currentOpp, availableSharesPct: Number(e.target.value) })}
                                    className="w-full bg-primary border border-gray-700 rounded p-2 text-white focus:border-gold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Expected ROI (%)</label>
                                <div className="relative">
                                    <TrendingUp className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                    <input
                                        type="number"
                                        step="0.1"
                                        value={currentOpp.expectedRoiPct || 0}
                                        onChange={e => setCurrentOpp({ ...currentOpp, expectedRoiPct: Number(e.target.value) })}
                                        className="w-full bg-primary border border-gray-700 rounded p-2 pl-9 text-white focus:border-gold outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Image URL</label>
                            <div className="relative">
                                <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
                                <input
                                    type="text"
                                    value={currentOpp.images?.[0] || ''}
                                    onChange={e => setCurrentOpp({ ...currentOpp, images: [e.target.value] })}
                                    className="w-full bg-primary border border-gray-700 rounded p-2 pl-9 text-white focus:border-gold outline-none"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleSave}
                            className="w-full bg-gold text-primary font-bold py-3 rounded-lg mt-4 hover:bg-white transition-colors flex justify-center items-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            Save Listing
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {opportunities.map(opp => (
                        <div key={opp.id} className="bg-primary-light rounded-xl overflow-hidden border border-gray-700 group hover:border-gold transition-colors">
                            <div className="h-48 overflow-hidden relative">
                                <img src={opp.images[0]} alt={opp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button
                                        onClick={() => handleEdit(opp)}
                                        className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-gold hover:text-primary transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(opp.id)}
                                        className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 hover:text-white transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg leading-tight">{opp.title}</h3>
                                    <span className="text-gold font-bold">${(opp.totalPrice / 1000).toFixed(0)}k</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                    <MapPin className="w-4 h-4" />
                                    {opp.location}, {opp.country}
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400 border-t border-gray-700 pt-3">
                                    <div>
                                        <div className="text-white font-bold">{opp.availableSharesPct}%</div>
                                        <div>Available</div>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{opp.expectedRoiPct}%</div>
                                        <div>ROI</div>
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{opp.capacity}</div>
                                        <div>Guests</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
