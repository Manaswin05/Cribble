/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Bookmark, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import type { PageProps } from '../types';

const savedItems = [
  { id: 1, title: 'Abstract Flow', type: 'Digital Art', img: 'https://picsum.photos/seed/saved1/400/400' },
  { id: 2, title: 'Minimal UI Kit', type: 'UI/UX Design', img: 'https://picsum.photos/seed/saved2/400/400' },
  { id: 3, title: 'Cyberpunk City', type: 'Illustration', img: 'https://picsum.photos/seed/saved3/400/400' },
  { id: 4, title: 'Organic Forms', type: '3D Motion', img: 'https://picsum.photos/seed/saved4/400/400' },
];

export const SavedPage = ({ isSidebarCollapsed, onToggleSidebar }: PageProps) => {
  return (
    <div className={`pt-24 pb-12 px-6 bg-[#f9f6f5] min-h-screen transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar title="Saved Collections" onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />

      <main>
        <div className="mt-8 mb-12">
          <h1 className="font-serif text-4xl text-[#2f2e2e] mb-2">Your Library</h1>
          <p className="text-[#5c5b5b]">A curated collection of works you've saved for inspiration.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {savedItems.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group"
            >
              <div className="aspect-square relative">
                <img src={item.img} alt={item.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <button
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-[#6a37d4] opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove ${item.title} from saved`}
                >
                  <Bookmark size={16} fill="currentColor" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-sm text-[#2f2e2e] truncate">{item.title}</h3>
                <p className="text-[10px] text-[#5c5b5b] font-bold uppercase tracking-widest">{item.type}</p>
              </div>
            </motion.div>
          ))}
          <button className="aspect-square border-2 border-dashed border-[#dfdcdc] rounded-2xl flex flex-col items-center justify-center gap-2 text-[#5c5b5b] hover:border-[#6a37d4] hover:text-[#6a37d4] transition-all">
            <Plus size={24} />
            <span className="text-xs font-bold">New Collection</span>
          </button>
        </div>
      </main>
    </div>
  );
};
