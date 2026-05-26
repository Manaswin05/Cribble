/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useCallback } from 'react';
import { 
  Home, 
  Compass, 
  Bookmark, 
  Brush, 
  MessageSquare, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical, 
  Video, 
  Phone, 
  Send, 
  Paperclip, 
  Smile, 
  Upload, 
  Calendar, 
  Rocket, 
  Layers, 
  FileText, 
  MousePointer2, 
  Square, 
  Circle, 
  Type, 
  Pencil, 
  Image as ImageIcon, 
  Minus, 
  Maximize, 
  Eye, 
  Palette, 
  ArrowRight, 
  Heart, 
  Share2,
  ChevronDown,
  User,
  Sparkles,
  Loader2,
  X,
  Menu,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateArtConcept, getAIAssistantResponse, parseStudioCommand, type StudioCommand } from './services/geminiService';
import { generateColorTheme, type ColorPalette } from './services/colorThemeService';
import { ColorThemePanel } from './components/ColorThemePanel';

// --- Shared Types ---

interface CanvasElement {
  id: number;
  type: 'square' | 'circle' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'ai';
  time: string;
}

interface ContextMenuState {
  x: number;
  y: number;
  element?: CanvasElement;
}

// --- Types ---

type Tab = 'home' | 'explore' | 'saved' | 'studio' | 'messages';

// --- Error Boundary ---

interface EBProps { children: React.ReactNode }
interface EBState { hasError: boolean; error?: Error }

class ErrorBoundary extends React.Component<EBProps, EBState> {
  state: EBState = { hasError: false };

