'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    UserPlus,
    Edit2,
    Trash2,
    CheckCircle,
    XCircle,
    Clock,
    Star,
    Briefcase,
    Phone,
    ArrowLeft,
    RefreshCw,
    Award,
    TrendingUp,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Worker {
    id: string;
    name: string;
    phone: string;
    skills: string[];
    status: string;
    current_tasks: number;
    max_tasks: number;
    rating: number | null;
    total_jobs: number;
    created_at: string;
    updated_at: string;
}

interface WorkerStats {
    total_workers: number;
    available: number;
    busy: number;
    offline: number;
    total_jobs_done: number;
    average_rating: number | null;
}

const SKILL_OPTIONS = [
    "AC Repair",
    "Plumbing",
    "Electrical",
    "General Maintenance",
    "Carpentry",
    "Painting",
    "Pest Control",
    "Refrigerator Repair"
];

export default function WorkersPage() {
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [stats, setStats] = useState<WorkerStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingWorker, setEditingWorker] = useState<Worker | null>(null);
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const { token, logout } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        skills: [] as string[],
        max_tasks: 5,
        status: 'available'
    });

    useEffect(() => {
        fetchData();
    }, [filterStatus]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch workers
            const workersUrl = filterStatus === 'all'
                ? `${API_URL}/api/workers`
                : `${API_URL}/api/workers?status=${filterStatus}`;

            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const [workersRes, statsRes] = await Promise.all([
                fetch(workersUrl, { headers }),
                fetch(`${API_URL}/api/workers/stats`, { headers })
            ]);

            const workersData = await workersRes.json();
            const statsData = await statsRes.json();

            setWorkers(workersData);
            setStats(statsData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingWorker) {
                // Update existing worker
                const response = await fetch(`${API_URL}/api/workers/${editingWorker.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Failed to update worker');
            } else {
                // Create new worker
                const response = await fetch(`${API_URL}/api/workers`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formData)
                });

                if (!response.ok) throw new Error('Failed to create worker');
            }

            // Reset form and refresh
            resetForm();
            fetchData();
        } catch (error) {
            console.error('Error saving worker:', error);
            alert('Failed to save worker. Please try again.');
        }
    };

    const handleDelete = async (workerId: string) => {
        if (!confirm('Are you sure you want to delete this worker?')) return;

        try {
            const response = await fetch(`${API_URL}/api/workers/${workerId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete worker');

            fetchData();
        } catch (error) {
            console.error('Error deleting worker:', error);
            alert('Failed to delete worker. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            phone: '',
            skills: [],
            max_tasks: 5,
            status: 'available'
        });
        setShowAddForm(false);
        setEditingWorker(null);
    };

    const startEdit = (worker: Worker) => {
        setFormData({
            name: worker.name,
            phone: worker.phone,
            skills: worker.skills,
            max_tasks: worker.max_tasks,
            status: worker.status
        });
        setEditingWorker(worker);
        setShowAddForm(true);
    };

    const toggleSkill = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'busy': return 'bg-yellow-100 text-yellow-800';
            case 'offline': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'available': return <CheckCircle className="w-4 h-4" />;
            case 'busy': return <Clock className="w-4 h-4" />;
            case 'offline': return <XCircle className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading workers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/dashboard"
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <Users className="w-8 h-8 text-blue-600" />
                                    Worker Management
                                </h1>
                                <p className="text-gray-600 mt-1">Manage your service team</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button
                                onClick={logout}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                            <button
                                onClick={() => setShowAddForm(true)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
                            >
                                <UserPlus className="w-5 h-5" />
                                Add Worker
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Total Workers"
                            value={stats.total_workers}
                            icon={Users}
                            color="blue"
                        />
                        <StatCard
                            title="Available"
                            value={stats.available}
                            icon={CheckCircle}
                            color="green"
                        />
                        <StatCard
                            title="Busy"
                            value={stats.busy}
                            icon={Clock}
                            color="yellow"
                        />
                        <StatCard
                            title="Avg Rating"
                            value={stats.average_rating ? stats.average_rating.toFixed(1) : 'N/A'}
                            icon={Star}
                            color="purple"
                        />
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Filter:</span>
                        <div className="flex gap-2">
                            {['all', 'available', 'busy', 'offline'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterStatus === status
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={fetchData}
                            className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Workers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers.map((worker) => (
                        <div
                            key={worker.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                        <Phone className="w-4 h-4" />
                                        {worker.phone}
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(worker.status)}`}>
                                    {getStatusIcon(worker.status)}
                                    {worker.status}
                                </span>
                            </div>

                            {/* Skills */}
                            <div className="mb-4">
                                <div className="flex flex-wrap gap-2">
                                    {worker.skills.map((skill) => (
                                        <span
                                            key={skill}
                                            className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-gray-100">
                                <div>
                                    <div className="text-xs text-gray-500">Current Tasks</div>
                                    <div className="text-lg font-bold text-gray-900">
                                        {worker.current_tasks}/{worker.max_tasks}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Total Jobs</div>
                                    <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                        <TrendingUp className="w-4 h-4 text-green-600" />
                                        {worker.total_jobs}
                                    </div>
                                </div>
                                {worker.rating && (
                                    <div className="col-span-2">
                                        <div className="text-xs text-gray-500">Rating</div>
                                        <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
                                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                            {worker.rating.toFixed(1)}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => startEdit(worker)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(worker.id)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {workers.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No workers found</h3>
                        <p className="text-gray-600 mb-4">Get started by adding your first worker</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add Worker
                        </button>
                    </div>
                )}
            </div>

            {/* Add/Edit Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {editingWorker ? 'Edit Worker' : 'Add New Worker'}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Worker Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter worker name"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone Number *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="+919876543210"
                                />
                            </div>

                            {/* Skills */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Skills * (Select at least one)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {SKILL_OPTIONS.map((skill) => (
                                        <button
                                            key={skill}
                                            type="button"
                                            onClick={() => toggleSkill(skill)}
                                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${formData.skills.includes(skill)
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                }`}
                                        >
                                            {skill}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Max Tasks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Maximum Concurrent Tasks
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="20"
                                    value={formData.max_tasks}
                                    onChange={(e) => setFormData({ ...formData, max_tasks: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Status (only for edit) */}
                            {editingWorker && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Status
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="available">Available</option>
                                        <option value="busy">Busy</option>
                                        <option value="offline">Offline</option>
                                    </select>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={formData.skills.length === 0}
                                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {editingWorker ? 'Update Worker' : 'Add Worker'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ElementType;
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        purple: 'bg-purple-50 text-purple-600',
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                </div>
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}
