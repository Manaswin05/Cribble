/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import {
  Video, Phone, MoreVertical, Send, Paperclip, Smile,
  Upload, Palette, Sparkles, Bookmark, User,
} from 'lucide-react';
import { TopBar } from '../components/TopBar';
import { getAIAssistantResponse } from '../services/geminiService';
import type { PageProps, ChatMessage } from '../types';

export const MessagesPage = ({ isSidebarCollapsed, onToggleSidebar }: PageProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, text: "Hi Sarah! I've been reviewing your latest portfolio additions. The 'Ethereal Flow' series is exactly what we're looking for our Spring exhibition.", sender: 'bot', time: '10:42 AM' },
    { id: 2, text: "Thank you, Julian! I'm glad you liked them. I've been experimenting with some digital oil textures lately to give them more depth.", sender: 'user', time: '10:45 AM' },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const newMessage: ChatMessage = { id: Date.now(), text: inputText, sender: 'user', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMessage]);
    const savedInput = inputText;
    setInputText("");

    if (savedInput.toLowerCase().startsWith("/ai")) {
      setIsAiTyping(true);
      const aiResponse = await getAIAssistantResponse(savedInput.replace("/ai", "").trim());
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
              <button className="p-2 hover:bg-[#f3f0ef] rounded-lg text-[#5c5b5b]" aria-label="Video call"><Video size={20} /></button>
              <button className="p-2 hover:bg-[#f3f0ef] rounded-lg text-[#5c5b5b]" aria-label="Voice call"><Phone size={20} /></button>
              <button className="p-2 hover:bg-[#f3f0ef] rounded-lg text-[#5c5b5b]" aria-label="More options"><MoreVertical size={20} /></button>
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
                  <button className="p-2 text-[#5c5b5b]" aria-label="Add emoji"><Smile size={20} /></button>
                  <button className="p-2 text-[#5c5b5b]" aria-label="Attach file"><Paperclip size={20} /></button>
                  <button 
                    onClick={handleSendMessage}
                    className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white rounded-xl shadow-lg active:scale-95 transition-transform"
                    aria-label="Send message"
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
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e5e2e1] text-[#5c5b5b]" aria-label="View profile"><User size={18} /></button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#e5e2e1] text-[#5c5b5b]" aria-label="Save contact"><Bookmark size={18} /></button>
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
                  <img key={i} className="w-full aspect-square object-cover rounded-lg cursor-pointer" src={`https://picsum.photos/seed/media${i}/100/100`} alt={`Shared media ${i}`} referrerPolicy="no-referrer" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
