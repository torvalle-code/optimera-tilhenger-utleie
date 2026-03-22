import type { FeedbackItem, FeedbackCategory, FeedbackPriority, FeedbackStatus } from '@/lib/types';

describe('FeedbackItem type', () => {
  const validFeedback: FeedbackItem = {
    id: 'fb-123',
    category: 'bug',
    priority: 'high',
    status: 'new',
    description: 'Knappen virker ikke pa terminal',
    submittedBy: 'SteinFrode',
    submittedFrom: 'terminal',
    warehouseCode: 'MONTER-SKI',
    createdAt: '2026-03-22T10:00:00.000Z',
    updatedAt: '2026-03-22T10:00:00.000Z',
  };

  it('has all required fields', () => {
    expect(validFeedback.id).toBeDefined();
    expect(validFeedback.category).toBeDefined();
    expect(validFeedback.priority).toBeDefined();
    expect(validFeedback.status).toBeDefined();
    expect(validFeedback.description).toBeDefined();
    expect(validFeedback.submittedBy).toBeDefined();
    expect(validFeedback.submittedFrom).toBeDefined();
    expect(validFeedback.createdAt).toBeDefined();
    expect(validFeedback.updatedAt).toBeDefined();
  });

  it('accepts valid categories', () => {
    const categories: FeedbackCategory[] = ['bug', 'feature', 'improvement'];
    for (const cat of categories) {
      expect(() => {
        const item: FeedbackItem = { ...validFeedback, category: cat };
        expect(item.category).toBe(cat);
      }).not.toThrow();
    }
  });

  it('accepts valid priorities', () => {
    const priorities: FeedbackPriority[] = ['low', 'medium', 'high', 'critical'];
    for (const pri of priorities) {
      const item: FeedbackItem = { ...validFeedback, priority: pri };
      expect(item.priority).toBe(pri);
    }
  });

  it('accepts valid statuses', () => {
    const statuses: FeedbackStatus[] = ['new', 'reviewed', 'planned', 'resolved', 'rejected'];
    for (const status of statuses) {
      const item: FeedbackItem = { ...validFeedback, status };
      expect(item.status).toBe(status);
    }
  });

  it('accepts optional fields', () => {
    const withOptionals: FeedbackItem = {
      ...validFeedback,
      screenshotUrl: 'https://example.com/screenshot.png',
      roadmapItemId: 'v1.2-feedback-widget',
    };
    expect(withOptionals.screenshotUrl).toBe('https://example.com/screenshot.png');
    expect(withOptionals.roadmapItemId).toBe('v1.2-feedback-widget');
  });

  it('works without optional fields', () => {
    const minimal: FeedbackItem = {
      id: 'fb-min',
      category: 'feature',
      priority: 'low',
      status: 'new',
      description: 'Minimal feedback',
      submittedBy: 'Admin',
      submittedFrom: 'admin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    expect(minimal.screenshotUrl).toBeUndefined();
    expect(minimal.warehouseCode).toBeUndefined();
    expect(minimal.roadmapItemId).toBeUndefined();
  });
});

describe('Feedback filtering logic', () => {
  const items: FeedbackItem[] = [
    { id: '1', category: 'bug', priority: 'critical', status: 'new', description: 'Bug 1', submittedBy: 'A', submittedFrom: 'terminal', createdAt: '2026-03-22T01:00:00Z', updatedAt: '2026-03-22T01:00:00Z' },
    { id: '2', category: 'feature', priority: 'medium', status: 'planned', description: 'Feature 1', submittedBy: 'B', submittedFrom: 'admin', createdAt: '2026-03-22T02:00:00Z', updatedAt: '2026-03-22T02:00:00Z' },
    { id: '3', category: 'improvement', priority: 'low', status: 'resolved', description: 'Improvement 1', submittedBy: 'C', submittedFrom: 'terminal', createdAt: '2026-03-22T03:00:00Z', updatedAt: '2026-03-22T03:00:00Z' },
    { id: '4', category: 'bug', priority: 'high', status: 'new', description: 'Bug 2', submittedBy: 'D', submittedFrom: 'admin', createdAt: '2026-03-22T04:00:00Z', updatedAt: '2026-03-22T04:00:00Z' },
  ];

  function filterItems(filters: { category?: FeedbackCategory; priority?: FeedbackPriority; status?: FeedbackStatus }): FeedbackItem[] {
    return items.filter((item) => {
      if (filters.category && item.category !== filters.category) return false;
      if (filters.priority && item.priority !== filters.priority) return false;
      if (filters.status && item.status !== filters.status) return false;
      return true;
    });
  }

  it('filters by category', () => {
    expect(filterItems({ category: 'bug' })).toHaveLength(2);
    expect(filterItems({ category: 'feature' })).toHaveLength(1);
    expect(filterItems({ category: 'improvement' })).toHaveLength(1);
  });

  it('filters by status', () => {
    expect(filterItems({ status: 'new' })).toHaveLength(2);
    expect(filterItems({ status: 'planned' })).toHaveLength(1);
    expect(filterItems({ status: 'resolved' })).toHaveLength(1);
  });

  it('filters by priority', () => {
    expect(filterItems({ priority: 'critical' })).toHaveLength(1);
    expect(filterItems({ priority: 'medium' })).toHaveLength(1);
  });

  it('combines filters', () => {
    expect(filterItems({ category: 'bug', status: 'new' })).toHaveLength(2);
    expect(filterItems({ category: 'bug', priority: 'critical' })).toHaveLength(1);
  });

  it('returns all when no filters', () => {
    expect(filterItems({})).toHaveLength(4);
  });
});
