import {
  ROADMAP_PHASES,
  getPhaseProgress,
  getPhaseColor,
  getStatusBadgeColor,
  getStatusLabel,
  getItemStatusIcon,
} from '@/lib/roadmap/roadmap-data';
import type { RoadmapPhase } from '@/lib/roadmap/roadmap-data';

describe('ROADMAP_PHASES', () => {
  it('has at least 5 phases', () => {
    expect(ROADMAP_PHASES.length).toBeGreaterThanOrEqual(5);
  });

  it('all phases have unique IDs', () => {
    const ids = ROADMAP_PHASES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('all items across all phases have unique IDs', () => {
    const ids = ROADMAP_PHASES.flatMap((p) => p.items.map((i) => i.id));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('completed phases have all items completed', () => {
    const completedPhases = ROADMAP_PHASES.filter((p) => p.status === 'completed');
    for (const phase of completedPhases) {
      const nonCompleted = phase.items.filter((i) => i.status !== 'completed');
      expect(nonCompleted).toHaveLength(0);
    }
  });

  it('future phases have no completed items', () => {
    const futurePhases = ROADMAP_PHASES.filter((p) => p.status === 'future');
    for (const phase of futurePhases) {
      const completed = phase.items.filter((i) => i.status === 'completed');
      expect(completed).toHaveLength(0);
    }
  });

  it('each phase has a version string', () => {
    for (const phase of ROADMAP_PHASES) {
      expect(phase.version).toMatch(/^v\d+\.\d+$/);
    }
  });

  it('each phase has a summary', () => {
    for (const phase of ROADMAP_PHASES) {
      expect(phase.summary.length).toBeGreaterThan(10);
    }
  });

  it('each item has title and description', () => {
    for (const phase of ROADMAP_PHASES) {
      for (const item of phase.items) {
        expect(item.title.length).toBeGreaterThan(0);
        expect(item.description.length).toBeGreaterThan(0);
      }
    }
  });
});

describe('getPhaseProgress', () => {
  it('returns 100 for fully completed phase', () => {
    const phase: RoadmapPhase = {
      id: 'test', name: 'Test', status: 'completed', version: 'v0.0', summary: 'Test',
      items: [
        { id: 'a', title: 'A', description: 'A', status: 'completed' },
        { id: 'b', title: 'B', description: 'B', status: 'completed' },
      ],
    };
    expect(getPhaseProgress(phase)).toBe(100);
  });

  it('returns 0 for phase with no completed items', () => {
    const phase: RoadmapPhase = {
      id: 'test', name: 'Test', status: 'planned', version: 'v0.0', summary: 'Test',
      items: [
        { id: 'a', title: 'A', description: 'A', status: 'planned' },
        { id: 'b', title: 'B', description: 'B', status: 'planned' },
      ],
    };
    expect(getPhaseProgress(phase)).toBe(0);
  });

  it('returns 50 for half-completed phase', () => {
    const phase: RoadmapPhase = {
      id: 'test', name: 'Test', status: 'in-progress', version: 'v0.0', summary: 'Test',
      items: [
        { id: 'a', title: 'A', description: 'A', status: 'completed' },
        { id: 'b', title: 'B', description: 'B', status: 'planned' },
      ],
    };
    expect(getPhaseProgress(phase)).toBe(50);
  });

  it('returns 0 for empty phase', () => {
    const phase: RoadmapPhase = {
      id: 'test', name: 'Test', status: 'planned', version: 'v0.0', summary: 'Test',
      items: [],
    };
    expect(getPhaseProgress(phase)).toBe(0);
  });
});

describe('helper functions', () => {
  it('getPhaseColor returns correct colors', () => {
    expect(getPhaseColor('completed')).toBe('green');
    expect(getPhaseColor('in-progress')).toBe('blue');
    expect(getPhaseColor('planned')).toBe('orange');
    expect(getPhaseColor('future')).toBe('red');
  });

  it('getStatusBadgeColor returns CSS classes', () => {
    expect(getStatusBadgeColor('completed')).toContain('bg-green');
    expect(getStatusBadgeColor('in-progress')).toContain('bg-blue');
    expect(getStatusBadgeColor('planned')).toContain('bg-amber');
    expect(getStatusBadgeColor('future')).toContain('bg-gray');
  });

  it('getStatusLabel returns Norwegian labels', () => {
    expect(getStatusLabel('completed')).toBe('Fullført');
    expect(getStatusLabel('in-progress')).toBe('Pågår');
    expect(getStatusLabel('planned')).toBe('Planlagt');
    expect(getStatusLabel('future')).toBe('Fremtidig');
  });

  it('getItemStatusIcon returns correct icons', () => {
    expect(getItemStatusIcon('completed')).toBe('\u2713'); // checkmark
    expect(getItemStatusIcon('in-progress')).toBeTruthy();
    expect(getItemStatusIcon('planned')).toBeTruthy();
    expect(getItemStatusIcon('future')).toBeTruthy();
  });
});
