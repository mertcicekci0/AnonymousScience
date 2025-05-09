"use client";

import { MainLayout } from '@/components/layout/MainLayout';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const NoirVerification = dynamic(() => import('@/components/NoirVerification'));

const logos = [
  // Logo2: Sol üst, büyük, dikkat çekici
  {
    src: '/logo2.png',
    size: 700,
    opacity: 0.22,
    rotate: '-rotate-12',
    delay: '0s',
    anim: 'animate-float-slow',
    style: {
      left: '-8%',
      top: '-6%',
      transform: 'scale(1.18)',
    },
  },
  // Logo3: Sağ alt, büyük, dikkat çekici
  {
    src: '/logo3.png',
    size: 700,
    opacity: 0.22,
    rotate: 'rotate-12',
    delay: '1s',
    anim: 'animate-float-medium',
    style: {
      right: '-8%',
      bottom: '-10%',
      transform: 'scale(1.18)',
    },
  },
];

export default function Home() {
  return (
    <MainLayout>
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center">
        {/* Background Images */}
        <div className="fixed inset-0 w-full h-full pointer-events-none select-none" style={{ zIndex: 1 }}>
          {logos.map((logo, i) => (
            <img
              key={logo.src}
              src={logo.src}
              alt={`Decorative ${i + 1}`}
              className={`absolute ${logo.anim} bg-logo-hover pointer-events-auto`}
              style={{
                width: logo.size,
                height: logo.size,
                opacity: logo.opacity,
                pointerEvents: 'auto',
                userSelect: 'none',
                zIndex: i + 1,
                ...logo.style,
              }}
            />
          ))}
        </div>

        {/* Blurred Background */}
        <div className="fixed inset-0" style={{ zIndex: 0 }}>
          <img
            src="/bg-blur.jpg"
            alt="Background"
            className="w-full h-full object-cover blur-md opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#e0e7ff] via-[#f8fafc] to-[#a5b4fc] opacity-90" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="text-center max-w-4xl mx-auto px-4">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#6366f1] via-[#60a5fa] to-[#a78bfa] bg-clip-text text-transparent drop-shadow-lg">
              AnonymousScience
            </h1>
            <p className="text-2xl text-[#334155] mb-8 font-light drop-shadow">
              Revolutionizing scientific peer review with zero-knowledge proofs
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/submit"
                className="px-8 py-3 bg-gradient-to-r from-[#6366f1] to-[#60a5fa] text-white rounded-full hover:from-[#60a5fa] hover:to-[#6366f1] transition-colors text-lg shadow-lg font-semibold"
              >
                Submit Paper
              </Link>
            </div>
          </div>

          {/* Noir Verification Section */}
          <div className="mt-16 max-w-2xl mx-auto px-4">
            <NoirVerification onVerificationComplete={(success) => {
              console.log('Verification complete:', success);
            }} />
          </div>

          {/* Features Section */}
          <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <FeatureCard
              title="Zero-Knowledge Proofs"
              description="Verify credentials without revealing identity."
              icon="🔒"
            />
            <FeatureCard
              title="Double-Blind Review"
              description="Complete anonymity for both authors and reviewers."
              icon="👥"
            />
            <FeatureCard
              title="Expert Verification"
              description="Prove expertise without compromising privacy."
              icon="🎓"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

function FeatureCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="relative p-8 bg-white/95 rounded-2xl border border-[#e0e7ff] hover:border-[#6366f1] transition-colors shadow-2xl backdrop-blur-sm">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-[#312e81]">{title}</h3>
      <p className="text-[#334155]">{description}</p>
    </div>
  );
}

// Tailwind CSS Animations (add to your global CSS or tailwind.config.js)
// .animate-float-slow { animation: float 10s ease-in-out infinite alternate; }
// .animate-float-medium { animation: float 7s ease-in-out infinite alternate; }
// .animate-float-fast { animation: float 5s ease-in-out infinite alternate; }
// @keyframes float { 0% { transform: translateY(0); } 100% { transform: translateY(-40px); } }
