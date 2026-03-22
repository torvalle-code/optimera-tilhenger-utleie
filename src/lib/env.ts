interface EnvConfig {
  sharefoxAdminEmail: string;
  sharefoxAdminPassword: string;
  sharefoxDomain: string;
  sharefoxBaseUrl: string;
  defaultWarehouseCode: string;
  defaultWarehouseName: string;
  sharefoxMock: boolean;
}

export function getEnvConfig(): EnvConfig {
  const config: EnvConfig = {
    sharefoxAdminEmail: process.env.SHAREFOX_ADMIN_EMAIL || '',
    sharefoxAdminPassword: process.env.SHAREFOX_ADMIN_PASSWORD || '',
    sharefoxDomain: process.env.SHAREFOX_DOMAIN || '',
    sharefoxBaseUrl: process.env.SHAREFOX_BASE_URL || 'https://api.mysharefox.com/api-v2',
    defaultWarehouseCode: process.env.DEFAULT_WAREHOUSE_CODE || process.env.NEXT_PUBLIC_DEFAULT_WAREHOUSE_CODE || 'MONTER-SKI',
    defaultWarehouseName: process.env.DEFAULT_WAREHOUSE_NAME || process.env.NEXT_PUBLIC_DEFAULT_WAREHOUSE_NAME || 'Monter Skien',
    sharefoxMock: process.env.SHAREFOX_MOCK === 'true' || process.env.SHAREFOX_MOCK === '1',
  };

  return config;
}

export function validateEnv(): string[] {
  const errors: string[] = [];
  const config = getEnvConfig();

  if (!config.sharefoxMock) {
    if (!config.sharefoxAdminEmail) errors.push('SHAREFOX_ADMIN_EMAIL is required');
    if (!config.sharefoxAdminPassword) errors.push('SHAREFOX_ADMIN_PASSWORD is required');
    if (!config.sharefoxDomain) errors.push('SHAREFOX_DOMAIN is required');
    if (!config.sharefoxBaseUrl.startsWith('https://')) {
      errors.push('SHAREFOX_BASE_URL must start with https://');
    }
  }

  return errors;
}
