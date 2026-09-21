/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React from 'react';
import { Home, Compass, Bookmark, Brush, MessageSquare, Search, Bell } from 'lucide-react';
import { Tab } from '../types';

export const Header = ({ activeTab, setActiveTab }: { activeTab: Tab, setActiveTab: (tab: Tab) => void }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'studio', label: 'Studio', icon: Brush },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-16 z-50 bg-[#f9f6f5]/90 backdrop-blur-xl flex justify-between items-center px-6 border-b border-[#afacac]/10">
      <div className="flex items-center gap-x-8">
        <div className="flex items-center gap-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] rounded-lg flex items-center justify-center text-white">
            <Brush size={16} />
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold text-[#2f2e2e] leading-tight">Cribble</h1>
            <p className="text-[9px] uppercase tracking-widest text-[#5c5b5b] font-bold">Studio</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-x-1" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`flex items-center gap-x-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${
                activeTab === item.id 
                  ? 'bg-white text-[#6a37d4] shadow-sm' 
                  : 'text-[#5c5b5b] hover:bg-[#eae7e7]'
              }`}
            >
              <item.icon size={16} fill={activeTab === item.id ? "currentColor" : "none"} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-x-4">
        <div className="hidden sm:flex items-center bg-[#f3f0ef] px-3 py-1.5 rounded-full w-64">
          <Search size={14} className="text-[#787676]" />
          <input 
            className="bg-transparent border-none focus:ring-0 text-xs w-full ml-2 placeholder:text-[#787676]/60" 
            placeholder="Search curated works..." 
            type="text" 
          />
        </div>
        <button className="text-[#787676] hover:bg-[#eae7e7] p-2 rounded-full transition-colors" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <button className="bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white px-4 py-1.5 rounded-lg font-bold text-xs shadow-sm active:scale-95 transition-transform">
          Create
        </button>
        <img 
          className="w-8 h-8 rounded-full object-cover border-2 border-[#ae8dff]" 
          src="https://picsum.photos/seed/user/100/100" 
          alt="User Avatar" 
          referrerPolicy="no-referrer"
        />
      </div>
    </header>
  );
};
