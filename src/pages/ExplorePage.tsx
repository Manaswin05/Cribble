/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { Heart, Share2, Eye, MessageSquare, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import type { PageProps } from '../types';

const categories = ['All Media', 'Digital Art', 'UI/UX Design', 'Illustration', '3D Motion'];

const artworks = [
  { id: 1, tall: true, author: 'Marcus Chen', views: '12.4k', comments: '84', img: 'https://picsum.photos/seed/ui1/600/900' },
  { id: 2, tall: false, author: 'Lila Vance', views: '8.2k', comments: '32', img: 'https://picsum.photos/seed/abstract1/600/600' },
  { id: 3, tall: false, short: true, author: 'S. Aris', views: '15k', comments: '102', img: 'https://picsum.photos/seed/botanical/600/400' },
  { id: 4, tall: true, author: 'Pixel Ghost', views: '21.9k', comments: '245', img: 'https://picsum.photos/seed/3d1/600/900' },
  { id: 5, tall: false, author: 'Studio Noir', views: '6.1k', comments: '18', img: 'https://picsum.photos/seed/web1/600/600' },
  { id: 6, tall: false, short: true, author: 'Julian V.', views: '9.7k', comments: '55', img: 'https://picsum.photos/seed/fashion1/600/400' },
];

export const ExplorePage = ({ isSidebarCollapsed, onToggleSidebar }: PageProps) => {
  return (
    <div className={`pt-24 pb-12 px-6 bg-[#f9f6f5] min-h-screen transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />

      <main>
        <section className="mb-12 mt-8">
          <span className="text-[#6a37d4] font-bold text-[10px] uppercase tracking-widest mb-2 block">Curated Selection</span>
          <h1 className="font-serif text-5xl md:text-6xl text-[#2f2e2e] mb-4 leading-tight">
            Explore the <br/><span className="italic text-[#5e26c7]">Avant-Garde</span>
          </h1>
          <div className="flex items-center gap-x-4 overflow-x-auto pb-4 scrollbar-hide" role="tablist" aria-label="Art categories">
            {categories.map((cat, i) => (
              <button 
                key={cat} 
                role="tab"
                aria-selected={i === 0}
                className={`px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                  i === 0 ? 'bg-[#65e1ff] text-[#004f5d]' : 'bg-[#e5e2e1] text-[#2f2e2e] hover:bg-[#dfdcdc]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {artworks.map((art) => (
            <motion.div 
              key={art.id}
              whileHover={{ y: -4 }}
              className="relative group overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-2xl transition-all duration-300 break-inside-avoid"
            >
              <img 
                src={art.img} 
                alt={`Artwork by ${art.author}`} 
                className="w-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#f9f6f5]/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-end gap-x-2">
                  <button className="p-2 bg-white rounded-full shadow-sm text-[#6a37d4] hover:bg-[#ae8dff] transition-colors" aria-label="Like artwork">
                    <Heart size={18} />
                  </button>
                  <button className="p-2 bg-white rounded-full shadow-sm text-[#5c5b5b] hover:bg-[#eae7e7] transition-colors" aria-label="Share artwork">
                    <Share2 size={18} />
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-x-2 mb-4">
                    <img className="w-8 h-8 rounded-full object-cover" src={`https://picsum.photos/seed/author${art.id}/50/50`} alt={art.author} referrerPolicy="no-referrer" />
                    <span className="text-sm font-bold text-[#2f2e2e]">{art.author}</span>
                    <button className="text-xs text-[#6a37d4] font-bold ml-auto underline">Follow</button>
                  </div>
                  <div className="flex items-center gap-x-4 text-xs font-semibold text-[#5c5b5b]">
                    <span className="flex items-center gap-1"><Eye size={14} /> {art.views}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={14} /> {art.comments}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <section className="mt-24 bg-[#f3f0ef] rounded-3xl p-12 flex flex-col md:flex-row items-center gap-16">
          <div className="w-full md:w-1/2">
            <motion.img 
              initial={{ rotate: 2 }}
              whileHover={{ rotate: 0 }}
              className="rounded-2xl shadow-2xl transition-transform duration-500" 
              src="https://picsum.photos/seed/gallery/800/600" 
              alt="Featured artwork by Sofia Van der Berg" 
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="w-full md:w-1/2">
            <span className="text-[#5e26c7] font-bold text-[10px] uppercase tracking-widest mb-4 block">Artist of the Month</span>
            <h2 className="font-serif text-4xl text-[#2f2e2e] mb-6">Mastering the Digital Canvas with <span className="italic">Sofia Van der Berg</span></h2>
            <p className="text-[#5c5b5b] leading-relaxed mb-8">Sofia's work redefines the boundary between traditional oil painting and high-fidelity digital rendering. Explore her exclusive series now available for curated study.</p>
            <button className="bg-[#6a37d4] text-white px-8 py-4 rounded-xl font-bold flex items-center gap-x-3 hover:shadow-lg hover:shadow-[#6a37d4]/20 transition-all">
              View Collection <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
