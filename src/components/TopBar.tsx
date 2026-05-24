/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Search, Bell, Menu } from 'lucide-react';

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const TopBar = ({
  title,
  showSearch = true,
  onToggleSidebar,
  isSidebarCollapsed,
}: TopBarProps) => {
  return (
    <header
      className={`fixed top-0 right-0 left-0 h-20 z-40 bg-[#f9f6f5]/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-[#afacac]/10 transition-all duration-300 ${
        isSidebarCollapsed ? 'md:left-0' : 'md:left-64'
      }`}
    >
      <div className="flex items-center gap-x-4">
        {isSidebarCollapsed && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="p-2 hover:bg-[#eae7e7] rounded-lg transition-colors"
            title="Show Sidebar"
            aria-label="Show sidebar"
          >
            <Menu size={20} className="text-[#5c5b5b]" />
          </button>
        )}
        {title && (
          <h2 className="font-serif text-lg font-bold tracking-tight text-[#6a37d4]">
            {title}
          </h2>
        )}
        {showSearch && (
          <div className="hidden sm:flex items-center bg-[#f3f0ef] px-4 py-2 rounded-full w-96 ml-4">
            <Search size={16} className="text-[#787676]" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 placeholder:text-[#787676]/60"
              placeholder="Search curated works..."
              type="text"
              aria-label="Search curated works"
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-6">
        <div className="flex items-center gap-x-4">
          <button
            className="text-[#787676] hover:bg-[#eae7e7] p-2 rounded-full transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>
          <button className="bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white px-6 py-2 rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-transform">
            Create
          </button>
        </div>
        <img
          className="w-9 h-9 rounded-full object-cover border-2 border-[#ae8dff]"
          src="https://picsum.photos/seed/user/100/100"
          alt="User Avatar"
          referrerPolicy="no-referrer"
        />
      </div>
    </header>
  );
};