  static getDerivedStateFromError(error: Error): EBState {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f9f6f5] p-8">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2f2e2e] mb-2">Something went wrong</h3>
            <p className="text-sm text-[#5c5b5b] mb-6">An unexpected error occurred. Please try refreshing.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
              className="inline-flex items-center gap-2 bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <RefreshCw size={16} /> Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- Components ---

const Sidebar = ({ activeTab, setActiveTab, isCollapsed, onToggle }: { activeTab: Tab, setActiveTab: (tab: Tab) => void, isCollapsed: boolean, onToggle: () => void }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'studio', label: 'Studio', icon: Brush },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <>
      <aside className={`h-screen fixed left-0 top-0 overflow-y-auto bg-[#f3f0ef] flex-col p-6 gap-y-4 z-50 border-r border-[#afacac]/10 transition-all duration-300 hidden md:flex ${isCollapsed ? 'w-0 p-0 border-r-0 opacity-0 pointer-events-none' : 'w-64'}`}>
        <div className="mb-8 px-2 flex items-start justify-between">
          <div>
            <h1 className="font-serif text-xl font-bold text-[#2f2e2e]">Cribble</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#5c5b5b] font-bold">Creative Design Studio</p>
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
            onClick={() => setActiveTab(item.id as Tab)}
            className={`flex items-center gap-x-3 px-4 py-3 rounded-lg transition-all active:translate-x-1 duration-150 font-sans text-sm font-medium ${
              activeTab === item.id 
                ? 'bg-white text-[#6a37d4] shadow-sm' 
                : 'text-[#5c5b5b] hover:bg-[#eae7e7]'
            }`}
          >
            <item.icon size={18} fill={activeTab === item.id ? "currentColor" : "none"} />
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

const TopBar = ({ title, showSearch = true, onToggleSidebar, isSidebarCollapsed }: { title?: string, showSearch?: boolean, onToggleSidebar?: () => void, isSidebarCollapsed?: boolean }) => {
  return (
    <header className={`fixed top-0 right-0 left-0 h-20 z-40 bg-[#f9f6f5]/80 backdrop-blur-xl flex justify-between items-center px-8 border-b border-[#afacac]/10 transition-all duration-300 ${isSidebarCollapsed ? 'md:left-0' : 'md:left-64'}`}>
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
        {title && <h2 className="font-serif text-lg font-bold tracking-tight text-[#6a37d4]">{title}</h2>}
        {showSearch && (
          <div className="hidden sm:flex items-center bg-[#f3f0ef] px-4 py-2 rounded-full w-96 ml-4">
            <Search size={16} className="text-[#787676]" />
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 placeholder:text-[#787676]/60" 
              placeholder="Search curated works..." 
              type="text" 
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-6">
        <div className="flex items-center gap-x-4">
          <button className="text-[#787676] hover:bg-[#eae7e7] p-2 rounded-full transition-colors" aria-label="Notifications">
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

// --- Pages ---

const ShortcutItem = ({ keys, action }: { keys: string; action: string }) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-[#2f2e2e]">{action}</span>
    <kbd className="px-2 py-1 bg-[#f3f0ef] rounded text-xs font-mono text-[#5c5b5b] border border-[#dfdcdc]">
      {keys}
    </kbd>
  </div>
);

const HomePage = ({ isSidebarCollapsed, onToggleSidebar }: { isSidebarCollapsed?: boolean, onToggleSidebar?: () => void }) => {
  const featuredWorks = [
    { id: 1, title: 'Ethereal Flow', author: 'Marcus Chen', img: 'https://picsum.photos/seed/home1/800/600' },
    { id: 2, title: 'Neon Pulse', author: 'Lila Vance', img: 'https://picsum.photos/seed/home2/800/600' },
    { id: 3, title: 'Botanical Echo', author: 'S. Aris', img: 'https://picsum.photos/seed/home3/800/600' },
  ];

  return (
    <div className={`pt-24 pb-12 px-6 bg-[#f9f6f5] min-h-screen transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar title="Cribble Home" onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      
      <section className="mt-8 mb-16">
        <div className="relative h-[500px] rounded-3xl overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/hero/1920/1080" 
            alt="Hero" 
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
                  <button className="bg-white/90 backdrop-blur p-3 rounded-full text-[#6a37d4] shadow-lg">
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
        <div className="relative w-full md:w-1/3 aspect-square">
          <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <Rocket size={120} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#65e1ff]" />
        </div>
      </section>
    </div>
  );
};

const SavedPage = ({ isSidebarCollapsed, onToggleSidebar }: { isSidebarCollapsed?: boolean, onToggleSidebar?: () => void }) => {
  const savedItems = [
    { id: 1, title: 'Abstract Flow', type: 'Digital Art', img: 'https://picsum.photos/seed/saved1/400/400' },
    { id: 2, title: 'Minimal UI Kit', type: 'UI/UX Design', img: 'https://picsum.photos/seed/saved2/400/400' },
    { id: 3, title: 'Cyberpunk City', type: 'Illustration', img: 'https://picsum.photos/seed/saved3/400/400' },
    { id: 4, title: 'Organic Forms', type: '3D Motion', img: 'https://picsum.photos/seed/saved4/400/400' },
  ];
//saved
  return (
    <div className={`pt-24 pb-12 px-6 bg-[#f9f6f5] min-h-screen transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar title="Saved Collections" onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
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
              <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-[#6a37d4] opacity-0 group-hover:opacity-100 transition-opacity">
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
    </div>
  );
};

const ExplorePage = ({ isSidebarCollapsed, onToggleSidebar }: { isSidebarCollapsed?: boolean, onToggleSidebar?: () => void }) => {
  const categories = ['All Media', 'Digital Art', 'UI/UX Design', 'Illustration', '3D Motion'];
  const artworks = [
    { id: 1, tall: true, author: 'Marcus Chen', views: '12.4k', comments: '84', img: 'https://picsum.photos/seed/ui1/600/900' },
    { id: 2, tall: false, author: 'Lila Vance', views: '8.2k', comments: '32', img: 'https://picsum.photos/seed/abstract1/600/600' },
    { id: 3, tall: false, short: true, author: 'S. Aris', views: '15k', comments: '102', img: 'https://picsum.photos/seed/botanical/600/400' },
    { id: 4, tall: true, author: 'Pixel Ghost', views: '21.9k', comments: '245', img: 'https://picsum.photos/seed/3d1/600/900' },
    { id: 5, tall: false, author: 'Studio Noir', views: '6.1k', comments: '18', img: 'https://picsum.photos/seed/web1/600/600' },
    { id: 6, tall: false, short: true, author: 'Julian V.', views: '9.7k', comments: '55', img: 'https://picsum.photos/seed/fashion1/600/400' },
  ];

  return (
    <div className={`pt-24 pb-12 px-6 bg-[#f9f6f5] min-h-screen transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      <section className="mb-12 mt-8">
        <span className="text-[#6a37d4] font-bold text-[10px] uppercase tracking-widest mb-2 block">Curated Selection</span>
        <h1 className="font-serif text-5xl md:text-6xl text-[#2f2e2e] mb-4 leading-tight">
          Explore the <br/><span className="italic text-[#5e26c7]">Avant-Garde</span>
        </h1>
        <div className="flex items-center gap-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat, i) => (
            <button 
              key={cat} 
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
                <button className="p-2 bg-white rounded-full shadow-sm text-[#6a37d4] hover:bg-[#ae8dff] transition-colors">
                  <Heart size={18} />
                </button>
                <button className="p-2 bg-white rounded-full shadow-sm text-[#5c5b5b] hover:bg-[#eae7e7] transition-colors">
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
            alt="Artist Spotlight" 
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
    </div>
  );
};

const StudioPage = ({ isSidebarCollapsed: globalSidebarCollapsed, onToggleSidebar }: { isSidebarCollapsed?: boolean, onToggleSidebar?: () => void }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConcept, setAiConcept] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<'select' | 'square' | 'circle' | 'text' | 'pencil' | 'image'>('select');
  const [zoom, setZoom] = useState(84);
  const [canvasElements, setCanvasElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<number | null>(null);
  const [headlineText, setHeadlineText] = useState("THE NEW\nMINIMAL");
  const [isEditingText, setIsEditingText] = useState(false);
  const [isPremium, setIsPremium] = useState(true);
  const [price, setPrice] = useState("12.00");
  const [history, setHistory] = useState<CanvasElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [copiedElement, setCopiedElement] = useState<CanvasElement | null>(null);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [canvasWidth, setCanvasWidth] = useState(720);
  const [canvasHeight, setCanvasHeight] = useState(480);
  const [isResizingCanvas, setIsResizingCanvas] = useState(false);
  const [canvasResizeDir, setCanvasResizeDir] = useState<'e' | 's' | 'se' | null>(null);
  const canvasResizeStart = React.useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isWorkspaceCollapsed, setIsWorkspaceCollapsed] = useState(false);
  const [isAIAssistantCollapsed, setIsAIAssistantCollapsed] = useState(false);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 0, text: '👋 Hi! I\'m your Studio AI assistant. Tell me what to do — like "add a blue circle" or "delete selected". Type "help" for all commands!', sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'chat'>('chat');
  const [currentColorPalette, setCurrentColorPalette] = useState<ColorPalette | null>(null);

  const handleGenerateConcept = async () => {
    setIsGenerating(true);
    const concept = await generateArtConcept("A minimalist digital landscape with ethereal lighting");
    setAiConcept(concept);
    setIsGenerating(false);
  };

  // --- Chatbot command executor ---
  const executeCommand = (command: StudioCommand) => {
    switch (command.type) {
      case 'add_element': {
        const newElement = {
          id: Date.now(),
          type: command.elementType,
          x: command.x ?? 50 + Math.random() * 200,
          y: command.y ?? 50 + Math.random() * 150,
          width: command.width ?? (command.elementType === 'text' ? 200 : 100),
          height: command.height ?? (command.elementType === 'text' ? 50 : 100),
          color: command.color || '#6a37d4',
          text: command.text || (command.elementType === 'text' ? 'New Text' : undefined)
        };
        const newElements = [...canvasElements, newElement];
        setCanvasElements(newElements);
        setSelectedElement(newElement.id);
        addToHistory(newElements);
        break;
      }
      case 'delete_selected':
        if (selectedElement) {
          deleteElement(selectedElement);
        }
        break;
      case 'delete_all': {
        setCanvasElements([]);
        setSelectedElement(null);
        addToHistory([]);
        break;
      }
      case 'change_color':
        if (selectedElement) {
          const newElements = canvasElements.map(el =>
            el.id === selectedElement ? { ...el, color: command.color } : el
          );
          setCanvasElements(newElements);
          addToHistory(newElements);
        }
        break;
      case 'zoom_in':
        setZoom(Math.min(zoom + 10, 200));
        break;
      case 'zoom_out':
        setZoom(Math.max(zoom - 10, 25));
        break;
      case 'zoom_reset':
        setZoom(100);
        break;
      case 'undo':
        undo();
        break;
      case 'redo':
        redo();
        break;
      case 'save':
        saveDesign();
        break;
      case 'duplicate':
        if (selectedElement) {
          const element = canvasElements.find(el => el.id === selectedElement);
          if (element) duplicateElement(element);
        }
        break;
      case 'resize':
        if (selectedElement && (command.width || command.height)) {
          const newElements = canvasElements.map(el =>
            el.id === selectedElement ? { ...el, width: command.width ?? el.width, height: command.height ?? el.height } : el
          );
          setCanvasElements(newElements);
          addToHistory(newElements);
        }
        break;
      case 'move':
        if (selectedElement) {
          const newElements = canvasElements.map(el =>
            el.id === selectedElement ? { ...el, x: command.x, y: command.y } : el
          );
          setCanvasElements(newElements);
          addToHistory(newElements);
        }
        break;
      case 'color_theme': {
        // Handle async API call
        generateColorTheme(command.prompt).then(palette => {
          setCurrentColorPalette(palette);
        }).catch(error => {
          console.error('Error generating color theme:', error);
        });
        break;
      }
      case 'unknown':
        // No action needed
        break;
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = {
      id: Date.now(),
      text: chatInput,
      sender: 'user' as const,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, userMsg]);
    const input = chatInput;
    setChatInput('');
    setIsBotTyping(true);

    // Small delay for a natural feel
    setTimeout(() => {
      const { command, response } = parseStudioCommand(input);
      executeCommand(command);
      const botMsg = {
        id: Date.now() + 1,
        text: response,
        sender: 'bot' as const,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 400 + Math.random() * 400);
  };

  // Auto-scroll chat to bottom
  React.useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isBotTyping]);

  const handleZoomIn = () => setZoom(Math.min(zoom + 10, 200));
  const handleZoomOut = () => setZoom(Math.max(zoom - 10, 25));

  const addToHistory = (newElements: CanvasElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const addElement = (type: CanvasElement['type']) => {
    const newElement: CanvasElement = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      width: type === 'text' ? 200 : 100,
      height: type === 'text' ? 50 : 100,
      color: '#6a37d4',
      text: type === 'text' ? 'New Text' : undefined
    };
    const newElements = [...canvasElements, newElement];
    setCanvasElements(newElements);
    setSelectedElement(newElement.id);
    addToHistory(newElements);
  };

  const deleteElement = (id: number) => {
    const newElements = canvasElements.filter(el => el.id !== id);
    setCanvasElements(newElements);
    setSelectedElement(null);
    addToHistory(newElements);
    setContextMenu(null);
  };

  const duplicateElement = (element: CanvasElement) => {
    const newElement = {
      ...element,
      id: Date.now(),
      x: element.x + 20,
      y: element.y + 20
    };
    const newElements = [...canvasElements, newElement];
    setCanvasElements(newElements);
    setSelectedElement(newElement.id);
    addToHistory(newElements);
    setContextMenu(null);
  };

  const copyElement = (element: CanvasElement) => {
    setCopiedElement(element);
    setContextMenu(null);
  };

  const pasteElement = () => {
    if (copiedElement) {
      const newElement = {
        ...copiedElement,
        id: Date.now(),
        x: copiedElement.x + 30,
        y: copiedElement.y + 30
      };
      const newElements = [...canvasElements, newElement];
      setCanvasElements(newElements);
      setSelectedElement(newElement.id);
      addToHistory(newElements);
    }
  };

  const handleResizeStart = (e: React.PointerEvent, handle: string, elementId: number) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setSelectedElement(elementId);
  };

  const handleResizeMove = (e: React.PointerEvent, elementId: number) => {
    if (!isResizing || !resizeHandle) return;
    
    const element = canvasElements.find(el => el.id === elementId);
    if (!element) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let newWidth = element.width;
    let newHeight = element.height;
    let newX = element.x;
    let newY = element.y;

    // Handle different resize directions
    if (resizeHandle.includes('e')) {
      newWidth = Math.max(20, x);
    }
    if (resizeHandle.includes('w')) {
      const deltaX = x;
      newWidth = Math.max(20, element.width - deltaX);
      newX = element.x + deltaX;
    }
    if (resizeHandle.includes('s')) {
      newHeight = Math.max(20, y);
    }
    if (resizeHandle.includes('n')) {
      const deltaY = y;
      newHeight = Math.max(20, element.height - deltaY);
      newY = element.y + deltaY;
    }

    const newElements = canvasElements.map(el =>
      el.id === elementId
        ? { ...el, width: newWidth, height: newHeight, x: newX, y: newY }
        : el
    );
    setCanvasElements(newElements);
  };

  const handleResizeEnd = () => {
    if (isResizing) {
      setIsResizing(false);
      setResizeHandle(null);
      addToHistory(canvasElements);
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCanvasElements(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCanvasElements(history[historyIndex + 1]);
    }
  };

  const saveDesign = () => {
    const design = {
      elements: canvasElements,
      headline: headlineText,
      zoom,
      isPremium,
      price
    };
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cribble-design-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) {
        e.preventDefault();
        redo();
      }
      // Ctrl/Cmd + S - Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveDesign();
      }
      // Ctrl/Cmd + C - Copy
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
        e.preventDefault();
        const element = canvasElements.find(el => el.id === selectedElement);
        if (element) copyElement(element);
      }
      // Ctrl/Cmd + V - Paste
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        pasteElement();
      }
      // Ctrl/Cmd + D - Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
        e.preventDefault();
        const element = canvasElements.find(el => el.id === selectedElement);
        if (element) duplicateElement(element);
      }
      // Delete or Backspace - Delete selected
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !isEditingText) {
        e.preventDefault();
        deleteElement(selectedElement);
      }
      // Escape - Deselect
      if (e.key === 'Escape') {
        setSelectedElement(null);
        setContextMenu(null);
        setShowShortcuts(false);
      }
      // Ctrl/Cmd + Plus - Zoom in
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        handleZoomIn();
      }
      // Ctrl/Cmd + Minus - Zoom out
      if ((e.ctrlKey || e.metaKey) && e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      }
      // Ctrl/Cmd + 0 - Reset zoom
      if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(100);
      }
      // ? - Show shortcuts
      if (e.key === '?' && !isEditingText) {
        e.preventDefault();
        setShowShortcuts(!showShortcuts);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasElements, selectedElement, historyIndex, history, isEditingText, copiedElement]);

  // Close context menu on click outside
  React.useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  return (
    <div className="flex h-screen overflow-hidden">
      <TopBar title="Cribble Studio" showSearch={false} onToggleSidebar={onToggleSidebar} isSidebarCollapsed={globalSidebarCollapsed} />
      
      {/* Quick Actions Bar */}
      <div className={`fixed top-20 h-14 z-40 bg-white/90 backdrop-blur-xl flex items-center justify-between px-8 border-b border-[#afacac]/10 transition-all duration-300 ${
        isLeftSidebarCollapsed
          ? (globalSidebarCollapsed ? 'left-0' : 'left-64')
          : (globalSidebarCollapsed ? 'left-64' : 'left-[512px]')
      } ${isRightSidebarCollapsed ? 'right-0' : 'right-80'}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors text-[#5c5b5b]"
            title={isLeftSidebarCollapsed ? "Show Left Panel" : "Hide Left Panel"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
          </button>
          <button
            onClick={() => setIsRightSidebarCollapsed(!isRightSidebarCollapsed)}
            className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors text-[#5c5b5b]"
            title={isRightSidebarCollapsed ? "Show Right Panel" : "Hide Right Panel"}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
          </button>
          <div className="w-px h-6 bg-[#dfdcdc] mx-2"></div>
          <button
            onClick={undo}
            disabled={historyIndex === 0}
            className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#5c5b5b]"
            title="Undo (Ctrl+Z)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 7v6h6" />
              <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex === history.length - 1}
            className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-[#5c5b5b]"
            title="Redo (Ctrl+Shift+Z)"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 7v6h-6" />
              <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
            </svg>
          </button>
          <div className="w-px h-6 bg-[#dfdcdc] mx-2"></div>
          <button
            onClick={saveDesign}
            className="flex items-center gap-2 px-4 py-2 bg-[#6a37d4] text-white rounded-lg font-bold text-sm hover:bg-[#5e26c7] transition-colors"
            title="Save (Ctrl+S)"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
              <polyline points="17 21 17 13 7 13 7 21" />
              <polyline points="7 3 7 8 15 8" />
            </svg>
            Save
          </button>
        </div>
        <button
          onClick={() => setShowShortcuts(!showShortcuts)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-[#5c5b5b] hover:bg-[#f3f0ef] rounded-lg transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <span className="text-xs font-bold">⌨️</span>
          Shortcuts
        </button>
      </div>
      
      {/* Studio Sidebar */}
      <nav className={`h-screen fixed top-0 overflow-y-auto bg-[#f3f0ef] flex flex-col p-6 gap-y-4 pt-24 z-30 border-r border-[#afacac]/10 transition-all duration-300 ${globalSidebarCollapsed ? 'left-0' : 'left-64'} ${isLeftSidebarCollapsed ? 'w-0 p-0 opacity-0 border-r-0' : 'w-64'}`}>
        <div className="flex flex-col gap-1">
          <button 
            onClick={() => setIsWorkspaceCollapsed(!isWorkspaceCollapsed)}
            className="flex items-center justify-between px-2 py-2 hover:bg-stone-200 rounded-lg transition-colors group"
          >
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Workspace</p>
            <ChevronDown 
              size={14} 
              className={`text-neutral-400 transition-transform duration-200 ${isWorkspaceCollapsed ? '-rotate-90' : ''}`}
            />
          </button>
          <AnimatePresence>
            {!isWorkspaceCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1 overflow-hidden"
              >
                <button className="flex items-center gap-3 px-3 py-2.5 bg-white text-violet-700 rounded-lg shadow-sm font-medium">
                  <Brush size={18} fill="currentColor" />
                  <span className="font-sans text-sm">Studio</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 text-neutral-600 hover:bg-stone-200 rounded-lg font-medium">
                  <Compass size={18} />
                  <span className="font-sans text-sm">Templates</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 text-neutral-600 hover:bg-stone-200 rounded-lg font-medium">
                  <Layers size={18} />
                  <span className="font-sans text-sm">Layers</span>
                </button>
                <button className="flex items-center gap-3 px-3 py-2.5 text-neutral-600 hover:bg-stone-200 rounded-lg font-medium">
                  <FileText size={18} />
                  <span className="font-sans text-sm">Drafts</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-4">
          <button 
            onClick={() => setIsAIAssistantCollapsed(!isAIAssistantCollapsed)}
            className="flex items-center justify-between w-full px-2 py-2 hover:bg-stone-200 rounded-lg transition-colors group"
          >
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">AI Assistant</p>
            <ChevronDown 
              size={14} 
              className={`text-neutral-400 transition-transform duration-200 ${isAIAssistantCollapsed ? '-rotate-90' : ''}`}
            />
          </button>
          <AnimatePresence>
            {!isAIAssistantCollapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden mt-2"
              >
                <button 
                  onClick={handleGenerateConcept}
                  disabled={isGenerating}
                  className="w-full flex items-center justify-center gap-2 px-3 py-3 bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white rounded-xl shadow-md font-bold text-xs hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                  <span>Generate Concept</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2 px-2">Monetization</p>
          <div className="bg-[#f3f0ef] p-4 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Premium Asset</span>
              <button 
                onClick={() => setIsPremium(!isPremium)}
                className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${isPremium ? 'bg-[#6a37d4]' : 'bg-[#dfdcdc]'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isPremium ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
            {isPremium && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c5b5b] font-bold">$</span>
                  <input 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-white border-none rounded-md pl-7 text-sm font-bold focus:ring-2 focus:ring-[#6a37d4]/20" 
                    type="text"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 leading-tight">Template will be listed in the Marketplace upon publishing.</p>
              </motion.div>
            )}
          </div>
        </div>
      </nav>

      {/* Canvas Area */}
      <main className={`flex-1 bg-[#f0eeec] min-h-screen flex flex-col overflow-auto transition-all duration-300 pt-20 ${
        isLeftSidebarCollapsed
          ? (globalSidebarCollapsed ? 'ml-0' : 'ml-64')
          : (globalSidebarCollapsed ? 'ml-64' : 'ml-[512px]')
      } ${isRightSidebarCollapsed ? 'mr-0' : 'mr-80'}`}>
        <AnimatePresence>
          {aiConcept && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8"
            >
              <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative">
                <button 
                  onClick={() => setAiConcept(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-[#f3f0ef] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-[#6a37d4]/10 rounded-xl text-[#6a37d4]">
                    <Sparkles size={24} />
                  </div>
                  <h3 className="font-serif text-2xl font-bold">AI Generated Concept</h3>
                </div>
                <div className="prose prose-sm max-h-[400px] overflow-y-auto scrollbar-hide">
                  <pre className="whitespace-pre-wrap font-sans text-sm text-[#5c5b5b] leading-relaxed">
                    {aiConcept}
                  </pre>
                </div>
                <div className="mt-8 flex gap-4">
                  <button className="flex-1 py-3 bg-[#6a37d4] text-white rounded-xl font-bold shadow-lg hover:shadow-[#6a37d4]/20 transition-all">
                    Apply to Canvas
                  </button>
                  <button 
                    onClick={handleGenerateConcept}
                    className="flex-1 py-3 bg-[#f3f0ef] text-[#2f2e2e] rounded-xl font-bold hover:bg-[#dfdcdc] transition-all"
                  >
                    Regenerate
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keyboard Shortcuts Panel */}
        <AnimatePresence>
          {showShortcuts && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-8"
              onClick={() => setShowShortcuts(false)}
            >
              <div 
                className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowShortcuts(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-[#f3f0ef] rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">⌨️</span>
                  <h3 className="font-serif text-2xl font-bold">Keyboard Shortcuts</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-[#5c5b5b] uppercase tracking-wider mb-3">Editing</h4>
                    <div className="space-y-2">
                      <ShortcutItem keys="Ctrl+Z" action="Undo" />
                      <ShortcutItem keys="Ctrl+Shift+Z" action="Redo" />
                      <ShortcutItem keys="Ctrl+C" action="Copy" />
                      <ShortcutItem keys="Ctrl+V" action="Paste" />
                      <ShortcutItem keys="Ctrl+D" action="Duplicate" />
                      <ShortcutItem keys="Del" action="Delete" />
                      <ShortcutItem keys="Esc" action="Deselect" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#5c5b5b] uppercase tracking-wider mb-3">View</h4>
                    <div className="space-y-2">
                      <ShortcutItem keys="Ctrl++" action="Zoom In" />
                      <ShortcutItem keys="Ctrl+-" action="Zoom Out" />
                      <ShortcutItem keys="Ctrl+0" action="Reset Zoom" />
                      <ShortcutItem keys="?" action="Show Shortcuts" />
                    </div>
                    <h4 className="text-xs font-bold text-[#5c5b5b] uppercase tracking-wider mb-3 mt-6">File</h4>
                    <div className="space-y-2">
                      <ShortcutItem keys="Ctrl+S" action="Save Design" />
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-[#f3f0ef] rounded-xl">
                  <p className="text-xs text-[#5c5b5b] leading-relaxed">
                    <strong>Tip:</strong> Right-click on canvas elements or empty space to access the context menu with quick actions. Select an element to see resize handles at corners and edges - drag them to resize!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toolbar + Canvas stacked */}
        <div className="flex flex-col items-center gap-3 pt-16 pb-8 px-6 w-full">

          {/* Horizontal Toolbar */}
          <div className="flex flex-row items-center gap-1 p-1.5 bg-white rounded-xl shadow-md border border-[#e8e5e5] z-20 self-center">
            {/* Tools */}
            <button onClick={() => setActiveTool('select')} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${activeTool === 'select' ? 'bg-[#6a37d4] text-white shadow-md' : 'text-[#5c5b5b] hover:bg-[#f3f0ef]'}`} title="Select">
              <MousePointer2 size={16} /><span>Select</span>
            </button>
            <div className="w-px h-5 bg-[#e8e5e5] mx-0.5"></div>
            <button onClick={() => { setActiveTool('square'); addElement('square'); }} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${activeTool === 'square' ? 'bg-[#6a37d4] text-white shadow-md' : 'text-[#5c5b5b] hover:bg-[#f3f0ef]'}`} title="Rectangle">
              <Square size={16} /><span>Rect</span>
            </button>
            <button onClick={() => { setActiveTool('circle'); addElement('circle'); }} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${activeTool === 'circle' ? 'bg-[#6a37d4] text-white shadow-md' : 'text-[#5c5b5b] hover:bg-[#f3f0ef]'}`} title="Circle">
              <Circle size={16} /><span>Circle</span>
            </button>
            <button onClick={() => { setActiveTool('text'); addElement('text'); }} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${activeTool === 'text' ? 'bg-[#6a37d4] text-white shadow-md' : 'text-[#5c5b5b] hover:bg-[#f3f0ef]'}`} title="Text">
              <Type size={16} /><span>Text</span>
            </button>
            <button onClick={() => setActiveTool('pencil')} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${activeTool === 'pencil' ? 'bg-[#6a37d4] text-white shadow-md' : 'text-[#5c5b5b] hover:bg-[#f3f0ef]'}`} title="Pencil">
              <Pencil size={16} /><span>Pencil</span>
            </button>
            <button onClick={() => setActiveTool('image')} className={`p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold ${activeTool === 'image' ? 'bg-[#6a37d4] text-white shadow-md' : 'text-[#5c5b5b] hover:bg-[#f3f0ef]'}`} title="Image">
              <ImageIcon size={16} /><span>Image</span>
            </button>
            <button className="p-2 rounded-lg transition-all flex items-center gap-1.5 text-xs font-semibold text-[#5c5b5b] hover:bg-[#f3f0ef]" title="Color">
              <Palette size={16} /><span>Color</span>
            </button>
            {/* Divider */}
            <div className="w-px h-5 bg-[#e8e5e5] mx-0.5"></div>
            {/* Zoom controls inline */}
            <button onClick={handleZoomOut} className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors text-[#5c5b5b]" title="Zoom Out"><Minus size={14} /></button>
            <span className="text-xs font-bold w-10 text-center text-[#2f2e2e]">{zoom}%</span>
            <button onClick={handleZoomIn} className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors text-[#5c5b5b]" title="Zoom In"><Plus size={14} /></button>
            <button onClick={() => setZoom(100)} className="p-2 hover:bg-[#f3f0ef] rounded-lg transition-colors text-[#5c5b5b]" title="Reset Zoom"><Maximize size={14} /></button>
            {/* Canvas size display */}
            <div className="w-px h-5 bg-[#e8e5e5] mx-0.5"></div>
            <span className="text-[10px] font-mono text-neutral-400 px-1">{canvasWidth} × {canvasHeight}</span>
          </div>

          {/* Canvas with resize handles */}
          <div
            className="relative"
            style={{ width: canvasWidth * zoom / 100, height: canvasHeight * zoom / 100 }}
            onMouseMove={(e) => {
              if (!isResizingCanvas || !canvasResizeStart.current) return;
              const dx = e.clientX - canvasResizeStart.current.x;
              const dy = e.clientY - canvasResizeStart.current.y;
              if (canvasResizeDir === 'e' || canvasResizeDir === 'se') setCanvasWidth(Math.max(200, Math.round(canvasResizeStart.current.w + dx / (zoom / 100))));
              if (canvasResizeDir === 's' || canvasResizeDir === 'se') setCanvasHeight(Math.max(150, Math.round(canvasResizeStart.current.h + dy / (zoom / 100))));
            }}
            onMouseUp={() => { setIsResizingCanvas(false); setCanvasResizeDir(null); canvasResizeStart.current = null; }}
            onMouseLeave={() => { if (isResizingCanvas) { setIsResizingCanvas(false); setCanvasResizeDir(null); canvasResizeStart.current = null; } }}
          >
            {/* Canvas */}
            <div
              className="relative bg-white shadow-2xl overflow-hidden"
              style={{ width: canvasWidth * zoom / 100, height: canvasHeight * zoom / 100 }}
              onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); }}
            >
              {/* Dynamic canvas elements */}
              {canvasElements.map((element) => (
                <motion.div
                  key={element.id}
                  drag={!isResizing}
                  dragMomentum={false}
                  onDragEnd={(e, info) => {
                    const newElements = canvasElements.map(el =>
                      el.id === element.id
                        ? { ...el, x: element.x + info.offset.x, y: element.y + info.offset.y }
                        : el
                    );
                    setCanvasElements(newElements);
                    addToHistory(newElements);
                  }}
                  className={`absolute ${isResizing ? 'cursor-default' : 'cursor-move'}`}
                  style={{ left: element.x, top: element.y, width: element.width, height: element.height }}
                  onClick={() => setSelectedElement(element.id)}
                  onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY, element }); setSelectedElement(element.id); }}
                  onPointerMove={(e) => handleResizeMove(e, element.id)}
                  onPointerUp={handleResizeEnd}
                >
                  {element.type === 'square' && <div className="w-full h-full rounded-lg" style={{ backgroundColor: element.color, opacity: 0.8 }}></div>}
                  {element.type === 'circle' && <div className="w-full h-full rounded-full" style={{ backgroundColor: element.color, opacity: 0.8 }}></div>}
                  {element.type === 'text' && <div className="w-full h-full flex items-center justify-center text-center font-bold" style={{ color: element.color }}>{element.text}</div>}
                </motion.div>
              ))}
            </div>

            {/* Canvas resize handle — right edge */}
            <div
              className="absolute top-0 right-0 w-3 cursor-ew-resize flex items-center justify-center group"
              style={{ height: canvasHeight * zoom / 100 }}
              onMouseDown={(e) => { e.preventDefault(); setIsResizingCanvas(true); setCanvasResizeDir('e'); canvasResizeStart.current = { x: e.clientX, y: e.clientY, w: canvasWidth, h: canvasHeight }; }}
            >
              <div className="w-1 h-12 bg-[#6a37d4]/40 rounded-full group-hover:bg-[#6a37d4] transition-colors"></div>
            </div>

            {/* Canvas resize handle — bottom edge */}
            <div
              className="absolute bottom-0 left-0 h-3 cursor-ns-resize flex items-center justify-center group"
              style={{ width: canvasWidth * zoom / 100 }}
              onMouseDown={(e) => { e.preventDefault(); setIsResizingCanvas(true); setCanvasResizeDir('s'); canvasResizeStart.current = { x: e.clientX, y: e.clientY, w: canvasWidth, h: canvasHeight }; }}
            >
              <div className="h-1 w-12 bg-[#6a37d4]/40 rounded-full group-hover:bg-[#6a37d4] transition-colors"></div>
            </div>

            {/* Canvas resize handle — bottom-right corner */}
            <div
              className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-center justify-center"
              onMouseDown={(e) => { e.preventDefault(); setIsResizingCanvas(true); setCanvasResizeDir('se'); canvasResizeStart.current = { x: e.clientX, y: e.clientY, w: canvasWidth, h: canvasHeight }; }}
            >
              <div className="w-2.5 h-2.5 border-r-2 border-b-2 border-[#6a37d4]/60 rounded-br-sm hover:border-[#6a37d4] transition-colors"></div>
            </div>
          </div>

        </div>{/* end toolbar+canvas wrapper */}

        {/* Context Menu */}
        {contextMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bg-white rounded-xl shadow-2xl border border-[#afacac]/20 py-2 min-w-[200px] z-50"
            style={{ left: contextMenu.x, top: contextMenu.y }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {contextMenu.element && (
              <>
                <button
                  onClick={() => {
                    const element = canvasElements.find(el => el.id === contextMenu.element.id);
                    if (element) copyElement(element);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#f3f0ef] flex items-center gap-3 transition-colors"
                >
                  <span className="text-[#5c5b5b]">📋</span>
                  <span>Copy</span>
                  <span className="ml-auto text-xs text-[#5c5b5b]">Ctrl+C</span>
                </button>
                <button
                  onClick={() => {
                    const element = canvasElements.find(el => el.id === contextMenu.element.id);
                    if (element) duplicateElement(element);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#f3f0ef] flex items-center gap-3 transition-colors"
                >
                  <span className="text-[#5c5b5b]">📑</span>
                  <span>Duplicate</span>
                  <span className="ml-auto text-xs text-[#5c5b5b]">Ctrl+D</span>
                </button>
                <div className="h-px bg-[#dfdcdc] my-1"></div>
                <button
                  onClick={() => deleteElement(contextMenu.element.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3 transition-colors"
                >
                  <span>🗑️</span>
                  <span>Delete</span>
                  <span className="ml-auto text-xs">Del</span>
                </button>
              </>
            )}
            {!contextMenu.element && (
              <>
                <button
                  onClick={() => {
                    pasteElement();
                    setContextMenu(null);
                  }}
                  disabled={!copiedElement}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#f3f0ef] flex items-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-[#5c5b5b]">📋</span>
                  <span>Paste</span>
                  <span className="ml-auto text-xs text-[#5c5b5b]">Ctrl+V</span>
                </button>
                <div className="h-px bg-[#dfdcdc] my-1"></div>
                <button
                  onClick={() => {
                    addElement('square');
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#f3f0ef] flex items-center gap-3 transition-colors"
                >
                  <Square size={14} className="text-[#5c5b5b]" />
                  <span>Add Square</span>
                </button>
                <button
                  onClick={() => {
                    addElement('circle');
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#f3f0ef] flex items-center gap-3 transition-colors"
                >
                  <Circle size={14} className="text-[#5c5b5b]" />
                  <span>Add Circle</span>
                </button>
                <button
                  onClick={() => {
                    addElement('text');
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-[#f3f0ef] flex items-center gap-3 transition-colors"
                >
                  <Type size={14} className="text-[#5c5b5b]" />
                  <span>Add Text</span>
                </button>
              </>
            )}
          </motion.div>
        )}
      </main>

      {/* Right Panel — Properties + Chatbot */}
      <aside className={`h-screen fixed right-0 top-0 overflow-hidden bg-stone-50 pt-24 flex flex-col z-30 border-l border-[#afacac]/10 transition-all duration-300 ${isRightSidebarCollapsed ? 'w-0 opacity-0 border-l-0' : 'w-80'}`}>
        {/* Tab Selector */}
        <div className="flex border-b border-[#afacac]/10 px-2 pt-1 flex-shrink-0">
          <button
            onClick={() => setRightPanelTab('properties')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-t-lg transition-all ${
              rightPanelTab === 'properties'
                ? 'bg-white text-[#6a37d4] border-b-2 border-[#6a37d4] shadow-sm'
                : 'text-[#5c5b5b] hover:bg-[#eae7e7]'
            }`}
          >
            <Layers size={14} />
            Properties
          </button>
          <button
            onClick={() => setRightPanelTab('chat')}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-bold rounded-t-lg transition-all ${
              rightPanelTab === 'chat'
                ? 'bg-white text-[#6a37d4] border-b-2 border-[#6a37d4] shadow-sm'
                : 'text-[#5c5b5b] hover:bg-[#eae7e7]'
            }`}
          >
            <Sparkles size={14} />
            AI Chat
          </button>
        </div>

        {/* Properties Tab */}
        {rightPanelTab === 'properties' && (
          <div className="flex-1 overflow-y-auto px-6 pb-12 pt-4 flex flex-col gap-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-lg font-bold">Properties</h3>
                <span className="text-[10px] font-bold text-[#6a37d4] bg-[#6a37d4]/10 px-2 py-0.5 rounded">TEXT LAYER</span>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase">Width</label>
                  <div className="flex items-center px-3 py-2 bg-white rounded-lg border border-transparent">
                    <input className="w-full border-none p-0 text-xs font-bold focus:ring-0" type="text" defaultValue="480"/>
                    <span className="text-[10px] text-neutral-400">PX</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase">Height</label>
                  <div className="flex items-center px-3 py-2 bg-white rounded-lg border border-transparent">
                    <input className="w-full border-none p-0 text-xs font-bold focus:ring-0" type="text" defaultValue="120"/>
                    <span className="text-[10px] text-neutral-400">PX</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-neutral-500 uppercase">Font Family</label>
                  <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg cursor-pointer hover:bg-stone-100">
                    <span className="text-sm font-serif font-bold">Noto Serif</span>
                    <ChevronDown size={14} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Weight</label>
                    <div className="flex items-center justify-between px-3 py-2 bg-white rounded-lg cursor-pointer">
                      <span className="text-xs font-medium">Black 900</span>
                      <ChevronDown size={14} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase">Size</label>
                    <div className="flex items-center px-3 py-2 bg-white rounded-lg">
                      <input className="w-full border-none p-0 text-xs font-bold focus:ring-0" type="text" defaultValue="52"/>
                      <span className="text-[10px] text-neutral-400">PT</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-4">Appearance</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Opacity</span>
                  <div className="flex items-center gap-3 w-32">
                    <div className="h-1 flex-1 bg-[#dfdcdc] rounded-full overflow-hidden">
                      <div className="w-full h-full bg-[#6a37d4]"></div>
                    </div>
                    <span className="text-[10px] font-bold">100%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Fill</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-medium text-neutral-500">#2F2E2E</span>
                    <div className="w-6 h-6 rounded-md bg-[#2f2e2e] border border-white shadow-sm cursor-pointer"></div>
                  </div>
                </div>
              </div>
            </section>
            <section className="mt-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">Layers</p>
                <button onClick={() => addElement('square')} className="p-1 hover:bg-stone-200 rounded-md transition-colors"><Plus size={12} /></button>
              </div>
              <div className="space-y-1">
                <div 
                  onClick={() => setIsEditingText(true)}
                  className="flex items-center gap-3 p-2 bg-white rounded-lg shadow-sm border border-[#6a37d4]/20 cursor-pointer hover:bg-[#f3f0ef] transition-colors"
                >
                  <Type size={14} className="text-[#6a37d4]" />
                  <span className="text-xs font-bold truncate">Main Headline</span>
                  <Eye size={12} className="ml-auto text-neutral-400" />
                </div>
                {canvasElements.map((element) => (
                  <div 
                    key={element.id}
                    onClick={() => setSelectedElement(element.id)}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-colors cursor-pointer group ${
                      selectedElement === element.id ? 'bg-white shadow-sm border border-[#6a37d4]/20' : 'hover:bg-stone-200/50'
                    }`}
                  >
                    {element.type === 'square' && <Square size={14} className="text-neutral-400" />}
                    {element.type === 'circle' && <Circle size={14} className="text-neutral-400" />}
                    {element.type === 'text' && <Type size={14} className="text-neutral-400" />}
                    <span className="text-xs font-medium text-neutral-600 truncate">{element.type.charAt(0).toUpperCase() + element.type.slice(1)} Layer</span>
                    <Eye size={12} className="ml-auto text-neutral-400 opacity-0 group-hover:opacity-100" />
                  </div>
                ))}
                <div className="flex items-center gap-3 p-2 hover:bg-stone-200/50 rounded-lg transition-colors cursor-pointer group">
                  <ImageIcon size={14} className="text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-600 truncate">Hero Abstract Asset</span>
                  <Eye size={12} className="ml-auto text-neutral-400 opacity-0 group-hover:opacity-100" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* AI Chat Tab */}
        {rightPanelTab === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {chatMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] flex-shrink-0 flex items-center justify-center text-white self-end">
                      <Sparkles size={13} />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : ''}`}>
                    <div className={`px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white rounded-br-md'
                        : 'bg-white border border-[#e8e5e5] text-[#2f2e2e] rounded-bl-md shadow-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                    <span className={`text-[9px] text-[#5c5b5b]/60 mt-0.5 block ${msg.sender === 'user' ? 'text-right' : ''}`}>
                      {msg.time}
                    </span>
                  </div>
                </motion.div>
              ))}
              
              {/* Typing indicator */}
              {isBotTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] flex-shrink-0 flex items-center justify-center text-white self-end">
                    <Sparkles size={13} className="animate-pulse" />
                  </div>
                  <div className="bg-white border border-[#e8e5e5] px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-[#6a37d4] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#6a37d4] rounded-full animate-bounce [animation-delay:0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#6a37d4] rounded-full animate-bounce [animation-delay:0.3s]"></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Action Chips */}
            <div className="flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide flex-shrink-0 border-t border-[#afacac]/10 bg-[#f9f6f5]">
              {[
                { label: '🟦 Square', cmd: 'add a blue square' },
                { label: '🔴 Circle', cmd: 'add a red circle' },
                { label: '📝 Text', cmd: 'add text saying Hello' },
                { label: '🗑️ Delete', cmd: 'delete selected' },
                { label: '❓ Help', cmd: 'help' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setChatInput(chip.cmd);
                    // Auto-send after setting
                    const userMsg = {
                      id: Date.now(),
                      text: chip.cmd,
                      sender: 'user' as const,
                      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    setChatMessages(prev => [...prev, userMsg]);
                    setIsBotTyping(true);
                    setChatInput('');
                    setTimeout(() => {
                      const { command, response } = parseStudioCommand(chip.cmd);
                      executeCommand(command);
                      const botMsg = {
                        id: Date.now() + 1,
                        text: response,
                        sender: 'bot' as const,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      };
                      setChatMessages(prev => [...prev, botMsg]);
                      setIsBotTyping(false);
                    }, 400 + Math.random() * 400);
                  }}
                  className="flex-shrink-0 px-2.5 py-1.5 text-[10px] font-bold bg-white border border-[#e8e5e5] rounded-full hover:border-[#6a37d4] hover:text-[#6a37d4] transition-all whitespace-nowrap shadow-sm"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-3 bg-white border-t border-[#afacac]/10 flex-shrink-0">
              <div className="relative flex items-center gap-2 bg-[#f3f0ef] rounded-xl p-1.5 pl-3 border border-transparent focus-within:border-[#6a37d4]/20 focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      e.stopPropagation();
                      handleChatSend();
                    }
                  }}
                  placeholder='Try "add a red circle"...'
                  className="flex-1 bg-transparent border-none focus:ring-0 text-xs font-medium placeholder:text-[#787676]/50 py-1.5"
                />
                <button
                  onClick={handleChatSend}
                  disabled={!chatInput.trim()}
                  className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white rounded-lg shadow-sm active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};

const MessagesPage = ({ isSidebarCollapsed, onToggleSidebar }: { isSidebarCollapsed?: boolean, onToggleSidebar?: () => void }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi Sarah! I've been reviewing your latest portfolio additions. The 'Ethereal Flow' series is exactly what we're looking for our Spring exhibition.", sender: 'bot', time: '10:42 AM' },
    { id: 2, text: "Thank you, Julian! I'm glad you liked them. I've been experimenting with some digital oil textures lately to give them more depth.", sender: 'user', time: '10:45 AM' },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: ChatMessage = { id: Date.now(), text: inputText, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages([...messages, newMessage]);
    setInputText("");

    // Check if it's an AI command
    if (inputText.toLowerCase().startsWith("/ai")) {
      setIsAiTyping(true);
      const aiResponse = await getAIAssistantResponse(inputText.replace("/ai", "").trim());
      const aiMessage: ChatMessage = { id: Date.now() + 1, text: aiResponse, sender: 'ai', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setMessages(prev => [...prev, aiMessage]);
      setIsAiTyping(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col relative transition-all duration-300 ${isSidebarCollapsed ? '' : 'md:ml-64'}`}>
      <TopBar title="Messages" onToggleSidebar={onToggleSidebar} isSidebarCollapsed={isSidebarCollapsed} />
      <div className="pt-20 flex-1 flex overflow-hidden">
        {/* Conversation History */}
        <div className="w-80 border-r border-[#afacac]/10 bg-[#f3f0ef] flex flex-col overflow-hidden hidden lg:flex">
          <div className="p-6">
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-[#6a37d4] text-white text-[10px] font-bold rounded-full cursor-pointer">All</span>
              <span className="px-3 py-1 bg-[#e5e2e1] text-[#5c5b5b] text-[10px] font-bold rounded-full cursor-pointer">Clients</span>
              <span className="px-3 py-1 bg-[#e5e2e1] text-[#5c5b5b] text-[10px] font-bold rounded-full cursor-pointer">Cribble AI</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 space-y-1">
            <div className="p-3 rounded-xl bg-white shadow-sm flex items-start gap-3 cursor-pointer border-l-4 border-[#6a37d4]">
              <div className="relative flex-shrink-0">
                <img className="w-12 h-12 rounded-xl object-cover" src="https://picsum.photos/seed/julian/100/100" alt="Julian Reed" referrerPolicy="no-referrer" />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-white rounded-full"></span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm truncate">Julian Reed</h4>
                  <span className="text-[10px] text-[#5c5b5b]">2m ago</span>
                </div>
                <p className="text-xs text-[#6a37d4] font-medium truncate">Sent an Art Concept</p>
              </div>
            </div>
            <div className="p-3 rounded-xl hover:bg-[#e5e2e1] transition-colors flex items-start gap-3 cursor-pointer">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] flex items-center justify-center text-white">
                  <Sparkles size={24} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="font-bold text-sm truncate">Cribble AI</h4>
                  <span className="text-[10px] text-[#5c5b5b]">Online</span>
                </div>
                <p className="text-xs text-[#5c5b5b] truncate">How can I help you today?</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-[#f9f6f5] overflow-hidden">
          <div className="h-20 px-8 flex items-center justify-between border-b border-[#afacac]/10">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img className="w-10 h-10 rounded-full object-cover" src="https://picsum.photos/seed/julian/100/100" alt="Julian" referrerPolicy="no-referrer" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
              </div>
              <div>
                <h3 className="font-bold text-base">Julian Reed</h3>
                <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-[#f3f0ef] rounded-lg text-[#5c5b5b]"><Video size={20} /></button>
              <button className="p-2 hover:bg-[#f3f0ef] rounded-lg text-[#5c5b5b]"><Phone size={20} /></button>
              <button className="p-2 hover:bg-[#f3f0ef] rounded-lg text-[#5c5b5b]"><MoreVertical size={20} /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] font-bold text-[#5c5b5b]/60 uppercase tracking-widest bg-[#f3f0ef] px-4 py-1 rounded-full">Today</span>
            </div>
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-4 max-w-2xl ${msg.sender === 'user' ? 'flex-row-reverse ml-auto' : ''}`}>
                {msg.sender !== 'user' && (
                  <div className={`w-8 h-8 rounded-lg flex-shrink-0 self-end flex items-center justify-center ${msg.sender === 'ai' ? 'bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white' : ''}`}>
                    {msg.sender === 'ai' ? <Sparkles size={16} /> : <img className="w-full h-full rounded-lg object-cover" src="https://picsum.photos/seed/julian/50/50" alt="Avatar" referrerPolicy="no-referrer" />}
                  </div>
                )}
                <div className={`space-y-2 ${msg.sender === 'user' ? 'text-right' : ''}`}>
                  <div className={`p-4 rounded-2xl shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white rounded-br-none' 
                      : msg.sender === 'ai'
                        ? 'bg-white border border-[#6a37d4]/20 text-[#2f2e2e] rounded-bl-none'
                        : 'bg-[#e5e2e1] text-[#2f2e2e] rounded-bl-none'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-[#5c5b5b] px-1">{msg.time} {msg.sender === 'user' ? '· Read' : ''}</span>
                </div>
              </div>
            ))}

            {isAiTyping && (
              <div className="flex gap-4 max-w-2xl">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white flex-shrink-0 self-end flex items-center justify-center">
                  <Sparkles size={16} className="animate-pulse" />
                </div>
                <div className="bg-white border border-[#6a37d4]/20 p-4 rounded-2xl rounded-bl-none shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[#6a37d4] rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-[#6a37d4] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-[#6a37d4] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white/50 backdrop-blur-md border-t border-[#afacac]/10">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                <button className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#f3f0ef] text-[#5c5b5b] text-[11px] font-bold rounded-full"><Upload size={14} /><span>Send File</span></button>
                <button className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#6a37d4]/10 text-[#6a37d4] text-[11px] font-bold rounded-full"><Palette size={14} /><span>Send Art Concept</span></button>
                <button className="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 bg-[#f3f0ef] text-[#5c5b5b] text-[11px] font-bold rounded-full"><Sparkles size={14} /><span>Ask Cribble AI</span></button>
              </div>
              <div className="relative flex items-end gap-3 bg-[#f3f0ef] rounded-2xl p-2 pl-4 border border-transparent focus-within:border-[#6a37d4]/20 focus-within:bg-white transition-all shadow-sm">
                <textarea 
                  className="flex-1 bg-transparent border-none focus:ring-0 py-3 text-sm font-body resize-none min-h-[44px]" 
                  placeholder="Write your message... (use /ai for assistant)" 
                  rows={1}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                ></textarea>
                <div className="flex items-center gap-1 mb-1">
                  <button className="p-2 text-[#5c5b5b]"><Smile size={20} /></button>
                  <button className="p-2 text-[#5c5b5b]"><Paperclip size={20} /></button>
                  <button 
                    onClick={handleSendMessage}
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white rounded-xl shadow-lg active:scale-95 transition-transform"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="w-72 bg-[#f3f0ef] border-l border-[#afacac]/10 overflow-y-auto hidden xl:block p-6">
          <div className="text-center mb-6">
            <img className="w-24 h-24 rounded-3xl object-cover mx-auto mb-4 shadow-lg" src="https://picsum.photos/seed/julian/200/200" alt="Profile" referrerPolicy="no-referrer" />
            <h4 className="font-serif text-lg font-bold">Julian Reed</h4>
            <p className="text-xs text-[#5c5b5b] mb-4">Founder, Reed Modern Gallery</p>
            <div className="flex justify-center gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e5e2e1] text-[#5c5b5b]"><User size={18} /></button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e5e2e1] text-[#5c5b5b]"><Bookmark size={18} /></button>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-[#5c5b5b]/60 mb-3">Project Details</h5>
              <div className="p-3 bg-white rounded-xl border border-[#afacac]/10">
                <p className="text-xs font-bold mb-1">Spring Exhibition '24</p>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span className="text-[10px] text-[#5c5b5b]">Awaiting high-res files</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="text-[10px] font-black uppercase tracking-widest text-[#5c5b5b]/60 mb-3">Shared Media</h5>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map(i => (
                  <img key={i} className="w-full aspect-square object-cover rounded-lg cursor-pointer" src={`https://picsum.photos/seed/media${i}/100/100`} alt="media" referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const getTabFromPath = (): Tab => {
    const path = window.location.pathname.replace('/', '') as Tab;
    return ['home', 'explore', 'saved', 'studio', 'messages'].includes(path) ? path : 'home';
  };

  const [activeTab, setActiveTab] = useState<Tab>(getTabFromPath);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const navigateTo = (tab: Tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/${tab}`);
  };

  React.useEffect(() => {
    const onPopState = () => setActiveTab(getTabFromPath());
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  return (
    <ErrorBoundary>
    <div className="min-h-screen bg-[#f9f6f5] font-body text-[#2f2e2e]">
      <Sidebar activeTab={activeTab} setActiveTab={navigateTo} isCollapsed={isSidebarCollapsed} onToggle={() => setIsSidebarCollapsed(v => !v)} />
      
      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div key="home" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <HomePage isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
          </motion.div>
        )}
        {activeTab === 'explore' && (
          <motion.div key="explore" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <ExplorePage isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
          </motion.div>
        )}
        {activeTab === 'saved' && (
          <motion.div key="saved" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <SavedPage isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
          </motion.div>
        )}
        {activeTab === 'studio' && (
          <motion.div key="studio" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <StudioPage isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
          </motion.div>
        )}
        {activeTab === 'messages' && (
          <motion.div key="messages" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
            <MessagesPage isSidebarCollapsed={isSidebarCollapsed} onToggleSidebar={() => setIsSidebarCollapsed(v => !v)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-[#afacac]/10 flex justify-around items-center z-50 px-2">
        <button onClick={() => navigateTo('home')} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'home' ? 'text-[#6a37d4]' : 'text-[#5c5b5b]'}`}>
          <Home size={18} />
          <span className="text-[9px] font-bold">Home</span>
        </button>
        <button onClick={() => navigateTo('explore')} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'explore' ? 'text-[#6a37d4]' : 'text-[#5c5b5b]'}`}>
          <Compass size={18} />
          <span className="text-[9px] font-bold">Explore</span>
        </button>
        <button onClick={() => navigateTo('studio')} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'studio' ? 'text-[#6a37d4]' : 'text-[#5c5b5b]'}`}>
          <div className="bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] -mt-8 p-2.5 rounded-full shadow-lg text-white">
            <Brush size={20} />
          </div>
          <span className="text-[9px] font-bold mt-1">Studio</span>
        </button>
        <button onClick={() => navigateTo('saved')} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'saved' ? 'text-[#6a37d4]' : 'text-[#5c5b5b]'}`}>
          <Bookmark size={18} />
          <span className="text-[9px] font-bold">Saved</span>
        </button>
        <button onClick={() => navigateTo('messages')} className={`flex flex-col items-center gap-1 flex-1 ${activeTab === 'messages' ? 'text-[#6a37d4]' : 'text-[#5c5b5b]'}`}>
          <MessageSquare size={18} />
          <span className="text-[9px] font-bold">Chat</span>
        </button>
      </nav>
    </div>
    </ErrorBoundary>
  );
}
