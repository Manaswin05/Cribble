/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState } from 'react';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { ExplorePage } from './pages/ExplorePage';
import { SavedPage } from './pages/SavedPage';
import { StudioPage } from './pages/StudioPage';
import { MessagesPage } from './pages/MessagesPage';
import type { Tab } from './types';

// Simple Error Boundary
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Cribble Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#f9f6f5]">
          <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md border border-red-100">
            <h2 className="text-red-500 font-bold text-xl mb-4">Something went wrong</h2>
            <p className="text-[#5c5b5b] mb-6">We've encountered an unexpected error. Please refresh the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-[#6a37d4] text-white rounded-lg font-bold hover:bg-[#582cb5] transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('studio');

  return (
    <ErrorBoundary>
      <div className="font-sans min-h-screen bg-[#f9f6f5] flex flex-col selection:bg-[#6a37d4]/20 selection:text-[#6a37d4]">
        {/* The Studio page handles its own top bar, but other pages might need the Header */}
        {activeTab !== 'studio' && <Header activeTab={activeTab} setActiveTab={setActiveTab} />}
        
        {/* Render the active page */}
        {activeTab === 'home' && <HomePage />}
        {activeTab === 'explore' && <ExplorePage />}
        {activeTab === 'saved' && <SavedPage />}
        {activeTab === 'studio' && (
          <div className="flex-1 relative z-20">
            {/* The studio header is inside StudioPage, but we want the main nav Header to still be accessible or we hide it for fullscreen focus. 
                For now, let's include the main nav Header in the studio but maybe it overlaps. 
                Wait, StudioPage has its own specific toolbar in the previous App.tsx. 
                Let's keep the main Header visible so users can navigate away. */}
            <Header activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="pt-16 h-screen">
              <StudioPage />
            </div>
          </div>
        )}
        {activeTab === 'messages' && <MessagesPage />}
      </div>
    </ErrorBoundary>
  );
}

export default App;
