import { describe, expect, it, beforeAll } from 'vitest';
import { createTab, nextTabId, previousTabId } from '@core/tabModel';
import { webcrypto } from 'node:crypto';

beforeAll(() => {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto
  });
});

describe('tabModel', () => {
  it('creates a tab with a url', () => {
    const tab = createTab('https://example.com');
    expect(tab.url).toBe('https://example.com');
    expect(tab.title).toBe('New Tab');
  });

  it('selects next and previous tabs', () => {
    const tabs = [createTab('https://one.com'), createTab('https://two.com')];
    const firstId = tabs[0].id;
    const secondId = tabs[1].id;
    expect(nextTabId(tabs, firstId)).toBe(secondId);
    expect(previousTabId(tabs, firstId)).toBe(secondId);
  });
});
