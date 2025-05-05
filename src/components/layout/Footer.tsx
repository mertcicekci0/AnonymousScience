'use client';

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#e0e7ff] border-t-0 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-[#312e81] text-sm font-semibold drop-shadow">
            © 2025 AnonymousScience. All rights reserved.
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="/privacy" className="text-[#312e81] hover:text-[#6366f1] text-sm font-medium transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-[#312e81] hover:text-[#6366f1] text-sm font-medium transition-colors">
              Terms of Service
            </a>
            <a href="/contact" className="text-[#312e81] hover:text-[#6366f1] text-sm font-medium transition-colors">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 