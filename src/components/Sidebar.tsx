/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import {
  Home,
  Compass,
  Bookmark,
  Brush,
  MessageSquare,
  Menu,
} from 'lucide-react';
import type { Tab } from '../types';

interface SidebarProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const navItems: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'saved', label: 'Saved', icon: Bookmark },
  { id: 'studio', label: 'Studio', icon: Brush },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
];

export const Sidebar = ({ activeTab, setActiveTab, isCollapsed, onToggle }: SidebarProps) => {
  return (
    <>
      <aside
        className={`h-screen fixed left-0 top-0 overflow-y-auto bg-[#f3f0ef] flex-col p-6 gap-y-4 z-50 border-r border-[#afacac]/10 transition-all duration-300 hidden md:flex ${
          isCollapsed ? 'w-0 p-0 border-r-0 opacity-0 pointer-events-none' : 'w-64'
        }`}
      >
        <div className="mb-8 px-2 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-[#2f2e2e]">Cribble</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#5c5b5b] font-bold">
              Creative Design Studio
            </p>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-[#eae7e7] rounded-lg transition-colors mt-0.5"
            title="Hide Sidebar"
            aria-label="Hide sidebar"
          >
            <Menu size={18} className="text-[#5c5b5b]" />
          </button>
        </div>
        <nav className="flex flex-col gap-y-2" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-x-3 px-4 py-3 rounded-lg transition-all active:translate-x-1 duration-150 font-sans text-sm font-medium ${
                activeTab === item.id
                  ? 'bg-white text-[#6a37d4] shadow-sm'
                  : 'text-[#5c5b5b] hover:bg-[#eae7e7]'
              }`}
              aria-current={activeTab === item.id ? 'page' : undefined}
            >
              <item.icon size={18} fill={activeTab === item.id ? 'currentColor' : 'none'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-[#afacac]/10">
          <div className="flex items-center gap-x-3 px-2">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://picsum.photos/seed/artist/100/100"
              alt="Elena Rossi"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="text-sm font-bold text-[#2f2e2e]">Elena Rossi</p>
              <p className="text-xs text-[#5c5b5b]">Pro Artist</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
