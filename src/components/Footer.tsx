import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Category } from '../types';

interface FooterProps {
  categories?: Category[];
}

const Footer: React.FC<FooterProps> = ({ categories = [] }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md">
                <ShieldAlert className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-sans font-bold text-lg text-white">CSQNA</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              Your trusted partner in cybersecurity auditing, news, compliance frameworks, and professional examination preparation.
            </p>
            <div className="flex space-x-4 text-slate-500 pt-2">
              <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={18} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Github size={18} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin size={18} /></a>
              <a href="#" className="hover:text-blue-500 transition-colors"><Mail size={18} /></a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-slate-200 font-semibold text-sm tracking-wider uppercase mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat._id}>
                  <Link
                    to={`/category/${cat.slug}`}
                    className="text-slate-400 hover:text-white text-sm transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-slate-200 font-semibold text-sm tracking-wider uppercase mb-4">Portals</h3>
            <ul className="space-y-2">
              <li>
                <a href="http://localhost:3001" className="text-slate-400 hover:text-white text-sm transition-colors">
                  CISA Guide
                </a>
              </li>
              <li>
                <a href="http://localhost:3002" className="text-slate-400 hover:text-white text-sm transition-colors">
                  CISSP Guide
                </a>
              </li>
              <li>
                <a href="http://localhost:3003" className="text-slate-400 hover:text-white text-sm transition-colors">
                  CEH Guide
                </a>
              </li>
              <li>
                <a href="http://localhost:3004" className="text-slate-400 hover:text-white text-sm transition-colors">
                  DPDP Portal
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Global Affiliation Disclaimer */}
        <div className="border-t border-slate-900 mt-10 pt-6">
          <div className="bg-slate-900/50 rounded-lg border border-slate-800 p-4 mb-6">
            <p className="text-slate-500 text-xs text-center leading-relaxed">
              <strong>Disclaimer:</strong> CSQNA is an independent education portal. All certification names, registered trademarks, and logos are property of their respective owners. CISA &amp; AAIA are registered trademarks of ISACA. CISSP is a registered trademark of ISC². CEH is a registered trademark of EC-Council. CIPP is a registered trademark of IAPP. CSQNA is not affiliated with or endorsed by any of these organizations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-slate-500 text-xs">
            <p>© {new Date().getFullYear()} CSQNA. All rights reserved.</p>
            <p>Made with security &amp; integrity for the global community.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
