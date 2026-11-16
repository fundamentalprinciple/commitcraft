import React from 'react';
import { GitBranch, Skull } from 'lucide-react';
import SpookyBackground from '../components/halloween/SpookyBackground';
import Button from '../components/common/Button';

const LoginPage: React.FC = () => {
  const handleGitHubLogin = () => {
    window.location.href = '/api/auth/github';
  };

  return (
    <div className="relative min-h-screen bg-halloween-dark flex items-center justify-center overflow-hidden">
      <SpookyBackground particleCount={12} showBats />

      <div className="relative z-10 w-full max-w-sm px-6">
        <div className="card-glow rounded-2xl p-10 text-center">
          {/* Logo */}
          <div className="w-16 h-16 rounded-2xl bg-halloween-orange/20 flex items-center justify-center mx-auto mb-5 animate-pulse-glow">
            <Skull size={32} className="text-halloween-orange" />
          </div>

          <h1 className="font-cinzel text-2xl font-bold text-halloween-ghost mb-2">
            CommitCraft
          </h1>
          <p className="text-halloween-ghost-muted text-sm mb-8">
            Sign in to begin your haunted journey
          </p>

          <Button
            onClick={handleGitHubLogin}
            size="lg"
            className="w-full"
            leftIcon={<GitBranch size={20} />}
          >
            Continue with GitHub
          </Button>

          <p className="text-halloween-ghost-dim text-xs mt-6 leading-relaxed">
            By signing in you agree to connect your GitHub account.
            CommitCraft only reads repository activity — it never writes on your behalf.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
