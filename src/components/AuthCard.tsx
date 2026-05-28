import { useState } from 'react';
import { Eye, EyeOff, Zap } from 'lucide-react';
import type { AuthTab } from '@/types';

interface AuthCardProps {
  onConnect: () => void;
}

export default function AuthCard({ onConnect }: AuthCardProps) {
  const [activeTab, setActiveTab] = useState<AuthTab>('connect');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect();
  };

  return (
    <div className="relative z-10 flex items-center justify-end min-h-screen pr-8 md:pr-16 lg:pr-24">
      <div className="w-[420px] glass-panel rounded-xl overflow-hidden animate-slideUp">
        {/* Top gradient decoration */}
        <div className="h-1 gradient-brand" />

        <div className="p-6">
          {/* Brand */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl font-extralight tracking-widest text-white">
                SYNAPSE
              </h1>
              <Zap className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 uppercase tracking-[0.2em]">
              Neural Document Interface
            </p>
          </div>

          {/* Tab switcher */}
          <div className="flex mb-6 border-b border-gray-800">
            <button
              onClick={() => setActiveTab('connect')}
              className={`flex-1 pb-3 text-sm font-medium transition-all duration-300 relative ${
                activeTab === 'connect'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Connect
              {activeTab === 'connect' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-brand" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('initialize')}
              className={`flex-1 pb-3 text-sm font-medium transition-all duration-300 relative ${
                activeTab === 'initialize'
                  ? 'text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Initialize
              {activeTab === 'initialize' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 gradient-brand" />
              )}
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Identity
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="neural-id / email"
                className="w-full bg-[#0a1120] text-white text-sm px-4 py-3 rounded-md border border-transparent focus:border-blue-500/50 focus:glow-blue outline-none transition-all duration-300 placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="w-full bg-[#0a1120] text-white text-sm px-4 py-3 pr-10 rounded-md border border-transparent focus:border-blue-500/50 focus:glow-blue outline-none transition-all duration-300 placeholder:text-gray-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {activeTab === 'initialize' && (
              <div>
                <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
                  Confirm Passphrase
                </label>
                <input
                  type="password"
                  placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
                  className="w-full bg-[#0a1120] text-white text-sm px-4 py-3 rounded-md border border-transparent focus:border-blue-500/50 focus:glow-blue outline-none transition-all duration-300 placeholder:text-gray-600"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full gradient-brand text-white text-sm font-medium py-3 rounded-md mt-6 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              {activeTab === 'connect' ? 'Establish Connection' : 'Initialize Node'}
            </button>

            <p className="text-center text-xs text-gray-600 mt-4">
              {activeTab === 'connect'
                ? 'Secure neural link encryption active'
                : 'New node will be registered in the mesh'}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
