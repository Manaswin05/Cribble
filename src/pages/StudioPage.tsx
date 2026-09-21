/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  MousePointer2, Square, Circle, Type, Pencil, Image as ImageIcon, Palette,
  Plus, Minus, Maximize, Eye, Sparkles, X, Loader2, ChevronDown, Send, Layers, HelpCircle, Copy, Files, Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { IS_REAL_AI, generateArtConcept, getAIAssistantResponse, parseStudioCommand, type StudioCommand } from '../services/geminiService';
import { generateColorTheme, type ColorPalette } from '../services/colorThemeService';
import { ColorThemePanel } from '../components/ColorThemePanel';
import type { PageProps, CanvasElement, ChatMessage, ContextMenuState } from '../types';

export const StudioPage = ({ isSidebarCollapsed: globalSidebarCollapsed, onToggleSidebar }: PageProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiConcept, setAiConcept] = useState<string | null>(null);
  const [aiPromptInput, setAiPromptInput] = useState('');
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
  const canvasResizeStart = useRef<{ x: number; y: number; w: number; h: number } | null>(null);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 0, text: `👋 Hi! I'm your Studio AI${IS_REAL_AI ? ' (✨ Gemini powered)' : ''}. Try "generate a minimalist poster" or "add a blue circle". Type "help" for all commands!`, sender: 'bot', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'chat'>('chat');
  const [currentColorPalette, setCurrentColorPalette] = useState<ColorPalette | null>(null);

  const handleGenerateConcept = async (customPrompt?: string) => {
    const prompt = customPrompt || aiPromptInput.trim() || 'A minimalist digital landscape with ethereal lighting';
    setIsGenerating(true);
    const concept = await generateArtConcept(prompt);
    setAiConcept(concept);
    setIsGenerating(false);
  };

  const handleApplyToCanvas = () => {
    // Generate some shapes to demonstrate applying to canvas
    const newElements: CanvasElement[] = [
      { id: Date.now(), type: 'square', x: 100, y: 100, width: 400, height: 300, color: '#f3f0ef' },
      { id: Date.now() + 1, type: 'circle', x: 250, y: 150, width: 100, height: 100, color: '#6a37d4' },
      { id: Date.now() + 2, type: 'text', x: 150, y: 350, width: 300, height: 50, color: '#2f2e2e', text: 'AI CONCEPT' }
    ];
    setCanvasElements([...canvasElements, ...newElements]);
    addToHistory([...canvasElements, ...newElements]);
    setAiConcept(null);
  };

  const executeCommand = (command: StudioCommand) => {
    switch (command.type) {
      case 'add_element': {
        const newElement: CanvasElement = {
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
      case 'delete_all':
        setCanvasElements([]);
        setSelectedElement(null);
        addToHistory([]);
        break;
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
      case 'color_theme':
        generateColorTheme(command.prompt).then(palette => {
          setCurrentColorPalette(palette);
          setRightPanelTab('properties'); // switch to properties to see it
        }).catch(error => console.error('Error generating color theme:', error));
        break;
      case 'generate_design':
        handleGenerateConcept(command.prompt);
        break;
      case 'unknown':
        break;
    }
  };

  const handleChatSend = () => {
    if (!chatInput.trim()) return;
    const userMsg = { id: Date.now(), text: chatInput, sender: 'user' as const, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setChatMessages(prev => [...prev, userMsg]);
    const input = chatInput;
    setChatInput('');
    setIsBotTyping(true);

    setTimeout(() => {
      const { command, response } = parseStudioCommand(input);
      executeCommand(command);
      const botMsg = { id: Date.now() + 1, text: response, sender: 'bot' as const, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setChatMessages(prev => [...prev, botMsg]);
      setIsBotTyping(false);
    }, 400 + Math.random() * 400);
  };

  useEffect(() => {
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
    const newElement = { ...element, id: Date.now(), x: element.x + 20, y: element.y + 20 };
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
      const newElement = { ...copiedElement, id: Date.now(), x: copiedElement.x + 30, y: copiedElement.y + 30 };
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

    if (resizeHandle.includes('e')) newWidth = Math.max(20, x);
    if (resizeHandle.includes('w')) {
      const deltaX = x;
      newWidth = Math.max(20, element.width - deltaX);
      newX = element.x + deltaX;
    }
    if (resizeHandle.includes('s')) newHeight = Math.max(20, y);
    if (resizeHandle.includes('n')) {
      const deltaY = y;
      newHeight = Math.max(20, element.height - deltaY);
      newY = element.y + deltaY;
    }

    const newElements = canvasElements.map(el =>
      el.id === elementId ? { ...el, width: newWidth, height: newHeight, x: newX, y: newY } : el
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
    const design = { elements: canvasElements, headline: headlineText, zoom, isPremium, price };
    const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cribble-design-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.shiftKey && e.key === 'z' || e.key === 'y')) { e.preventDefault(); redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveDesign(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedElement) {
        e.preventDefault();
        const element = canvasElements.find(el => el.id === selectedElement);
        if (element) copyElement(element);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') { e.preventDefault(); pasteElement(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedElement) {
        e.preventDefault();
        const element = canvasElements.find(el => el.id === selectedElement);
        if (element) duplicateElement(element);
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElement && !isEditingText) {
        e.preventDefault();
        deleteElement(selectedElement);
      }
      if (e.key === 'Escape') {
        setSelectedElement(null);
        setContextMenu(null);
        setShowShortcuts(false);
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) { e.preventDefault(); handleZoomIn(); }
      if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); handleZoomOut(); }
      if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); setZoom(100); }
      if (e.key === '?' && !isEditingText) { e.preventDefault(); setShowShortcuts(!showShortcuts); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canvasElements, selectedElement, historyIndex, history, isEditingText, copiedElement]);

  useEffect(() => {
    const handleClick = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', handleClick);
      return () => window.removeEventListener('click', handleClick);
    }
  }, [contextMenu]);

  return (
    <div className={`flex flex-col h-full overflow-hidden bg-[#f3f0ef] text-[#2f2e2e] transition-all duration-300`}>
      {/* TOP BAR */}
      <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 bg-white border-b border-[#afacac]/10 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-medium text-[#5c5b5b]">
            <span className="text-[#5c5b5b]/60">Cribble</span>
            <span className="text-[#5c5b5b]/40">/</span>
            <span className="text-[#2f2e2e] font-semibold">Studio</span>
            {IS_REAL_AI && (
              <span className="ml-1 text-[10px] bg-gradient-to-r from-violet-500 to-purple-400 text-white px-1.5 py-0.5 rounded-full font-bold">✦ Gemini</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button onClick={undo} disabled={historyIndex === 0} className="p-1.5 hover:bg-[#eae7e7] rounded-md transition-colors disabled:opacity-20 text-[#5c5b5b]" title="Undo (Ctrl+Z)">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" /></svg>
          </button>
          <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-1.5 hover:bg-[#eae7e7] rounded-md transition-colors disabled:opacity-20 text-[#5c5b5b]" title="Redo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" /></svg>
          </button>
          <div className="w-px h-4 bg-[#afacac]/20 mx-2" />
          <button onClick={handleZoomOut} className="p-1.5 hover:bg-[#eae7e7] rounded-md text-[#5c5b5b] transition-colors"><Minus size={14} /></button>
          <span className="text-[11px] font-mono font-bold text-[#5c5b5b] w-10 text-center">{zoom}%</span>
          <button onClick={handleZoomIn} className="p-1.5 hover:bg-[#eae7e7] rounded-md text-[#5c5b5b] transition-colors"><Plus size={14} /></button>
          <button onClick={() => setZoom(100)} className="p-1.5 hover:bg-[#eae7e7] rounded-md text-[#5c5b5b] transition-colors" title="Fit"><Maximize size={13} /></button>
          <div className="w-px h-4 bg-[#afacac]/20 mx-2" />
          <span className="text-[10px] font-mono text-[#5c5b5b]/60">{canvasWidth}x{canvasHeight}</span>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowShortcuts(!showShortcuts)} className="p-1.5 hover:bg-[#eae7e7] rounded-md text-[#5c5b5b] transition-colors" title="Shortcuts (?)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></svg>
          </button>
          <button onClick={saveDesign} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-[#6a37d4] to-[#9b59b6] text-white rounded-lg font-bold text-xs hover:opacity-90 transition-all shadow-lg shadow-purple-900/30">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
            Save
          </button>
        </div>
      </header>

      {/* BODY ROW: tool rail + left panel + canvas + right panel */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT TOOL RAIL — always visible, icon-only */}
        <aside className="flex-shrink-0 flex flex-col items-center py-3 gap-1 bg-white border-r border-[#afacac]/10 w-14 overflow-hidden">
          {[
            { id: 'select', icon: MousePointer2, label: 'Select', action: () => setActiveTool('select') },
            { id: 'square', icon: Square, label: 'Rectangle', action: () => { setActiveTool('square'); addElement('square'); } },
            { id: 'circle', icon: Circle, label: 'Circle', action: () => { setActiveTool('circle'); addElement('circle'); } },
            { id: 'text', icon: Type, label: 'Text', action: () => { setActiveTool('text'); addElement('text'); } },
            { id: 'pencil', icon: Pencil, label: 'Pencil', action: () => setActiveTool('pencil') },
            { id: 'image', icon: ImageIcon, label: 'Image', action: () => setActiveTool('image') },
          ].map(tool => (
            <button key={tool.id} onClick={tool.action} title={tool.label}
              className={`group relative w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150 ${activeTool === tool.id ? 'bg-[#6a37d4] text-white shadow-sm' : 'text-[#5c5b5b] hover:text-[#2f2e2e] hover:bg-[#eae7e7]'
                }`}
            >
              <tool.icon size={17} />
            </button>
          ))}
          <div className="w-6 h-px bg-[#afacac]/20 my-2" />
          <button className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5c5b5b] hover:text-[#2f2e2e] hover:bg-[#eae7e7] transition-all" title="Color Palette">
            <Palette size={17} />
          </button>
          <div className="flex-1" />
          <button
            onClick={() => setIsLeftSidebarCollapsed(v => !v)}
            title={isLeftSidebarCollapsed ? 'Show Layers Panel' : 'Hide Layers Panel'}
            className="w-10 h-10 flex items-center justify-center rounded-xl text-[#5c5b5b] hover:bg-[#eae7e7] transition-all"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duration-300 ${isLeftSidebarCollapsed ? '' : 'rotate-180'}`}>
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        </aside>

        {/* LEFT LAYERS PANEL */}
        <aside
          className="flex-shrink-0 flex flex-col bg-[#f9f6f5] border-r border-[#afacac]/10 overflow-hidden transition-[width] duration-300 ease-in-out"
          style={{ width: isLeftSidebarCollapsed ? 0 : 240 }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#afacac]/10 flex-shrink-0 min-w-[240px]">
            <span className="text-[11px] font-bold text-[#5c5b5b]/70 uppercase tracking-widest">Layers</span>
            <button onClick={() => addElement('square')} className="p-1 hover:bg-[#eae7e7] rounded-md text-[#5c5b5b] hover:text-[#2f2e2e] transition-all"><Plus size={13} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-0.5 scrollbar-hide min-w-[240px]">
            <div onClick={() => setIsEditingText(true)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white text-[#5c5b5b] hover:text-[#2f2e2e] cursor-pointer transition-all group">
              <Type size={12} className="text-[#6a37d4] flex-shrink-0" />
              <span className="text-xs font-medium truncate flex-1">Main Headline</span>
              <Eye size={10} className="opacity-0 group-hover:opacity-60 flex-shrink-0" />
            </div>
            {canvasElements.map((element) => (
              <div key={element.id} onClick={() => setSelectedElement(element.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-pointer transition-all group ${selectedElement === element.id ? 'bg-[#6a37d4]/10 text-[#6a37d4] border border-[#6a37d4]/20' : 'hover:bg-white text-[#5c5b5b] hover:text-[#2f2e2e]'
                  }`}
              >
                {element.type === 'square' && <Square size={12} className="flex-shrink-0" style={{ color: element.color }} />}
                {element.type === 'circle' && <Circle size={12} className="flex-shrink-0" style={{ color: element.color }} />}
                {element.type === 'text' && <Type size={12} className="flex-shrink-0" style={{ color: element.color }} />}
                <span className="text-xs font-medium truncate flex-1 capitalize">{element.type}</span>
                <div className="w-3 h-3 rounded-sm flex-shrink-0 border border-[#afacac]/20" style={{ backgroundColor: element.color }} />
              </div>
            ))}
            {canvasElements.length === 0 && (
              <div className="px-3 py-8 text-center">
                <p className="text-[11px] text-[#5c5b5b]/50 leading-relaxed">No elements yet.<br />Use tools or AI chat.</p>
              </div>
            )}
          </div>
          
          <div className="border-t border-[#afacac]/10 px-3 py-3 space-y-2 flex-shrink-0 min-w-[240px]">
            <span className="text-[11px] font-bold text-[#5c5b5b]/70 uppercase tracking-widest">Monetization</span>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#2f2e2e]">Premium Asset</p>
                <p className="text-[10px] text-[#5c5b5b]">List on Marketplace</p>
              </div>
              <button onClick={() => setIsPremium(!isPremium)}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors flex-shrink-0 ${isPremium ? 'bg-[#6a37d4]' : 'bg-[#e5e2e1]'}`}>
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isPremium ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
            {isPremium && (
              <div className="relative mt-2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5c5b5b]/60 font-bold text-sm">$</span>
                <input value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-white border border-[#afacac]/20 rounded-lg pl-7 pr-3 py-2 text-sm font-bold text-[#2f2e2e] focus:outline-none focus:ring-1 focus:ring-[#6a37d4]/50 shadow-sm"
                  type="text" />
              </div>
            )}
          </div>
        </aside>

        {/* CANVAS WORKSPACE */}
        <main
          className="flex-1 overflow-auto relative"
          style={{ background: '#f3f0ef', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.06) 1px, transparent 0)', backgroundSize: '24px 24px' }}
        >

          {/* AI Concept Modal */}
          <AnimatePresence>
            {aiConcept && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-8">
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                  className="bg-white border border-[#afacac]/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative">
                  <button onClick={() => setAiConcept(null)} className="absolute top-4 right-4 p-1.5 hover:bg-[#eae7e7] rounded-lg text-[#5c5b5b] hover:text-[#2f2e2e] transition-colors"><X size={18} /></button>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] flex items-center justify-center shadow-lg">
                      <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#2f2e2e]">AI Generated Concept</h3>
                      {IS_REAL_AI && <p className="text-[11px] text-[#6a37d4] font-medium">Powered by Gemini</p>}
                    </div>
                  </div>
                  <div className="bg-[#f9f6f5] rounded-xl p-5 max-h-[380px] overflow-y-auto scrollbar-hide border border-[#afacac]/10">
                    <pre className="whitespace-pre-wrap font-sans text-sm text-[#5c5b5b] leading-relaxed">{aiConcept}</pre>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button onClick={handleApplyToCanvas} className="flex-1 py-3 bg-gradient-to-r from-[#6a37d4] to-[#ae8dff] text-white rounded-xl font-bold text-sm shadow-md hover:opacity-90 transition-all">Apply to Canvas</button>
                    <button onClick={() => handleGenerateConcept()} className="flex-1 py-3 bg-white border border-[#afacac]/20 text-[#5c5b5b] hover:text-[#2f2e2e] rounded-xl font-bold text-sm hover:bg-[#eae7e7] transition-all">Regenerate</button>
                    <button onClick={() => setAiConcept(null)} className="px-5 py-3 bg-white border border-[#afacac]/20 text-[#5c5b5b] hover:text-[#2f2e2e] rounded-xl font-bold text-sm hover:bg-[#eae7e7] transition-all">Close</button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shortcuts Modal */}
          <AnimatePresence>
            {showShortcuts && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-8"
                onClick={() => setShowShortcuts(false)}>
                <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
                  className="bg-white border border-[#afacac]/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowShortcuts(false)} className="absolute top-4 right-4 p-1.5 hover:bg-[#eae7e7] rounded-lg text-[#5c5b5b] hover:text-[#2f2e2e] transition-colors"><X size={18} /></button>
                  <div className="flex items-center gap-3 mb-6"><h3 className="font-bold text-lg text-[#2f2e2e]">Keyboard Shortcuts</h3></div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[10px] font-bold text-[#5c5b5b]/70 uppercase tracking-widest mb-3">Editing</h4>
                      <div className="space-y-2">
                        {[['Ctrl+Z', 'Undo'], ['Ctrl+Shift+Z', 'Redo'], ['Ctrl+C', 'Copy'], ['Ctrl+V', 'Paste'], ['Ctrl+D', 'Duplicate'], ['Del', 'Delete'], ['Esc', 'Deselect']].map(([k, a]) => (
                          <div key={k} className="flex items-center justify-between text-xs">
                            <span className="text-[#5c5b5b]">{a}</span>
                            <kbd className="px-2 py-0.5 bg-[#f3f0ef] rounded text-[10px] font-mono text-[#5c5b5b] border border-[#afacac]/20">{k}</kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold text-[#5c5b5b]/70 uppercase tracking-widest mb-3">View</h4>
                      <div className="space-y-2">
                        {[['Ctrl++', 'Zoom In'], ['Ctrl+-', 'Zoom Out'], ['Ctrl+0', 'Reset Zoom'], ['?', 'Shortcuts'], ['Ctrl+S', 'Save']].map(([k, a]) => (
                          <div key={k} className="flex items-center justify-between text-xs">
                            <span className="text-[#5c5b5b]">{a}</span>
                            <kbd className="px-2 py-0.5 bg-[#f3f0ef] rounded text-[10px] font-mono text-[#5c5b5b] border border-[#afacac]/20">{k}</kbd>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Centered canvas */}
          <div className="flex items-start justify-center min-h-full pt-12 pb-16 px-12">
            <div
              className="relative flex-shrink-0"
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
              <div
                className="relative bg-white overflow-hidden"
                style={{ width: canvasWidth * zoom / 100, height: canvasHeight * zoom / 100, boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)' }}
                onContextMenu={(e) => { e.preventDefault(); setContextMenu({ x: e.clientX, y: e.clientY }); }}
              >
                {canvasElements.length === 0 && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 select-none pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-[#f3f0ef] flex items-center justify-center">
                      <Sparkles size={22} className="text-[#6a37d4]/40" />
                    </div>
                    <p className="text-sm font-medium text-neutral-400">Describe a design in the AI Generator</p>
                    <p className="text-xs text-neutral-300">or use the tools to add shapes</p>
                  </div>
                )}

                {canvasElements.map((element) => (
                  <motion.div
                    key={element.id}
                    drag={!isResizing}
                    dragMomentum={false}
                    onDragEnd={(e, info) => {
                      const newElements = canvasElements.map(el =>
                        el.id === element.id ? { ...el, x: element.x + info.offset.x, y: element.y + info.offset.y } : el
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
                    {element.type === 'square' && <div className="w-full h-full rounded-md" style={{ backgroundColor: element.color }} />}
                    {element.type === 'circle' && <div className="w-full h-full rounded-full" style={{ backgroundColor: element.color }} />}
                    {element.type === 'text' && <div className="w-full h-full flex items-center justify-center text-center font-bold text-sm" style={{ color: element.color }}>{element.text}</div>}

                    {selectedElement === element.id && (
                      <div className="absolute inset-0 border-2 border-[#6a37d4] rounded-sm pointer-events-none">
                        {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(handle => (
                          <div key={handle} className="absolute w-2.5 h-2.5 bg-white border-2 border-[#6a37d4] rounded-sm"
                            style={{
                              top: handle.includes('n') ? '-5px' : handle.includes('s') ? 'calc(100% - 5px)' : 'calc(50% - 5px)',
                              left: handle.includes('w') ? '-5px' : handle.includes('e') ? 'calc(100% - 5px)' : 'calc(50% - 5px)',
                              cursor: `${handle}-resize`, pointerEvents: 'all'
                            }}
                            onPointerDown={(e) => handleResizeStart(e, handle, element.id)}
                          />
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Canvas resize handles */}
              <div className="absolute top-0 right-0 w-3 cursor-ew-resize flex items-center justify-center group" style={{ height: canvasHeight * zoom / 100 }}
                onMouseDown={(e) => { e.preventDefault(); setIsResizingCanvas(true); setCanvasResizeDir('e'); canvasResizeStart.current = { x: e.clientX, y: e.clientY, w: canvasWidth, h: canvasHeight }; }}>
                <div className="w-1 h-8 bg-[#2f2e2e]/20 rounded-full group-hover:bg-[#6a37d4] transition-colors" />
              </div>
              <div className="absolute bottom-0 left-0 h-3 cursor-ns-resize flex items-center justify-center group" style={{ width: canvasWidth * zoom / 100 }}
                onMouseDown={(e) => { e.preventDefault(); setIsResizingCanvas(true); setCanvasResizeDir('s'); canvasResizeStart.current = { x: e.clientX, y: e.clientY, w: canvasWidth, h: canvasHeight }; }}>
                <div className="h-1 w-8 bg-[#2f2e2e]/20 rounded-full group-hover:bg-[#6a37d4] transition-colors" />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
                onMouseDown={(e) => { e.preventDefault(); setIsResizingCanvas(true); setCanvasResizeDir('se'); canvasResizeStart.current = { x: e.clientX, y: e.clientY, w: canvasWidth, h: canvasHeight }; }}>
                <div className="w-3 h-3 border-r-2 border-b-2 border-[#2f2e2e]/30 rounded-br-sm hover:border-[#6a37d4] transition-colors absolute bottom-0 right-0" />
              </div>
            </div>
          </div>

          {/* Context Menu */}
          {contextMenu && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="fixed bg-white border border-[#afacac]/10 rounded-xl shadow-2xl py-1.5 min-w-[180px] z-50"
              style={{ left: contextMenu.x, top: contextMenu.y }} onContextMenu={(e) => e.preventDefault()}>
              {contextMenu.element ? (
                <>
                  <button onClick={() => { const el = canvasElements.find(e => e.id === contextMenu.element!.id); if (el) copyElement(el); }} className="w-full px-4 py-2 text-left text-sm text-[#5c5b5b] hover:bg-[#eae7e7] hover:text-[#2f2e2e] flex items-center gap-3 transition-colors">
                    <Copy size={14} className="text-[#5c5b5b]/50" /> Copy <span className="ml-auto text-[10px] text-[#5c5b5b]/50">Ctrl+C</span>
                  </button>
                  <button onClick={() => { const el = canvasElements.find(e => e.id === contextMenu.element!.id); if (el) duplicateElement(el); }} className="w-full px-4 py-2 text-left text-sm text-[#5c5b5b] hover:bg-[#eae7e7] hover:text-[#2f2e2e] flex items-center gap-3 transition-colors">
                    <Files size={14} className="text-[#5c5b5b]/50" /> Duplicate <span className="ml-auto text-[10px] text-[#5c5b5b]/50">Ctrl+D</span>
                  </button>
                  <div className="h-px bg-[#afacac]/10 my-1" />
                  <button onClick={() => deleteElement(contextMenu.element!.id)} className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-red-50 flex items-center gap-3 transition-colors">
                    <Trash2 size={14} className="text-red-400" /> Delete <span className="ml-auto text-[10px] text-red-400">Del</span>
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => { pasteElement(); setContextMenu(null); }} disabled={!copiedElement} className="w-full px-4 py-2 text-left text-sm text-[#5c5b5b] hover:bg-[#eae7e7] hover:text-[#2f2e2e] flex items-center gap-3 transition-colors disabled:opacity-30">
                    <Copy size={14} className="text-[#5c5b5b]/50" /> Paste <span className="ml-auto text-[10px] text-[#5c5b5b]/50">Ctrl+V</span>
                  </button>
                  <div className="h-px bg-[#afacac]/10 my-1" />
                  <button onClick={() => { addElement('square'); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[#5c5b5b] hover:bg-[#eae7e7] hover:text-[#2f2e2e] flex items-center gap-3 transition-colors">
                    <Square size={13} className="text-[#5c5b5b]/50" /> Add Rectangle
                  </button>
                  <button onClick={() => { addElement('circle'); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[#5c5b5b] hover:bg-[#eae7e7] hover:text-[#2f2e2e] flex items-center gap-3 transition-colors">
                    <Circle size={13} className="text-[#5c5b5b]/50" /> Add Circle
                  </button>
                  <button onClick={() => { addElement('text'); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[#5c5b5b] hover:bg-[#eae7e7] hover:text-[#2f2e2e] flex items-center gap-3 transition-colors">
                    <Type size={13} className="text-[#5c5b5b]/50" /> Add Text
                  </button>
                </>
              )}
            </motion.div>
          )}
        </main>

        {/* RIGHT PANEL — width-animated */}
        <aside
          className="flex-shrink-0 flex flex-col bg-[#f9f6f5] border-l border-[#afacac]/10 overflow-hidden transition-[width] duration-300 ease-in-out relative text-[#2f2e2e]"
          style={{ width: isRightSidebarCollapsed ? 0 : 320 }}
        >
          <button
            onClick={() => setIsRightSidebarCollapsed(v => !v)}
            title={isRightSidebarCollapsed ? 'Show AI Panel' : 'Collapse Panel'}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-50 flex flex-col items-center justify-center w-5 h-16 bg-[#f9f6f5] border border-[#afacac]/10 border-r-0 rounded-l-lg text-[#5c5b5b] hover:text-[#2f2e2e] hover:bg-[#eae7e7] transition-all shadow-xl"
            style={{ borderRight: 'none' }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-300 ${isRightSidebarCollapsed ? 'rotate-180' : ''}`}>
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="flex flex-shrink-0 border-b border-[#afacac]/10 min-w-[320px]">
            <button onClick={() => setRightPanelTab('properties')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold transition-all ${rightPanelTab === 'properties' ? 'text-[#2f2e2e] border-b-2 border-[#6a37d4]' : 'text-[#5c5b5b]/70 hover:text-[#2f2e2e]'}`}>
              <Layers size={13} /> Properties
            </button>
            <button onClick={() => setRightPanelTab('chat')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-3 text-xs font-bold transition-all ${rightPanelTab === 'chat' ? 'text-[#2f2e2e] border-b-2 border-[#6a37d4]' : 'text-[#5c5b5b]/70 hover:text-[#2f2e2e]'}`}>
              <Sparkles size={13} /> AI Chat
              {IS_REAL_AI && <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />}
            </button>
            <button onClick={() => setIsRightSidebarCollapsed(v => !v)} className="px-3 text-[#5c5b5b]/50 hover:text-[#2f2e2e] transition-colors" title="Collapse">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          </div>

          {rightPanelTab === 'properties' && (
            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 scrollbar-hide min-w-[320px]">
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-[#2f2e2e]">Properties</h3>
                  <span className="text-[10px] font-bold text-[#6a37d4] bg-[#6a37d4]/10 border border-[#6a37d4]/20 px-2 py-0.5 rounded">TEXT LAYER</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-5">
                  {[['Width', '480'], ['Height', '120']].map(([label, val]) => (
                    <div key={label} className="space-y-1">
                      <label className="text-[10px] font-bold text-[#5c5b5b]/70 uppercase">{label}</label>
                      <div className="flex items-center px-3 py-2 bg-white border border-[#afacac]/10 rounded-lg">
                        <input className="w-full bg-transparent border-none p-0 text-xs font-bold text-[#2f2e2e] focus:outline-none" type="text" defaultValue={val} />
                        <span className="text-[10px] text-[#5c5b5b]/50">PX</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-[#5c5b5b]/70 uppercase">Font Family</label>
                    <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#afacac]/10 rounded-lg cursor-pointer hover:bg-[#eae7e7]">
                      <span className="text-sm font-serif font-bold text-[#2f2e2e]">Noto Serif</span>
                      <ChevronDown size={13} className="text-[#5c5b5b]/70" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[['Weight', 'Black 900'], ['Size', '52 PT']].map(([label, val]) => (
                      <div key={label} className="space-y-1">
                        <label className="text-[10px] font-bold text-[#5c5b5b]/70 uppercase">{label}</label>
                        <div className="flex items-center justify-between px-3 py-2 bg-white border border-[#afacac]/10 rounded-lg cursor-pointer hover:bg-[#eae7e7]">
                          <span className="text-xs font-medium text-[#5c5b5b]">{val}</span>
                          <ChevronDown size={13} className="text-[#5c5b5b]/70" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <section className="border-t border-[#afacac]/10 pt-5">
                <p className="text-[10px] uppercase tracking-widest text-[#5c5b5b]/70 font-bold mb-4">Appearance</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#5c5b5b]">Opacity</span>
                    <div className="flex items-center gap-3 w-32">
                      <div className="h-1 flex-1 bg-[#afacac]/20 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-[#6a37d4]" />
                      </div>
                      <span className="text-[10px] font-bold text-[#5c5b5b]">100%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#5c5b5b]">Fill</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-[#5c5b5b]/70">#2F2E2E</span>
                      <div className="w-6 h-6 rounded-md bg-[#2f2e2e] border border-[#afacac]/20 cursor-pointer shadow-sm" />
                    </div>
                  </div>
                </div>
              </section>
              {currentColorPalette && (
                <section className="border-t border-[#afacac]/10 pt-5">
                  <ColorThemePanel palette={currentColorPalette} onClose={() => setCurrentColorPalette(null)} />
                </section>
              )}
              
              {/* AI Generator Integration in Properties panel as a quick action */}
              <section className="border-t border-[#afacac]/10 pt-5">
                <p className="text-[10px] uppercase tracking-widest text-[#5c5b5b]/70 font-bold mb-4">AI Generator</p>
                <div className="space-y-2">
                  <textarea
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (!isGenerating) handleGenerateConcept(); } }}
                    placeholder="Describe your design... e.g. 'A futuristic neon city poster'"
                    rows={3}
                    className="w-full text-[12px] bg-white border border-[#afacac]/10 rounded-xl p-3 resize-none focus:outline-none focus:ring-1 focus:ring-[#6a37d4]/50 placeholder:text-[#5c5b5b]/50 text-[#2f2e2e] leading-relaxed shadow-sm"
                  />
                  <button onClick={() => handleGenerateConcept()} disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-[#6a37d4] to-[#ae8dff] text-white rounded-xl font-bold text-xs hover:opacity-90 transition-all disabled:opacity-50 shadow-sm shadow-[#6a37d4]/20"
                  >
                    {isGenerating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    {isGenerating ? 'Generating...' : 'Generate Concept'}
                  </button>
                </div>
              </section>
            </div>
          )}

          {rightPanelTab === 'chat' && (
            <div className="flex-1 flex flex-col overflow-hidden min-w-[320px]">
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">
                {chatMessages.map((msg) => (
                  <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
                    className={`flex gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    {msg.sender === 'bot' && (
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6a37d4] to-[#9b59b6] flex-shrink-0 flex items-center justify-center text-white self-end shadow-lg">
                        <Sparkles size={12} />
                      </div>
                    )}
                    <div className={`max-w-[85%] ${msg.sender === 'user' ? 'ml-auto' : ''}`}>
                      <div className={`px-3 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.sender === 'user'
                          ? 'bg-gradient-to-br from-[#6a37d4] to-[#9b59b6] text-white rounded-br-md shadow-lg'
                          : 'bg-white border border-[#afacac]/10 text-[#2f2e2e] rounded-bl-md'
                        }`}>
                        <p className="whitespace-pre-wrap">{msg.text}</p>
                      </div>
                      <span className={`text-[9px] text-[#5c5b5b]/70 mt-0.5 block ${msg.sender === 'user' ? 'text-right' : ''}`}>{msg.time}</span>
                    </div>
                  </motion.div>
                ))}
                {isBotTyping && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#6a37d4] to-[#9b59b6] flex-shrink-0 flex items-center justify-center text-white self-end">
                      <Sparkles size={12} className="animate-pulse" />
                    </div>
                    <div className="bg-white border border-[#afacac]/10 px-4 py-3 rounded-2xl rounded-bl-md">
                      <div className="flex gap-1">
                        {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="flex gap-1.5 px-4 py-2 overflow-x-auto scrollbar-hide flex-shrink-0 border-t border-[#afacac]/10 bg-[#f3f0ef]">
                {[
                  { label: 'Generate', cmd: 'generate a minimalist poster design', icon: Sparkles },
                  { label: 'Square', cmd: 'add a blue square', icon: Square },
                  { label: 'Circle', cmd: 'add a red circle', icon: Circle },
                  { label: 'Text', cmd: 'add text saying Hello', icon: Type },
                  { label: 'Delete', cmd: 'delete selected', icon: Trash2 },
                  { label: 'Help', cmd: 'help', icon: HelpCircle },
                ].map((chip) => (
                  <button key={chip.label}
                    onClick={() => {
                      const userMsg = { id: Date.now(), text: chip.cmd, sender: 'user' as const, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                      setChatMessages(prev => [...prev, userMsg]);
                      setIsBotTyping(true);
                      setChatInput('');
                      setTimeout(() => {
                        const { command, response } = parseStudioCommand(chip.cmd);
                        executeCommand(command);
                        const botMsg = { id: Date.now() + 1, text: response, sender: 'bot' as const, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
                        setChatMessages(prev => [...prev, botMsg]);
                        setIsBotTyping(false);
                      }, 400 + Math.random() * 400);
                    }}
                    className="flex items-center gap-1 flex-shrink-0 px-2.5 py-1.5 text-[10px] font-bold bg-white border border-[#afacac]/10 rounded-full hover:border-[#6a37d4]/40 hover:text-[#6a37d4] text-[#5c5b5b] transition-all whitespace-nowrap"
                  >
                    <chip.icon size={10} />
                    {chip.label}
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-[#afacac]/10 flex-shrink-0 bg-[#f9f6f5]">
                <div className="flex items-center gap-2 bg-white border border-[#afacac]/20 rounded-xl px-3 py-1.5 focus-within:border-[#6a37d4]/40 transition-all">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); handleChatSend(); } }}
                    placeholder='Try "generate a sunset poster"...'
                    className="flex-1 bg-transparent border-none focus:outline-none text-xs font-medium placeholder:text-[#5c5b5b]/50 text-[#2f2e2e] py-1.5"
                  />
                  <button onClick={handleChatSend} disabled={!chatInput.trim()}
                    className="w-7 h-7 flex items-center justify-center bg-gradient-to-br from-[#6a37d4] to-[#9b59b6] text-white rounded-lg shadow-md active:scale-95 transition-all disabled:opacity-30 flex-shrink-0">
                    <Send size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
