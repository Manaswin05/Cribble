/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// --- Navigation ---
export type Tab = 'home' | 'explore' | 'saved' | 'studio' | 'messages';

// --- Canvas Elements ---
export type ElementType = 'square' | 'circle' | 'text';

export interface CanvasElement {
  id: number;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

// --- Chat ---
export interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'bot' | 'ai';
  time: string;
}

// --- Context Menu ---
export interface ContextMenuState {
  x: number;
  y: number;
  element?: CanvasElement;
}

// --- Common Props ---
export interface PageProps {
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}
