import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-dark-secondary border-b border-gold/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gold font-serif">Misfit Ministries</h1>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-text hover:text-gold transition">Home</Link>
            <Link to="/prayer" className="text-text hover:text-gold transition">Prayer</Link>
            <Link to="/testimonies" className="text-text hover:text-gold transition">Testimonies</Link>
            <Link to="/wreckage" className="text-text hover:text-gold transition">Resources</Link>
            <Link to="/armory" className="text-text hover:text-gold transition">Armory</Link>
            <Link to="/store" className="text-text hover:text-gold transition">Store</Link>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:988"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              <span className="text-lg">☎️</span>
              <span className="hidden sm:inline">988 Crisis</span>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
