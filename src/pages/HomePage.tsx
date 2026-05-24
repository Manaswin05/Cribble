/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { ArrowRight, Eye, Rocket } from 'lucide-react';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import type { PageProps } from '../types';

const featuredWorks = [
  { id: 1, title: 'Ethereal Flow', author: 'Marcus Chen', img: 'https://picsum.photos/seed/home1/800/600' },
  { id: 2, title: 'Neon Pulse', author: 'Lila Vance', img: 'https://picsum.photos/seed/home2/800/600' },
  { id: 3, title: 'Botanical Echo', author: 'S. Aris', img: 'https://picsum.photos/seed/home3/800/600' },
];

export const HomePage = ({ isSidebarCollapsed, onToggleSidebar }: PageProps) => {
  return (
    <div className={`pt-24 pb-12 px-6 bg-[#f9f6f5] min-h-screen transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar title="Cribble Home" onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      
      <main>
        <section className="mt-8 mb-16">
          <div className="relative h-[500px] rounded-3xl overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/hero/1920/1080" 
              alt="Featured digital art exhibition showcasing metamorphosis of digital form" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="text-[#65e1ff] font-bold text-xs uppercase tracking-widest mb-4 block">Featured Exhibition</span>
                <h1 className="font-serif text-5xl md:text-7xl text-white mb-6 leading-tight">
                  The <span className="italic text-[#ae8dff]">Metamorphosis</span> <br/>of Digital Form
                </h1>
                <p className="text-white/70 max-w-xl mb-8 text-lg">Explore the latest curated collection from our global community of avant-garde digital artists.</p>
                <button className="bg-white text-[#2f2e2e] px-8 py-4 rounded-xl font-bold flex items-center gap-x-3 hover:bg-[#65e1ff] transition-all">
                  Explore Collection <ArrowRight size={18} />
                </button>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="font-serif text-3xl text-[#2f2e2e]">Curated for You</h2>
              <p className="text-[#5c5b5b] text-sm">Hand-picked works based on your creative interests.</p>
            </div>
            <button className="text-[#6a37d4] font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredWorks.map((work) => (
              <motion.div 
                key={work.id}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all">
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="bg-white/90 backdrop-blur p-3 rounded-full text-[#6a37d4] shadow-lg" aria-label={`View ${work.title}`}>
                      <Eye size={20} />
                    </button>
                  </div>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2f2e2e]">{work.title}</h3>
                <p className="text-[#5c5b5b] text-sm">by {work.author}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-[#6a37d4] rounded-3xl p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <h2 className="font-serif text-4xl mb-4">Start Your Creative Journey</h2>
            <p className="text-white/70 mb-8">Join thousands of artists and designers in Cribble Studio. Create, curate, and collaborate in a space designed for the modern creator.</p>
            <div className="flex gap-4">
              <button className="bg-white text-[#6a37d4] px-8 py-4 rounded-xl font-bold hover:bg-[#65e1ff] transition-all">
                Launch Studio
              </button>
              <button className="border border-white/30 px-8 py-4 rounded-xl font-bold hover:bg-white/10 transition-all">
                Learn More
              </button>
            </div>
          </div>
          <div className="relative w-full md:w-1/3 aspect-square" aria-hidden="true">
            <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <Rocket size={120} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#65e1ff]" />
          </div>
        </section>
      </main>
    </div>
  );
};
