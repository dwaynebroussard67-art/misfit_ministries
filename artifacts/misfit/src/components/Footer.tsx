import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-dark-secondary border-t border-gold/20 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-gold font-serif text-lg font-bold mb-4">Misfit Ministries</h3>
            <p className="text-text-secondary text-sm">Serving people in crisis with compassion and grace.</p>
          </div>
          
          <div>
            <h4 className="text-gold font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-text-secondary hover:text-gold transition">Home</Link></li>
              <li><Link to="/prayer" className="text-text-secondary hover:text-gold transition">Prayer Wall</Link></li>
              <li><Link to="/testimonies" className="text-text-secondary hover:text-gold transition">Testimonies</Link></li>
              <li><Link to="/about" className="text-text-secondary hover:text-gold transition">About</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gold font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/wreckage" className="text-text-secondary hover:text-gold transition">Crisis Resources</Link></li>
              <li><Link to="/armory" className="text-text-secondary hover:text-gold transition">The Armory</Link></li>
              <li><Link to="/constitution" className="text-text-secondary hover:text-gold transition">Constitution</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-gold font-semibold mb-4">Emergency</h4>
            <p className="text-text-secondary text-sm mb-4">In crisis? Call or text:</p>
            <a href="tel:988" className="text-gold font-bold text-lg hover:underline">988</a>
            <p className="text-text-secondary text-xs mt-2">Suicide & Crisis Lifeline</p>
          </div>
        </div>
        
        <div className="border-t border-gold/20 pt-8">
          <p className="text-center text-text-secondary text-sm">
            © 2026 Misfit Ministries. All rights reserved. | 
            <Link to="/constitution" className="ml-2 text-gold hover:underline">Community Standards</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
