import { SharefoxClient } from './client';
import { MockSharefoxClient } from './mock-client';
import { getEnvConfig } from '../env';

type AnySharefoxClient = SharefoxClient | MockSharefoxClient;

let _client: AnySharefoxClient | null = null;

export function getSharefoxClient(): AnySharefoxClient {
  if (!_client) {
    const env = getEnvConfig();
    if (env.sharefoxMock) {
      _client = new MockSharefoxClient();
    } else {
      _client = new SharefoxClient({
        baseUrl: env.sharefoxBaseUrl,
        adminEmail: env.sharefoxAdminEmail,
        adminPassword: env.sharefoxAdminPassword,
        domain: env.sharefoxDomain,
      });
    }
  }
  return _client;
}

export { SharefoxClient, SharefoxApiError } from './client';
export { MockSharefoxClient } from './mock-client';
