'use client';

import React, { useState, useEffect } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { useFeedback } from '@/hooks/useFeedback';
import type { FeedbackCategory, FeedbackPriority } from '@/lib/types';

interface FeedbackWidgetProps {
  /** Which context: admin or terminal */
  context: 'admin' | 'terminal';
  /** Current user name */
  userName?: string;
  /** Current warehouse code */
  warehouseCode?: string;
}

export function FeedbackWidget({ context, userName = 'Ukjent', warehouseCode }: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { addFeedback, newCount } = useFeedback();

  // Reset submitted state when modal reopens
  useEffect(() => {
    if (isOpen) setSubmitted(false);
  }, [isOpen]);

  async function handleSubmit(data: {
    category: FeedbackCategory;
    priority: FeedbackPriority;
    description: string;
    screenshotUrl?: string;
  }) {
    setSubmitting(true);
    try {
      await addFeedback({
        ...data,
        submittedBy: userName,
        submittedFrom: context,
        warehouseCode,
      });
      setSubmitted(true);
      setTimeout(() => setIsOpen(false), 1500);
    } catch {
      // Silently fail — offline will retry
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#E52629] text-white rounded-full shadow-lg hover:bg-[#C41E21] transition-all hover:scale-105 active:scale-95 flex items-center justify-center"
        aria-label="Gi tilbakemelding"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        {newCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {newCount > 9 ? '9+' : newCount}
          </span>
        )}
      </button>

      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !submitting && setIsOpen(false)}
          />

          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Gi tilbakemelding</h2>
                <button
                  onClick={() => !submitting && setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
                  aria-label="Lukk"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold text-gray-900">Takk for tilbakemeldingen!</p>
                  <p className="text-sm text-gray-500 mt-1">Den er lagret og vil bli gjennomgatt.</p>
                </div>
              ) : (
                <FeedbackForm
                  onSubmit={handleSubmit}
                  onCancel={() => setIsOpen(false)}
                  submitting={submitting}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
