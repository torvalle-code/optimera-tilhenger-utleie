import { getEnvConfig, validateEnv } from '@/lib/env';

describe('getEnvConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns defaults when no env vars set', () => {
    const config = getEnvConfig();
    expect(config.sharefoxMock).toBe(false);
    expect(config.defaultWarehouseCode).toBe('MONTER-SKI');
    expect(config.sharefoxBaseUrl).toBe('https://api.mysharefox.com/api-v2');
  });

  it('reads SHAREFOX_MOCK=true', () => {
    process.env.SHAREFOX_MOCK = 'true';
    expect(getEnvConfig().sharefoxMock).toBe(true);
  });

  it('reads SHAREFOX_MOCK=1', () => {
    process.env.SHAREFOX_MOCK = '1';
    expect(getEnvConfig().sharefoxMock).toBe(true);
  });

  it('SHAREFOX_MOCK defaults to false', () => {
    process.env.SHAREFOX_MOCK = 'false';
    expect(getEnvConfig().sharefoxMock).toBe(false);
  });

  it('reads custom warehouse code', () => {
    process.env.DEFAULT_WAREHOUSE_CODE = 'MONTER-TON';
    expect(getEnvConfig().defaultWarehouseCode).toBe('MONTER-TON');
  });
});

describe('validateEnv', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('returns errors when required vars missing (non-mock mode)', () => {
    process.env.SHAREFOX_MOCK = 'false';
    const errors = validateEnv();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors).toContain('SHAREFOX_ADMIN_EMAIL is required');
  });

  it('returns no errors in mock mode', () => {
    process.env.SHAREFOX_MOCK = 'true';
    expect(validateEnv()).toEqual([]);
  });

  it('validates SHAREFOX_BASE_URL starts with https', () => {
    process.env.SHAREFOX_MOCK = 'false';
    process.env.SHAREFOX_ADMIN_EMAIL = 'test@test.com';
    process.env.SHAREFOX_ADMIN_PASSWORD = 'pass';
    process.env.SHAREFOX_DOMAIN = 'test.mysharefox.com';
    process.env.SHAREFOX_BASE_URL = 'http://insecure.com';
    const errors = validateEnv();
    expect(errors).toContain('SHAREFOX_BASE_URL must start with https://');
  });

  it('passes with all required vars set', () => {
    process.env.SHAREFOX_ADMIN_EMAIL = 'test@test.com';
    process.env.SHAREFOX_ADMIN_PASSWORD = 'pass';
    process.env.SHAREFOX_DOMAIN = 'test.mysharefox.com';
    process.env.SHAREFOX_BASE_URL = 'https://api.mysharefox.com/api-v2';
    expect(validateEnv()).toEqual([]);
  });
});
