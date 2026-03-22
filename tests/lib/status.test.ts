import {
  isValidTransition,
  getNextStatuses,
  getStatusLabel,
  getStatusColor,
} from '@/lib/rental/status';

describe('isValidTransition', () => {
  it('pending → active is valid', () => {
    expect(isValidTransition('pending', 'active')).toBe(true);
  });

  it('pending → cancelled is valid', () => {
    expect(isValidTransition('pending', 'cancelled')).toBe(true);
  });

  it('active → returned is valid', () => {
    expect(isValidTransition('active', 'returned')).toBe(true);
  });

  it('active → overdue is valid', () => {
    expect(isValidTransition('active', 'overdue')).toBe(true);
  });

  it('returned → completed is valid', () => {
    expect(isValidTransition('returned', 'completed')).toBe(true);
  });

  it('completed → anything is invalid', () => {
    expect(isValidTransition('completed', 'active')).toBe(false);
    expect(isValidTransition('completed', 'cancelled')).toBe(false);
  });

  it('cancelled → anything is invalid', () => {
    expect(isValidTransition('cancelled', 'active')).toBe(false);
    expect(isValidTransition('cancelled', 'pending')).toBe(false);
  });

  it('pending → completed is invalid (must go through active)', () => {
    expect(isValidTransition('pending', 'completed')).toBe(false);
  });

  it('overdue → returned is valid', () => {
    expect(isValidTransition('overdue', 'returned')).toBe(true);
  });
});

describe('getNextStatuses', () => {
  it('pending can go to active or cancelled', () => {
    expect(getNextStatuses('pending')).toEqual(['active', 'cancelled']);
  });

  it('active can go to overdue, returned, or cancelled', () => {
    expect(getNextStatuses('active')).toEqual(['overdue', 'returned', 'cancelled']);
  });

  it('completed has no next statuses', () => {
    expect(getNextStatuses('completed')).toEqual([]);
  });
});

describe('getStatusLabel', () => {
  it('returns Norwegian labels', () => {
    expect(getStatusLabel('pending')).toBe('Venter på henting');
    expect(getStatusLabel('active')).toBe('Utleid');
    expect(getStatusLabel('overdue')).toBe('Forfalt');
    expect(getStatusLabel('returned')).toBe('Innlevert');
    expect(getStatusLabel('completed')).toBe('Fullført');
    expect(getStatusLabel('cancelled')).toBe('Kansellert');
  });
});

describe('getStatusColor', () => {
  it('returns Tailwind color classes', () => {
    expect(getStatusColor('active')).toContain('green');
    expect(getStatusColor('overdue')).toContain('red');
    expect(getStatusColor('pending')).toContain('yellow');
  });
});
