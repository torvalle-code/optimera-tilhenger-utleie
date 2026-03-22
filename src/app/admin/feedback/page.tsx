'use client';

import React, { useState } from 'react';
import { Card, Badge, Button, Select } from '@/components/ui';
import { useFeedback } from '@/hooks/useFeedback';
import type { FeedbackCategory, FeedbackPriority, FeedbackStatus } from '@/lib/types';

const CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  bug: 'Feil',
  feature: 'Ny funksjon',
  improvement: 'Forbedring',
};

const CATEGORY_COLORS: Record<FeedbackCategory, string> = {
  bug: 'bg-red-100 text-red-800',
  feature: 'bg-blue-100 text-blue-800',
  improvement: 'bg-purple-100 text-purple-800',
};

const PRIORITY_LABELS: Record<FeedbackPriority, string> = {
  low: 'Lav',
  medium: 'Medium',
  high: 'Hoy',
  critical: 'Kritisk',
};

const PRIORITY_COLORS: Record<FeedbackPriority, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-amber-100 text-amber-800',
  critical: 'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<FeedbackStatus, string> = {
  new: 'Ny',
  reviewed: 'Gjennomgatt',
  planned: 'Planlagt',
  resolved: 'Lost',
  rejected: 'Avvist',
};

const STATUS_COLORS: Record<FeedbackStatus, string> = {
  new: 'bg-amber-100 text-amber-800',
  reviewed: 'bg-blue-100 text-blue-800',
  planned: 'bg-indigo-100 text-indigo-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-gray-100 text-gray-600',
};

const STATUS_OPTIONS = [
  { value: '', label: 'Alle statuser' },
  { value: 'new', label: 'Ny' },
  { value: 'reviewed', label: 'Gjennomgatt' },
  { value: 'planned', label: 'Planlagt' },
  { value: 'resolved', label: 'Lost' },
  { value: 'rejected', label: 'Avvist' },
];

const CATEGORY_FILTER_OPTIONS = [
  { value: '', label: 'Alle kategorier' },
  { value: 'bug', label: 'Feil' },
  { value: 'feature', label: 'Ny funksjon' },
  { value: 'improvement', label: 'Forbedring' },
];

const STATUS_CHANGE_OPTIONS = [
  { value: 'new', label: 'Ny' },
  { value: 'reviewed', label: 'Gjennomgatt' },
  { value: 'planned', label: 'Planlagt' },
  { value: 'resolved', label: 'Lost' },
  { value: 'rejected', label: 'Avvist' },
];

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat('nb-NO', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function FeedbackPage() {
  const { feedback, loading, updateStatus, newCount, totalCount } = useFeedback();
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = feedback.filter((item) => {
    if (filterCategory && item.category !== filterCategory) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tilbakemeldinger</h1>
          <p className="text-sm text-gray-500 mt-1">
            {totalCount} totalt{newCount > 0 && ` — ${newCount} nye`}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="w-48">
          <Select
            options={CATEGORY_FILTER_OPTIONS}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          />
        </div>
        <div className="w-48">
          <Select
            options={STATUS_OPTIONS}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <Card>
          <p className="text-center text-gray-400 py-8">Laster tilbakemeldinger...</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">Ingen tilbakemeldinger enda</p>
            <p className="text-sm text-gray-400 mt-1">Bruk den rode knappen nede til hoyre for a sende inn.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id}>
              <div
                className="cursor-pointer"
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge color={CATEGORY_COLORS[item.category]}>{CATEGORY_LABELS[item.category]}</Badge>
                      <Badge color={PRIORITY_COLORS[item.priority]}>{PRIORITY_LABELS[item.priority]}</Badge>
                      <Badge color={STATUS_COLORS[item.status]}>{STATUS_LABELS[item.status]}</Badge>
                    </div>
                    <p className="text-sm text-gray-900 line-clamp-2">{item.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {item.submittedBy} — {item.submittedFrom === 'terminal' ? 'Terminal' : 'Admin'} — {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    className={`flex-shrink-0 transition-transform ${expandedId === item.id ? 'rotate-180' : ''}`}
                  >
                    <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {expandedId === item.id && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Full beskrivelse</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.description}</p>
                  </div>

                  {item.screenshotUrl && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Skjermbilde</p>
                      <a
                        href={item.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#E52629] underline"
                      >
                        {item.screenshotUrl}
                      </a>
                    </div>
                  )}

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Endre status</p>
                    <div className="flex gap-2 flex-wrap">
                      {STATUS_CHANGE_OPTIONS.map((opt) => (
                        <Button
                          key={opt.value}
                          size="sm"
                          variant={item.status === opt.value ? 'primary' : 'secondary'}
                          onClick={(e) => {
                            e.stopPropagation();
                            updateStatus(item.id, opt.value as FeedbackStatus);
                          }}
                        >
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
