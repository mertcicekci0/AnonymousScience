'use client';

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export function Header() {
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#e0e7ff] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center py-2">
            <a href="/" className="flex items-center group">
              <img 
                src="/logo.png" 
                alt="AnonymousScience Logo" 
                className="h-40 w-auto drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:brightness-110 animate-header-bounce bg-logo-hover"
                style={{ filter: 'drop-shadow(0 0 24px #a78bfa88)' }}
              />
            </a>
          </div>
          <div className="flex items-center space-x-4">
            {!isConnected ? (
              <button
                type="button"
                onClick={openConnectModal}
                className="px-6 py-2 bg-gradient-to-r from-[#6366f1] to-[#60a5fa] text-white rounded-xl text-lg font-bold shadow-lg hover:from-[#60a5fa] hover:to-[#6366f1] transition-all focus:outline-none focus:ring-4 focus:ring-[#a5b4fc]"
              >
                Connect Wallet
              </button>
            ) : (
              <ConnectButton label="Connect Wallet" chainStatus="none" showBalance={false} accountStatus="address" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 