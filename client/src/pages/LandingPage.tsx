import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, Skull, Zap, Map, Trophy, Users } from 'lucide-react';
import SpookyBackground from '../components/halloween/SpookyBackground';
import Button from '../components/common/Button';
import { GhostIcon, PumpkinIcon } from '../components/halloween/icons';

const features = [
  {
    icon: <Zap className="text-halloween-orange" size={24} />,
    title: 'GitHub Activity → Rewards',
    desc: 'Every commit, PR, and review earns XP and coins automatically through real webhooks.',
  },
  {
    icon: <Map className="text-halloween-purple-light" size={24} />,
    title: 'Build Your Haunted Island',
    desc: 'Spend coins to unlock castles, pumpkin farms, and spooky structures on your 2D island.',
  },
  {
    icon: <Trophy className="text-halloween-amber" size={24} />,
    title: 'Halloween Achievements',
    desc: 'Earn legendary badges like "Monster Merge", "Night Owl", and "Pumpkin Master".',
  },
  {
    icon: <Users className="text-halloween-green" size={24} />,
    title: 'Team Progression',
    desc: 'Build a team, share repositories, and grow your island together.',
  },
];

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-halloween-dark overflow-hidden">
      <SpookyBackground particleCount={20} showBats />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-halloween-orange/20 flex items-center justify-center animate-pulse-glow">
            <Skull size={20} className="text-halloween-orange" />
          </div>
          <span className="font-cinzel font-bold text-halloween-ghost text-lg">CommitCraft</span>
        </div>
        <Link to="/login">
          <Button variant="ghost" size="sm" leftIcon={<GitBranch size={16} />}>
            Sign In
          </Button>
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 text-center">
        <div className="flex justify-center gap-4 mb-8 animate-float">
          <GhostIcon size={48} className="text-halloween-ghost/40" />
          <PumpkinIcon size={48} className="text-halloween-orange/60" />
          <GhostIcon size={48} className="text-halloween-ghost/40" />
        </div>

        <h1 className="font-cinzel text-4xl sm:text-5xl lg:text-6xl font-black text-halloween-ghost mb-6 leading-tight">
          Turn Every Commit Into{' '}
          <span className="text-halloween-orange text-glow">Progress</span>
        </h1>

        <p className="text-halloween-ghost-muted text-lg sm:text-xl max-w-2xl mx-auto mb-4 leading-relaxed">
          CommitCraft transforms real GitHub activity into a Halloween-themed gamification
          experience. Build your team's haunted kingdom, one push at a time.
        </p>

        <p className="text-halloween-ghost-dim text-sm mb-10 italic">
          🎃 Build your team's kingdom, one push at a time.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button size="lg" leftIcon={<GitBranch size={20} />}>
              Sign In with GitHub
            </Button>
          </Link>
          <a href="#features">
            <Button variant="ghost" size="lg">
              Learn More
            </Button>
          </a>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap justify-center gap-8 mt-16 pt-8 border-t border-halloween-purple/20">
          {[
            { value: 'XP & Coins', label: 'for every commit' },
            { value: '9 Buildings', label: 'to unlock' },
            { value: 'AI Quests', label: 'powered by LLM' },
            { value: 'Real-time', label: 'via webhooks' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-cinzel text-xl font-bold text-halloween-orange">{s.value}</div>
              <div className="text-halloween-ghost-muted text-xs mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <h2 className="font-cinzel text-3xl font-bold text-center text-halloween-ghost mb-12">
          How It Works
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="card hover:border-halloween-purple/50 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-halloween-purple/20 flex items-center justify-center shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-cinzel font-semibold text-halloween-ghost mb-1">{f.title}</h3>
                  <p className="text-halloween-ghost-muted text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA footer */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="card-glow rounded-2xl p-10">
          <PumpkinIcon size={40} className="text-halloween-orange mx-auto mb-4 animate-bounce-soft" />
          <h2 className="font-cinzel text-2xl font-bold text-halloween-ghost mb-3">
            Ready to Haunt Your Repo?
          </h2>
          <p className="text-halloween-ghost-muted mb-6 text-sm">
            Connect your GitHub account and start earning rewards for every line of code.
          </p>
          <Link to="/login">
            <Button size="lg" leftIcon={<GitBranch size={20} />}>
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
