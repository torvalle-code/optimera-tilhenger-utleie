'use client';

import React, { useState, useCallback } from 'react';
import { InspectionItem, InspectionCategory } from '@/lib/types';
import { INSPECTION_CATEGORIES } from '@/lib/constants';

interface InspectionChecklistProps {
  items: InspectionItem[];
  onItemUpdate: (itemId: string, update: Partial<InspectionItem>) => void;
  title: string;
  mode: 'pickup' | 'return';
}

const STATUS_CONFIG = {
  ok: { label: 'OK', color: 'bg-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  minor_damage: { label: 'Merknad', color: 'bg-yellow-500', bg: 'bg-yellow-50', border: 'border-yellow-200' },
  major_damage: { label: 'Skade', color: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200' },
  not_applicable: { label: 'N/A', color: 'bg-gray-400', bg: 'bg-gray-50', border: 'border-gray-200' },
} as const;

export function InspectionChecklist({ items, onItemUpdate, title, mode }: InspectionChecklistProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(INSPECTION_CATEGORIES.map(c => c.id))
  );
  const [activeItemId, setActiveItemId] = useState<string | null>(null);

  const checkedCount = items.filter(i => i.checked).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const toggleCategory = useCallback((catId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) next.delete(catId);
      else next.add(catId);
      return next;
    });
  }, []);

  const handleStatusSelect = useCallback((itemId: string, status: InspectionItem['status']) => {
    onItemUpdate(itemId, { checked: true, status });
    if (status === 'ok' || status === 'not_applicable') {
      setActiveItemId(null);
    }
  }, [onItemUpdate]);

  const getCategoryItems = (catId: string) => items.filter(i => i.category === catId);

  return (
    <div className="space-y-3">
      {/* Header + progress */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="mt-2 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-2 bg-[#E52629] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">
            {checkedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Categories */}
      {INSPECTION_CATEGORIES.map(cat => {
        const catItems = getCategoryItems(cat.id);
        const catChecked = catItems.filter(i => i.checked).length;
        const isExpanded = expandedCategories.has(cat.id);
        const hasDamage = catItems.some(i => i.status === 'minor_damage' || i.status === 'major_damage');

        return (
          <div key={cat.id} className={`rounded-xl border ${hasDamage ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-white'}`}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat.id)}
              className="w-full flex items-center justify-between p-4 min-h-[56px]"
            >
              <div className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                  className={`transition-transform ${isExpanded ? 'rotate-90' : ''}`}>
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <span className="font-semibold text-gray-900">{cat.label}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                catChecked === catItems.length ? 'bg-green-100 text-green-800' :
                catChecked > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-500'
              }`}>
                {catChecked}/{catItems.length}
              </span>
            </button>

            {/* Items */}
            {isExpanded && (
              <div className="border-t border-gray-100 divide-y divide-gray-50">
                {catItems.map(item => {
                  const config = item.checked ? STATUS_CONFIG[item.status] : null;
                  const isActive = activeItemId === item.id;

                  return (
                    <div key={item.id} className="px-4 py-2">
                      {/* Item row */}
                      <button
                        onClick={() => {
                          if (!item.checked) {
                            setActiveItemId(item.id);
                          } else {
                            setActiveItemId(isActive ? null : item.id);
                          }
                        }}
                        className="w-full flex items-center gap-3 min-h-[48px] text-left"
                      >
                        {/* Status circle */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          item.checked
                            ? `${config!.color} border-transparent`
                            : 'border-gray-300 bg-white'
                        }`}>
                          {item.checked && (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        {/* Label */}
                        <span className={`flex-1 text-sm ${item.checked ? 'text-gray-600' : 'text-gray-900'}`}>
                          {item.label}
                        </span>
                        {/* Status badge */}
                        {item.checked && config && (
                          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.border} border`}>
                            {config.label}
                          </span>
                        )}
                      </button>

                      {/* Status selector (shown when active) */}
                      {isActive && (
                        <div className="mt-2 ml-9 space-y-2">
                          <div className="grid grid-cols-2 gap-2">
                            {(['ok', 'minor_damage', 'major_damage', 'not_applicable'] as const).map(s => (
                              <button
                                key={s}
                                onClick={() => handleStatusSelect(item.id, s)}
                                className={`min-h-[48px] rounded-lg border-2 text-sm font-medium transition-colors ${
                                  item.status === s && item.checked
                                    ? `${STATUS_CONFIG[s].border} ${STATUS_CONFIG[s].bg}`
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                                }`}
                              >
                                {STATUS_CONFIG[s].label}
                              </button>
                            ))}
                          </div>

                          {/* Notes field */}
                          {(item.status === 'minor_damage' || item.status === 'major_damage' || item.notes) && (
                            <textarea
                              className="w-full h-16 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52629] focus:outline-none"
                              placeholder={mode === 'return' ? 'Beskriv skaden...' : 'Merknad...'}
                              value={item.notes || ''}
                              onChange={(e) => onItemUpdate(item.id, { notes: e.target.value })}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
