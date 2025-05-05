'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useNoir } from '@/hooks/useNoir';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export default function SubmitPage() {
  const { isConnected } = useAccount();
  const { isConnected: isEmailVerified, isVerifying, error, verifyEmail } = useNoir();
  const [email, setEmail] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    keywords: '',
    file: null as File | null,
  });
  const { openConnectModal } = useConnectModal();

  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyEmail(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic with Noir integration
    console.log('Submitting paper:', formData);
  };

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-10 text-center bg-gradient-to-r from-[#6366f1] via-[#60a5fa] to-[#a78bfa] bg-clip-text text-transparent drop-shadow-lg">Submit Your Paper</h1>
        {!isConnected && (
          <div className="flex justify-center mb-10">
            <button
              type="button"
              onClick={openConnectModal}
              className="px-8 py-4 bg-gradient-to-r from-[#6366f1] to-[#60a5fa] text-white rounded-2xl text-xl font-bold shadow-xl hover:from-[#60a5fa] hover:to-[#6366f1] transition-all focus:outline-none focus:ring-4 focus:ring-[#a5b4fc]"
            >
              Connect Wallet
            </button>
          </div>
        )}
        {isConnected && !isEmailVerified && (
          <div className="bg-blue-50 text-blue-900 p-6 rounded-2xl mb-8 text-center shadow-lg border border-blue-200">
            <form onSubmit={handleEmailVerify} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-blue-700 mb-1">
                  Verify your institutional email (zkEmail)
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 text-blue-900 placeholder:text-blue-300 shadow"
                  required
                  placeholder="your@email.edu"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#60a5fa] text-white py-3 px-6 rounded-xl hover:from-[#60a5fa] hover:to-[#6366f1] transition-colors text-lg font-semibold shadow-lg disabled:opacity-60"
                disabled={isVerifying}
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
              </button>
              {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </form>
          </div>
        )}
        {isConnected && isEmailVerified && (
          <form onSubmit={handleSubmit} className="space-y-8 bg-white/95 rounded-2xl shadow-2xl p-8 border border-[#e0e7ff]">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-[#312e81] mb-1">
                Paper Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#e0e7ff] rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] text-[#312e81] placeholder:text-[#a5b4fc] shadow"
                required
                placeholder="A Modern Approach to ZK Proofs"
              />
            </div>

            <div>
              <label htmlFor="abstract" className="block text-sm font-semibold text-[#312e81] mb-1">
                Abstract
              </label>
              <textarea
                id="abstract"
                value={formData.abstract}
                onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                rows={5}
                className="w-full px-4 py-3 bg-white border border-[#e0e7ff] rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] text-[#312e81] placeholder:text-[#a5b4fc] shadow"
                required
                placeholder="Summarize your paper in a few sentences..."
              />
            </div>

            <div>
              <label htmlFor="keywords" className="block text-sm font-semibold text-[#312e81] mb-1">
                Keywords (comma-separated)
              </label>
              <input
                type="text"
                id="keywords"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                className="w-full px-4 py-3 bg-white border border-[#e0e7ff] rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] text-[#312e81] placeholder:text-[#a5b4fc] shadow"
                required
                placeholder="zkProof, privacy, blockchain"
              />
            </div>

            <div>
              <label htmlFor="file" className="block text-sm font-semibold text-[#312e81] mb-1">
                Paper File (PDF)
              </label>
              <input
                type="file"
                id="file"
                accept=".pdf"
                onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                className="w-full px-4 py-3 bg-white border border-[#e0e7ff] rounded-xl focus:ring-2 focus:ring-[#6366f1] focus:border-[#6366f1] text-[#312e81] placeholder:text-[#a5b4fc] shadow"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#6366f1] to-[#60a5fa] text-white py-3 px-6 rounded-xl hover:from-[#60a5fa] hover:to-[#6366f1] transition-colors text-lg font-semibold shadow-lg"
              >
                Submit Paper
              </button>
            </div>
          </form>
        )}
        <div className="mt-10 p-6 bg-white/90 border border-[#e0e7ff] rounded-2xl shadow-xl">
          <h2 className="text-lg font-semibold mb-2 text-[#312e81]">Important Notes</h2>
          <ul className="list-disc list-inside space-y-2 text-[#334155]">
            <li>Your paper will be anonymized automatically</li>
            <li>You'll need to verify your institutional email using zkEmail</li>
            <li>The review process will be completely anonymous</li>
            <li>You'll receive updates through your anonymous communication channel</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
} 