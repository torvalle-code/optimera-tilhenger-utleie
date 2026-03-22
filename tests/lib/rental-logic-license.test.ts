import { validateLicenseForTrailer } from '@/lib/rental/rental-logic';

describe('validateLicenseForTrailer', () => {
  it('B + 750kg -> valid, no warning', () => {
    const result = validateLicenseForTrailer('B', 750);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe(false);
  });

  it('B + 1300kg -> invalid with warning about B96', () => {
    const result = validateLicenseForTrailer('B', 1300);
    expect(result.valid).toBe(false);
    expect(result.warning).toBe(true);
    expect(result.message).toContain('B96');
  });

  it('B96 + 750kg -> valid', () => {
    const result = validateLicenseForTrailer('B96', 750);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe(false);
  });

  it('B96 + 1300kg -> valid, no warning (under 1500)', () => {
    const result = validateLicenseForTrailer('B96', 1300);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe(false);
  });

  it('B96 + 2000kg -> valid with warning about car weight', () => {
    const result = validateLicenseForTrailer('B96', 2000);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe(true);
  });

  it('BE + 750kg -> valid', () => {
    const result = validateLicenseForTrailer('BE', 750);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe(false);
  });

  it('BE + 3500kg -> valid', () => {
    const result = validateLicenseForTrailer('BE', 3500);
    expect(result.valid).toBe(true);
    expect(result.warning).toBe(false);
  });

  it('BE + 4000kg -> invalid', () => {
    const result = validateLicenseForTrailer('BE', 4000);
    expect(result.valid).toBe(false);
  });

  it('undefined license -> invalid with message', () => {
    const result = validateLicenseForTrailer(undefined, 750);
    expect(result.valid).toBe(false);
    expect(result.warning).toBe(true);
    expect(result.message).toBeTruthy();
  });
});
