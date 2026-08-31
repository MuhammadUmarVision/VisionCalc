import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Trash2, 
  Copy, 
  Check, 
  ArrowUpLeft, 
  Pin, 
  Clock, 
  Download,
  Calendar
} from 'lucide-react';
import { CalculationRecord } from '../../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationRecord[];
  onSelectRecord: (record: CalculationRecord) => void;
  onClearHistory: () => void;
  onTogglePinRecord: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectRecord,
  onClearHistory,
  onTogglePinRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.expression.toLowerCase().includes(query) ||
      item.result.toLowerCase().includes(query) ||
      (item.originalInput && item.originalInput.toLowerCase().includes(query)) ||
      item.formattedTime.toLowerCase().includes(query) ||
      (item.notes && item.notes.toLowerCase().includes(query))
    );
  });

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleExportHistory = () => {
    const content = history
      .map(
        (h) =>
          `[${new Date(h.timestamp).toLocaleString()}] (${h.angleMode})\n${h.originalInput ? `Input: ${h.originalInput}\n` : ''}Expression: ${h.expression} = ${h.result}\n`
      )
      .join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `VisionCalc_History_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Calculation History</h2>
              <p className="text-xs text-slate-500">{history.length} saved equations</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {history.length > 0 && (
              <>
                <button
                  onClick={handleExportHistory}
                  className="p-1.5 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  title="Export History (.txt)"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={onClearHistory}
                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                  title="Clear All History"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex-shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search equations, answers, timestamps..."
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filteredHistory.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Clock className="w-10 h-10 stroke-[1.2] text-slate-300 dark:text-slate-700 mb-2" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {searchQuery ? 'No calculations match your search' : 'No calculations yet'}
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                {searchQuery ? 'Try another keyword or clear the search' : 'Perform calculations in the scientific keypad and they will automatically appear here.'}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className={`p-3 rounded-xl border transition-all relative group bg-white dark:bg-slate-900/90 hover:shadow-md ${
                  item.isPinned
                    ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Meta info row */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {item.formattedTime}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-600 dark:text-slate-300">
                      {item.angleMode}
                    </span>
                    <button
                      onClick={() => onTogglePinRecord(item.id)}
                      className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 ${
                        item.isPinned ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'
                      }`}
                      title={item.isPinned ? 'Unpin' : 'Pin to top'}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Spoken / Original Query if different */}
                {item.originalInput && item.originalInput.toLowerCase() !== item.expression.toLowerCase() && (
                  <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mb-1 truncate">
                    "{item.originalInput}"
                  </div>
                )}

                {/* Expression */}
                <div className="font-mono text-xs text-slate-600 dark:text-slate-400 overflow-x-auto whitespace-pre-wrap break-all pr-12">
                  {item.expression} =
                </div>

                {/* Result */}
                <div className="font-mono text-lg font-bold text-slate-900 dark:text-white mt-0.5 tracking-tight break-all">
                  {item.result}
                </div>

                {/* Card Quick Actions */}
                <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1">
                  <button
                    onClick={() => handleCopy(item.id, item.result)}
                    className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded flex items-center gap-1 transition-colors"
                    title="Copy Result"
                  >
                    {copiedId === item.id ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectRecord(item);
                      onClose();
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded flex items-center gap-1 transition-colors"
                    title="Load back into Calculator"
                  >
                    <ArrowUpLeft className="w-3 h-3" />
                    <span>Insert</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
