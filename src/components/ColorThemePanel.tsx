import React, { useState } from 'react';
import { X, Copy, Check, Download, Palette, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ColorPalette } from '../services/colorThemeService';
import { exportPaletteAsCSS, exportPaletteAsTailwind, exportPaletteAsJSON } from '../services/colorThemeService';

interface ColorThemePanelProps {
  palette: ColorPalette;
  onClose: () => void;
}

export const ColorThemePanel: React.FC<ColorThemePanelProps> = ({ palette, onClose }) => {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'json'>('css');

  const displayColors = themeMode === 'light' 
    ? (palette.lightTheme || palette.colors) 
    : (palette.darkTheme || palette.colors);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(label);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleExport = () => {
    let content = '';
    let filename = '';
    
    switch (exportFormat) {
      case 'css':
        content = exportPaletteAsCSS(palette, themeMode);
        filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-${themeMode}.css`;
        break;
      case 'tailwind':
        content = exportPaletteAsTailwind(palette);
        filename = `tailwind.config.js`;
        break;
      case 'json':
        content = exportPaletteAsJSON(palette);
        filename = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.json`;
        break;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] rounded-lg">
                <Palette size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-serif font-bold text-[#2f2e2e]">{palette.name}</h2>
                <p className="text-sm text-[#5c5b5b]">{palette.description}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-[#5c5b5b]" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Theme Mode Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-[#2f2e2e] mb-1">Theme Mode</h3>
                <p className="text-xs text-[#5c5b5b]">Switch between light and dark variants</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setThemeMode('light')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    themeMode === 'light'
                      ? 'bg-[#6a37d4] text-white'
                      : 'bg-gray-100 text-[#5c5b5b] hover:bg-gray-200'
                  }`}
                >
                  <Sun size={16} />
                  Light
                </button>
                <button
                  onClick={() => setThemeMode('dark')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                    themeMode === 'dark'
                      ? 'bg-[#6a37d4] text-white'
                      : 'bg-gray-100 text-[#5c5b5b] hover:bg-gray-200'
                  }`}
                >
                  <Moon size={16} />
                  Dark
                </button>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <h3 className="font-bold text-[#2f2e2e] mb-3">Color Palette</h3>
              <div className="grid grid-cols-5 gap-3">
                {displayColors.map((color, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className="group cursor-pointer"
                    onClick={() => copyToClipboard(color, color)}
                  >
                    <div
                      className="aspect-square rounded-xl shadow-md mb-2 relative overflow-hidden"
                      style={{ backgroundColor: color }}
                    >
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        {copiedColor === color ? (
                          <Check size={20} className="text-white" />
                        ) : (
                          <Copy size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs font-mono text-center text-[#5c5b5b] group-hover:text-[#6a37d4] transition-colors">
                      {color}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Mood & Use Cases */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f9f6f5] rounded-xl p-4">
                <h3 className="font-bold text-[#2f2e2e] mb-2 text-sm">Mood</h3>
                <p className="text-sm text-[#5c5b5b]">{palette.mood}</p>
              </div>
              <div className="bg-[#f9f6f5] rounded-xl p-4">
                <h3 className="font-bold text-[#2f2e2e] mb-2 text-sm">Best For</h3>
                <div className="flex flex-wrap gap-1">
                  {palette.useCases.map((useCase, index) => (
                    <span
                      key={index}
                      className="text-xs bg-white px-2 py-1 rounded-full text-[#5c5b5b]"
                    >
                      {useCase}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div>
              <h3 className="font-bold text-[#2f2e2e] mb-3">Live Preview</h3>
              <div
                className="rounded-xl p-6 shadow-inner"
                style={{ backgroundColor: displayColors[0] }}
              >
                <div
                  className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg"
                  style={{ borderLeft: `4px solid ${displayColors[2]}` }}
                >
                  <h4
                    className="font-bold text-lg mb-2"
                    style={{ color: displayColors[4] || displayColors[3] }}
                  >
                    Sample Heading
                  </h4>
                  <p className="text-sm mb-3" style={{ color: displayColors[3] }}>
                    This is how your content might look with this color palette applied.
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg text-white font-semibold text-sm"
                    style={{ backgroundColor: displayColors[2] }}
                  >
                    Call to Action
                  </button>
                </div>
              </div>
            </div>

            {/* Export Section */}
            <div>
              <h3 className="font-bold text-[#2f2e2e] mb-3">Export Palette</h3>
              <div className="flex gap-2 mb-3">
                {(['css', 'tailwind', 'json'] as const).map((format) => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      exportFormat === format
                        ? 'bg-[#6a37d4] text-white'
                        : 'bg-gray-100 text-[#5c5b5b] hover:bg-gray-200'
                    }`}
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                onClick={handleExport}
                className="w-full bg-gradient-to-br from-[#6a37d4] to-[#ae8dff] text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all"
              >
                <Download size={18} />
                Download as {exportFormat.toUpperCase()}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
