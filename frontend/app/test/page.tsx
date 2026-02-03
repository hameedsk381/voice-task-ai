'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Phone, Send, Loader2, CheckCircle, XCircle, Home } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const SAMPLE_REQUESTS = [
    {
        title: 'AC Repair - Urgent',
        text: "Hello, my AC stopped working completely. It's not cooling at all. I'm in Madhapur and it's really hot. Can someone come today?"
    },
    {
        title: 'Plumbing - Medium',
        text: "Hi, I have a leaking faucet in my kitchen. It's been dripping for a few days. I'm in Banjara Hills. When can someone fix it?"
    },
    {
        title: 'Electrical - Critical',
        text: "Emergency! The main circuit breaker in my house keeps tripping. I have no power. I'm in Gachibowli. Need immediate help!"
    },
    {
        title: 'Clinic Appointment',
        text: "I'd like to book an appointment for tomorrow afternoon. I have a persistent cough and need to see a doctor. My phone is 9876543210."
    },
    {
        title: 'General Maintenance',
        text: "We need a general inspection of our apartment. Looking for next week, preferably Wednesday. We're in Kondapur."
    }
];

export default function TestPage() {
    const [phoneNumber, setPhoneNumber] = useState('+919876543210');
    const [voiceText, setVoiceText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/api/voice/inbound`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone_number: phoneNumber,
                    voice_text: voiceText
                })
            });

            if (!response.ok) {
                throw new Error('Failed to process request');
            }

            const data = await response.json();
            setResult(data);
            setVoiceText(''); // Clear input
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const useSample = (sampleText: string) => {
        setVoiceText(sampleText);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
            {/* Header */}
            <header className="border-b border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg sticky top-0 z-40">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold gradient-text">VoiceTask AI</span>
                            </Link>
                            <span className="text-slate-400">|</span>
                            <h1 className="text-xl font-semibold text-slate-700 dark:text-slate-200">Test Voice Intake</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition"
                            >
                                <Home className="w-4 h-4" />
                                Home
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl">
                            <h2 className="text-2xl font-bold mb-6 gradient-text">Simulate Voice Call</h2>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Customer Phone Number
                                    </label>
                                    <input
                                        type="text"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        placeholder="+919876543210"
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                                        Voice Transcript (What the customer says)
                                    </label>
                                    <textarea
                                        value={voiceText}
                                        onChange={(e) => setVoiceText(e.target.value)}
                                        placeholder="Type or select a sample request..."
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Process Call
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Sample Requests */}
                        <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Sample Requests</h3>
                            <div className="space-y-2">
                                {SAMPLE_REQUESTS.map((sample, i) => (
                                    <button
                                        key={i}
                                        onClick={() => useSample(sample.text)}
                                        className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 border border-slate-200 dark:border-slate-600 hover:border-indigo-300 dark:hover:border-indigo-700 transition"
                                    >
                                        <div className="font-semibold text-sm text-slate-700 dark:text-slate-200">{sample.title}</div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate">{sample.text}</div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Result Display */}
                    <div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-200 dark:border-slate-700 shadow-xl min-h-[500px]">
                            <h2 className="text-2xl font-bold mb-6 gradient-text">Result</h2>

                            {loading && (
                                <div className="flex flex-col items-center justify-center h-64">
                                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                                    <p className="text-slate-600 dark:text-slate-400">Processing voice intake...</p>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <div className="font-semibold text-red-900 dark:text-red-200">Error</div>
                                        <div className="text-sm text-red-700 dark:text-red-300">{error}</div>
                                    </div>
                                </div>
                            )}

                            {result && (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <div className="font-semibold text-green-900 dark:text-green-200">Task Created Successfully!</div>
                                            <div className="text-sm text-green-700 dark:text-green-300">Task ID: {result.task_id}</div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Intent</div>
                                            <div className="font-bold text-slate-900 dark:text-white">{result.intent}</div>
                                        </div>

                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Urgency</div>
                                            <div className="font-bold text-slate-900 dark:text-white capitalize">{result.urgency}</div>
                                        </div>

                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Status</div>
                                            <div className="font-bold text-slate-900 dark:text-white capitalize">{result.status}</div>
                                        </div>

                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Confidence</div>
                                            <div className="font-bold text-slate-900 dark:text-white">{(result.confidence * 100).toFixed(1)}%</div>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">Issue Description</div>
                                        <div className="text-slate-900 dark:text-white">{result.issue}</div>
                                    </div>

                                    {result.location && (
                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Location</div>
                                            <div className="text-slate-900 dark:text-white">📍 {result.location}</div>
                                        </div>
                                    )}

                                    {result.preferred_time && (
                                        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                                            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">Preferred Time</div>
                                            <div className="text-slate-900 dark:text-white">🕐 {result.preferred_time}</div>
                                        </div>
                                    )}

                                    <Link
                                        href="/dashboard"
                                        className="block w-full text-center py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition mt-6"
                                    >
                                        View in Dashboard →
                                    </Link>
                                </div>
                            )}

                            {!loading && !result && !error && (
                                <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                                    <Phone className="w-16 h-16 mb-4" />
                                    <p>Submit a voice request to see results</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
