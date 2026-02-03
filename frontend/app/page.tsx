import Link from 'next/link';
import { Phone, Zap, CheckCircle, ArrowRight, BarChart3, Clock, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">VoiceTask AI</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                Features
              </Link>
              <Link href="#how-it-works" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                How It Works
              </Link>
              <Link href="#pricing" className="text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition">
                Pricing
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto animate-fade-in">
            <div className="inline-block mb-6">
              <span className="px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold border border-indigo-200 dark:border-indigo-800">
                🚀 AI-Powered Voice Intelligence
              </span>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
              Never Miss a <br />
              <span className="gradient-text">Customer Call</span> Again
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              AI voice receptionist that answers calls instantly, understands customer needs,
              and converts conversations into structured action items—24/7.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="group px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#demo"
                className="px-8 py-4 rounded-xl border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold text-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all duration-300"
              >
                Watch Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Calls Answered', value: '10K+', icon: Phone },
                { label: 'Tasks Created', value: '8.5K+', icon: CheckCircle },
                { label: 'Success Rate', value: '95%', icon: Zap }
              ].map((stat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
                  <stat.icon className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-2" />
                  <div className="text-3xl font-extrabold gradient-text">{stat.value}</div>
                  <div className="text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-4">
              Built for <span className="gradient-text">Service Businesses</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Stop losing revenue from missed calls. Let AI handle intake while you focus on execution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: 'Instant Call Answering',
                description: 'AI answers every call in under 2 seconds. No waiting, no missed opportunities.',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Zap,
                title: 'Smart Intent Extraction',
                description: 'Understands customer needs and categorizes service requests automatically.',
                color: 'from-indigo-500 to-purple-500'
              },
              {
                icon: CheckCircle,
                title: 'Structured Task Creation',
                description: 'Converts conversations into actionable tasks with all details captured.',
                color: 'from-purple-500 to-pink-500'
              },
              {
                icon: BarChart3,
                title: 'Real-time Dashboard',
                description: 'Monitor all calls, tasks, and escalations from a single command center.',
                color: 'from-green-500 to-emerald-500'
              },
              {
                icon: Clock,
                title: 'Auto-Escalation',
                description: 'Low confidence or urgent cases escalate to humans automatically.',
                color: 'from-orange-500 to-red-500'
              },
              {
                icon: Shield,
                title: 'Never Loses Context',
                description: 'Full transcripts and confidence scores logged for every interaction.',
                color: 'from-cyan-500 to-blue-500'
              }
            ].map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold mb-4">
              Simple <span className="gradient-text">3-Step Process</span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              From call to task in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Customer Calls',
                description: 'AI answers instantly and engages in natural conversation to understand the request.'
              },
              {
                step: '02',
                title: 'AI Extracts Intent',
                description: 'Identifies service type, urgency, location, and preferences with high accuracy.'
              },
              {
                step: '03',
                title: 'Task Created',
                description: 'Structured task appears in dashboard. Team gets notified. You take action.'
              }
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                  <div className="text-6xl font-extrabold gradient-text mb-4">{step.step}</div>
                  <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{step.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{step.description}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8">
                    <ArrowRight className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="p-12 rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white text-center shadow-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
              Ready to Transform Your Service Business?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join service businesses already using VoiceTask AI to capture every opportunity.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-white text-indigo-600 font-bold text-lg hover:shadow-2xl transition-all duration-300"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-indigo-200 mt-4">No credit card required • 14-day free trial</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-slate-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">VoiceTask AI</span>
              </div>
              <p className="text-sm">AI-powered voice intelligence for service businesses</p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#features" className="hover:text-white transition">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-white transition">Pricing</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">About</Link></li>
                <li><Link href="#" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="hover:text-white transition">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition">Terms</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-sm">
            <p>© 2026 VoiceTask AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
