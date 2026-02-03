'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Phone,
    CheckCircle,
    AlertTriangle,
    XCircle,
    Clock,
    BarChart3,
    Filter,
    Search,
    RefreshCw,
    PhoneCall,
    Home,
    Users,
    UserCheck,
    Zap,
    LogOut
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

interface Task {
    task_id: string;
    intent: string;
    issue: string;
    urgency: string;
    location?: string;
    preferred_time?: string;
    confidence: number;
    status: string;
    customer_phone: string;
    created_at: string;
    assigned_to?: string;
    assigned_worker_name?: string;
}

interface DashboardStats {
    total_calls: number;
    tasks_created: number;
    escalations: number;
    failures: number;
    success_rate: number;
}

interface WorkerStats {
    total_workers: number;
    available: number;
    busy: number;
    offline: number;
    total_jobs_done: number;
    average_rating: number | null;
}

interface Worker {
    id: string;
    name: string;
    skills: string[];
    status: string;
    current_tasks: number;
    max_tasks: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [workerStats, setWorkerStats] = useState<WorkerStats | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [workers, setWorkers] = useState<Worker[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [assigningTask, setAssigningTask] = useState<string | null>(null);
    const { token, logout } = useAuth();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        filterTasks();
    }, [tasks, statusFilter, searchQuery]);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const headers = {
                'Authorization': `Bearer ${token}`
            };

            const [statsRes, tasksRes, workerStatsRes, workersRes] = await Promise.all([
                fetch(`${API_URL}/api/dashboard/stats`, { headers }),
                fetch(`${API_URL}/api/tasks`, { headers }),
                fetch(`${API_URL}/api/workers/stats`, { headers }),
                fetch(`${API_URL}/api/workers?status=available`, { headers })
            ]);

            if (statsRes.ok) {
                const statsData = await statsRes.json();
                setStats(statsData);
            }

            if (tasksRes.ok) {
                const tasksData = await tasksRes.json();
                setTasks(tasksData);
            }

            if (workerStatsRes.ok) {
                const workerStatsData = await workerStatsRes.json();
                setWorkerStats(workerStatsData);
            }

            if (workersRes.ok) {
                const workersData = await workersRes.json();
                setWorkers(workersData);
            }
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterTasks = () => {
        let filtered = [...tasks];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(task => task.status === statusFilter);
        }

        if (searchQuery) {
            filtered = filtered.filter(task =>
                task.issue.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.intent.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.customer_phone.includes(searchQuery)
            );
        }

        setFilteredTasks(filtered);
    };

    const updateTaskStatus = async (taskId: string, newStatus: string) => {
        try {
            const res = await fetch(`${API_URL}/api/tasks/${taskId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                fetchDashboardData();
            }
        } catch (error) {
            console.error('Failed to update task:', error);
        }
    };

    const autoAssignTask = async (taskId: string) => {
        setAssigningTask(taskId);
        try {
            const response = await fetch(`${API_URL}/api/tasks/${taskId}/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ auto: true })
            });

            if (response.ok) {
                // Refresh data
                await fetchDashboardData();
                alert('Task auto-assigned successfully!');
            } else {
                const error = await response.json();
                alert(error.detail || 'Failed to assign task');
            }
        } catch (error) {
            console.error('Error assigning task:', error);
            alert('Failed to assign task. Please try again.');
        } finally {
            setAssigningTask(null);
        }
    };

    const manualAssignTask = async (taskId: string, workerId: string) => {
        setAssigningTask(taskId);
        try {
            const res = await fetch(`${API_URL}/api/tasks/${taskId}/assign?worker_id=${workerId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                fetchDashboardData();
            } else {
                const error = await res.json();
                alert(error.detail || 'Failed to assign task');
            }
        } catch (error) {
            console.error('Failed to assign task:', error);
            alert('Failed to assign task. Please try again.');
        } finally {
            setAssigningTask(null);
        }
    };

    const getUrgencyColor = (urgency: string) => {
        switch (urgency.toLowerCase()) {
            case 'critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            case 'high': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30';
            case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30';
            case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
            case 'in_progress': return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
            case 'escalated': return 'text-red-600 bg-red-100 dark:bg-red-900/30';
            case 'closed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-3 group">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold gradient-text">VoiceTask AI</span>
                            </Link>
                            <span className="text-slate-400">|</span>
                            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Dashboard</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/dashboard/workers"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                            >
                                <Users className="w-4 h-4" />
                                <span className="hidden sm:inline">Workers</span>
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </Link>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={fetchDashboardData}
                                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                                >
                                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                                <button
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    {stats ? (
                        <>
                            <StatCard
                                title="Total Calls"
                                value={stats.total_calls}
                                icon={Phone}
                                color="from-blue-500 to-cyan-500"
                            />
                            <StatCard
                                title="Tasks Created"
                                value={stats.tasks_created}
                                icon={CheckCircle}
                                color="from-green-500 to-emerald-500"
                            />
                            <StatCard
                                title="Escalations"
                                value={stats.escalations}
                                icon={AlertTriangle}
                                color="from-orange-500 to-red-500"
                            />
                            <StatCard
                                title="Failures"
                                value={stats.failures}
                                icon={XCircle}
                                color="from-red-500 to-pink-500"
                            />
                            <StatCard
                                title="Success Rate"
                                value={`${stats.success_rate}%`}
                                icon={BarChart3}
                                color="from-purple-500 to-indigo-500"
                            />
                        </>
                    ) : (
                        <div className="col-span-5 text-center py-8 text-slate-500">Loading stats...</div>
                    )}
                </div>

                {/* Worker Stats */}
                {workerStats && (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 mb-8 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Users className="w-6 h-6" />
                                Worker Overview
                            </h2>
                            <Link
                                href="/dashboard/workers"
                                className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
                            >
                                Manage Workers
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                                <div className="text-3xl font-bold">{workerStats.total_workers}</div>
                                <div className="text-sm opacity-90">Total Workers</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                                <div className="text-3xl font-bold text-green-300">{workerStats.available}</div>
                                <div className="text-sm opacity-90">Available</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                                <div className="text-3xl font-bold text-yellow-300">{workerStats.busy}</div>
                                <div className="text-sm opacity-90">Busy</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                                <div className="text-3xl font-bold">{workerStats.total_jobs_done}</div>
                                <div className="text-sm opacity-90">Jobs Done</div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                                <div className="text-3xl font-bold">
                                    {workerStats.average_rating ? workerStats.average_rating.toFixed(1) : 'N/A'}
                                </div>
                                <div className="text-sm opacity-90">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 mb-6 border border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            {['all', 'new', 'in_progress', 'escalated', 'closed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2.5 rounded-lg font-medium transition ${statusFilter === status
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                                        }`}
                                >
                                    {status.replace('_', ' ').toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tasks Table */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Intent</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Issue</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Urgency</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Status</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Assigned To</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Customer</th>
                                    <th className="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
                                        <tr key={task.task_id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                                            <td className="px-6 py-4">
                                                <span className="font-medium text-slate-900 dark:text-white">{task.intent}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-slate-600 dark:text-slate-400 max-w-xs truncate">{task.issue}</p>
                                                {task.location && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">📍 {task.location}</p>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getUrgencyColor(task.urgency)}`}>
                                                    {task.urgency.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                                                    {task.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {task.assigned_worker_name ? (
                                                    <div className="flex items-center gap-2">
                                                        <UserCheck className="w-4 h-4 text-green-600" />
                                                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                                                            {task.assigned_worker_name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => autoAssignTask(task.task_id)}
                                                        disabled={assigningTask === task.task_id}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-50"
                                                    >
                                                        <Zap className="w-4 h-4" />
                                                        {assigningTask === task.task_id ? 'Assigning...' : 'Auto-Assign'}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <PhoneCall className="w-4 h-4 text-slate-400" />
                                                    <span className="text-slate-600 dark:text-slate-400">{task.customer_phone}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={task.status}
                                                    onChange={(e) => updateTaskStatus(task.task_id, e.target.value)}
                                                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                >
                                                    <option value="new">New</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="escalated">Escalated</option>
                                                    <option value="closed">Closed</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                                            {loading ? 'Loading tasks...' : 'No tasks found'}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <div className="text-3xl font-extrabold gradient-text mb-1">{value}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{title}</div>
        </div>
    );
}
