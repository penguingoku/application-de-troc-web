const DEFAULT_API_BASE_URL = 'http://localhost:8080/api';

function resolveApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const runtimeConfig = (window as any).__env?.API_BASE_URL;
    if (runtimeConfig) {
      return runtimeConfig;
    }
  }

  const injected = (globalThis as any)?.NG_APP_API_BASE_URL;
  if (injected) {
    return injected;
  }

  return DEFAULT_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBaseUrl();


