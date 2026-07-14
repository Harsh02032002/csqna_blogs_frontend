import { Link } from 'react-router-dom';
import { Shield, Twitter, Facebook, Linkedin, Rss } from 'lucide-react';

export default function Footer({ categories = [] }) {
  return (
    <footer className="bg-[#1a1d2e] text-white mt-12">
      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="border-t border-white/10 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} csqna.com. All rights reserved.</p>
          <p className="text-gray-500 text-xs">Built with ❤️ for the security community</p>
        </div>
      </div>
    </footer>
  );
}
