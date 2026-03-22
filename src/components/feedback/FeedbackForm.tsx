'use client';

import React, { useState } from 'react';
import { Button, Select } from '@/components/ui';
import type { FeedbackCategory, FeedbackPriority } from '@/lib/types';

interface FeedbackFormProps {
  onSubmit: (data: {
    category: FeedbackCategory;
    priority: FeedbackPriority;
    description: string;
    screenshotUrl?: string;
  }) => void;
  onCancel?: () => void;
  submitting?: boolean;
}

const CATEGORY_OPTIONS = [
  { value: 'bug', label: 'Feil / Bug' },
  { value: 'feature', label: 'Ny funksjon' },
  { value: 'improvement', label: 'Forbedring' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Lav' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'Hoy' },
  { value: 'critical', label: 'Kritisk' },
];

export function FeedbackForm({ onSubmit, onCancel, submitting }: FeedbackFormProps) {
  const [category, setCategory] = useState<FeedbackCategory>('bug');
  const [priority, setPriority] = useState<FeedbackPriority>('medium');
  const [description, setDescription] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!description.trim()) return;
    onSubmit({
      category,
      priority,
      description: description.trim(),
      screenshotUrl: screenshotUrl.trim() || undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Kategori"
          options={CATEGORY_OPTIONS}
          value={category}
          onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
        />
        <Select
          label="Prioritet"
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
        />
      </div>

      <div>
        <label htmlFor="fb-desc" className="block text-sm font-medium text-gray-700 mb-1">
          Beskrivelse
        </label>
        <textarea
          id="fb-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Beskriv feilen, funksjonen eller forbedringen..."
          rows={4}
          required
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#E52629] resize-none"
        />
      </div>

      <div>
        <label htmlFor="fb-screenshot" className="block text-sm font-medium text-gray-700 mb-1">
          Skjermbilde-URL (valgfritt)
        </label>
        <input
          id="fb-screenshot"
          type="url"
          value={screenshotUrl}
          onChange={(e) => setScreenshotUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-[#E52629]"
        />
      </div>

      <div className="flex gap-3 pt-2">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Avbryt
          </Button>
        )}
        <Button type="submit" disabled={!description.trim() || submitting} className="flex-1">
          {submitting ? 'Sender...' : 'Send tilbakemelding'}
        </Button>
      </div>
    </form>
  );
}
