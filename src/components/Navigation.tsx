/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Menu, X, Send, HelpCircle, Users, Activity, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveTab } from '../types';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // « Accueil » n'est volontairement PAS dans le menu : le logo (en-tête collant,
  // présent sur toutes les vues) est l'affordance de retour à l'accueil.
  const navItems = [
    { id: 'about' as ActiveTab, label: 'À Propos', icon: Users },
    { id: 'services' as ActiveTab, label: 'Pôles de Services', icon: Activity },
    { id: 'methodology' as ActiveTab, label: 'Méthodologie', icon: HelpCircle },
  ];

  const handleNavClick = (tabId: ActiveTab) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-brand-navy/10 shadow-xs" id="main-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo Brand Area */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-shrink-0 flex items-center cursor-pointer" 
            onClick={() => handleNavClick('home')} 
            id="nav-logo-container"
          >
            <div className="relative flex items-center gap-3">
              {/* Modern geometric square logo matching the theme */}
              <div className="h-10 w-10 bg-brand-cyan flex items-center justify-center relative overflow-hidden group rounded-xl shadow-xs">
                <svg className="h-6 w-6 relative z-10 text-brand-navy transition-transform duration-500 ease-out group-hover:rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="20" x2="20" y2="4" />
                  <polyline points="14 4 20 4 20 10" />
                  <line x1="4" y1="4" x2="10" y2="10" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-display font-extrabold text-base tracking-tight text-brand-navy leading-none">
                  AXIS RESULT
                </span>
                <span className="font-sans font-bold text-[9px] tracking-[0.2em] text-brand-cyan-text leading-none mt-1">
                  CONSULTING
                </span>
              </div>
            </div>
          </motion.div>

          {/* Desktop Navigation Items */}
          <div className="hidden md:flex items-center space-x-6" id="desktop-menu-items">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <motion.button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative py-2 px-1 text-xs font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                    isActive ? 'text-brand-cyan-text font-black' : 'text-brand-navy/70 hover:text-brand-cyan-text'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-cyan rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* CTA principal : prise de contact */}
          <div className="hidden md:flex items-center" id="nav-contact-button-container">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              id="nav-btn-contact"
              onClick={() => handleNavClick('contact')}
              className={`px-4 py-2 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 cursor-pointer border ${
                activeTab === 'contact'
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md shadow-brand-navy/10'
                  : 'bg-brand-cyan text-brand-navy border-brand-cyan hover:bg-brand-navy hover:text-white hover:border-brand-navy shadow-sm'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              Prendre contact
              <ChevronRight className="h-3 w-3" />
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden" id="mobile-menu-btn-container">
            <motion.button
              whileTap={{ scale: 0.9 }}
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-brand-navy hover:text-brand-cyan-text focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 rounded-lg transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slidedown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-brand-gray/30 animate-fadeIn" id="mobile-menu-dropdown">
          <div className="px-4 pt-2 pb-4 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-item-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center justify-between cursor-pointer border-b border-brand-gray/10 ${
                    isActive
                      ? 'text-brand-cyan-text font-extrabold pl-1 border-l-2 border-brand-cyan'
                      : 'text-brand-navy/70 hover:text-brand-cyan-text'
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight className="h-3 w-3 opacity-50" />
                </button>
              );
            })}
            <div className="pt-4 pb-2">
              <button
                id="mobile-nav-item-contact"
                onClick={() => handleNavClick('contact')}
                className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer border ${
                  activeTab === 'contact'
                    ? 'bg-brand-navy text-white border-brand-navy'
                    : 'bg-brand-cyan text-brand-navy border-brand-cyan hover:bg-brand-navy hover:text-white'
                }`}
              >
                <Send className="h-4 w-4" />
                Prendre contact
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
