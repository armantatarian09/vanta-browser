import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TabStrip } from '@ui/TabStrip';
import { Toolbar } from '@ui/Toolbar';
import { SettingsPanel } from '@ui/SettingsPanel';
import { createTab, nextTabId, previousTabId, updateTab, type Tab } from '@core/tabModel';
import { defaultSettings, type Settings } from '@core/settings';
import { STORAGE_KEYS } from '@storage/storageKeys';
import type { BookmarkEntry, HistoryEntry } from '@storage/types';

const START_URL = 'https://duckduckgo.com';
const SEARCH_URL = 'https://duckduckgo.com/?q=';

type WebviewTag = HTMLElement & {
  loadURL: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  reload: () => void;
  getTitle: () => string | null;
};

const ensureUrl = (input: string): string => {
  try {
    const url = new URL(input);
    return url.toString();
  } catch {
    if (input.includes('.')) {
      return `https://${input}`;
    }
    return `${SEARCH_URL}${encodeURIComponent(input)}`;
  }
};

const readStore = async <T,>(key: string, fallback: T): Promise<T> => {
  const raw = await window.vanta.readStore(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const writeStore = async (key: string, value: unknown) => {
  await window.vanta.writeStore(key, JSON.stringify(value));
};

const App: React.FC = () => {
  const [tabs, setTabs] = useState<Tab[]>([createTab(START_URL)]);
  const [activeTabId, setActiveTabId] = useState<string | null>(tabs[0]?.id ?? null);
  const [addressValue, setAddressValue] = useState(START_URL);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const webviewsRef = useRef<Record<string, WebviewTag>>({});

  useEffect(() => {
    void readStore<Settings>(STORAGE_KEYS.settings, defaultSettings).then((stored) => {
      setSettings(stored);
      void window.vanta.setPrivacy({ blockThirdPartyCookies: stored.privacy.blockThirdPartyCookies });
    });
  }, []);

  useEffect(() => {
    document.body.dataset.theme = settings.theme;
  }, [settings.theme]);

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.id === activeTabId);
    if (activeTab) {
      setAddressValue(activeTab.url);
    }
  }, [activeTabId, tabs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isMeta = navigator.platform.includes('Mac') ? event.metaKey : event.ctrlKey;
      if (!isMeta) return;
      if (event.key.toLowerCase() === 'l') {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>('.address-bar input');
        input?.focus();
        input?.select();
      }
      if (event.key.toLowerCase() === 't') {
        event.preventDefault();
        handleNewTab();
      }
      if (event.key.toLowerCase() === 'w') {
        event.preventDefault();
        if (activeTabId) {
          handleCloseTab(activeTabId);
        }
      }
      if (event.key.toLowerCase() === 'tab') {
        event.preventDefault();
        const nextId = event.shiftKey
          ? previousTabId(tabs, activeTabId)
          : nextTabId(tabs, activeTabId);
        if (nextId) {
          setActiveTabId(nextId);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTabId, tabs]);

  const activeTab = useMemo(() => tabs.find((tab) => tab.id === activeTabId) ?? null, [tabs, activeTabId]);

  const handleNewTab = () => {
    const newTab = createTab(START_URL);
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTab.id);
  };

  const handleCloseTab = (id: string) => {
    setTabs((prev) => {
      const nextTabs = prev.filter((tab) => tab.id !== id);
      if (activeTabId === id) {
        setActiveTabId(nextTabs[0]?.id ?? null);
      }
      return nextTabs;
    });
  };

  const handleUrlSubmit = () => {
    if (!activeTabId) return;
    const url = ensureUrl(addressValue);
    const view = webviewsRef.current[activeTabId];
    view?.loadURL(url);
  };

  const handleHistoryEntry = async (title: string, url: string) => {
    const history = await readStore<HistoryEntry[]>(STORAGE_KEYS.history, []);
    const nextEntry: HistoryEntry = {
      id: crypto.randomUUID(),
      title,
      url,
      visitedAt: new Date().toISOString()
    };
    await writeStore(STORAGE_KEYS.history, [nextEntry, ...history].slice(0, 100));
  };

  const handleBookmark = async () => {
    if (!activeTab) return;
    const bookmarks = await readStore<BookmarkEntry[]>(STORAGE_KEYS.bookmarks, []);
    const nextEntry: BookmarkEntry = {
      id: crypto.randomUUID(),
      title: activeTab.title,
      url: activeTab.url,
      createdAt: new Date().toISOString()
    };
    await writeStore(STORAGE_KEYS.bookmarks, [nextEntry, ...bookmarks]);
  };

  const handleToggleTheme = async () => {
    const next = { ...settings, theme: settings.theme === 'dark' ? 'light' : 'dark' };
    setSettings(next);
    await writeStore(STORAGE_KEYS.settings, next);
  };

  const handleToggleThirdPartyCookies = async () => {
    const next = {
      ...settings,
      privacy: {
        ...settings.privacy,
        blockThirdPartyCookies: !settings.privacy.blockThirdPartyCookies
      }
    };
    setSettings(next);
    await writeStore(STORAGE_KEYS.settings, next);
    await window.vanta.setPrivacy({ blockThirdPartyCookies: next.privacy.blockThirdPartyCookies });
  };

  const handleToggleTelemetry = async () => {
    const next = {
      ...settings,
      privacy: {
        ...settings.privacy,
        telemetryEnabled: !settings.privacy.telemetryEnabled
      }
    };
    setSettings(next);
    await writeStore(STORAGE_KEYS.settings, next);
  };

  const attachWebviewEvents = (element: WebviewTag, tabId: string) => {
    if (element.dataset.bound === 'true') return;
    element.dataset.bound = 'true';

    element.addEventListener('did-start-loading', () => {
      setTabs((prev) => prev.map((item) => (item.id === tabId ? updateTab(item, { isLoading: true }) : item)));
    });
    element.addEventListener('did-stop-loading', () => {
      setTabs((prev) => prev.map((item) => (item.id === tabId ? updateTab(item, { isLoading: false }) : item)));
    });
    element.addEventListener('page-title-updated', (event) => {
      const titleEvent = event as { title: string };
      setTabs((prev) => prev.map((item) => (item.id === tabId ? updateTab(item, { title: titleEvent.title }) : item)));
    });
    element.addEventListener('did-navigate', (event) => {
      const navigateEvent = event as { url: string };
      setTabs((prev) => prev.map((item) => (item.id === tabId ? updateTab(item, { url: navigateEvent.url }) : item)));
      void handleHistoryEntry(element.getTitle() ?? 'New Tab', navigateEvent.url);
    });
    element.addEventListener('did-navigate-in-page', (event) => {
      const navigateEvent = event as { url: string };
      setTabs((prev) => prev.map((item) => (item.id === tabId ? updateTab(item, { url: navigateEvent.url }) : item)));
    });
    element.addEventListener('new-window', (event) => {
      const newEvent = event as { url: string };
      const newTab = createTab(newEvent.url);
      setTabs((prev) => [...prev, newTab]);
      setActiveTabId(newTab.id);
    });
  };

  return (
    <div className="app-shell">
      <TabStrip
        tabs={tabs}
        activeTabId={activeTabId}
        onActivate={setActiveTabId}
        onClose={handleCloseTab}
        onNewTab={handleNewTab}
      />
      <Toolbar
        urlValue={addressValue}
        onUrlChange={setAddressValue}
        onUrlSubmit={handleUrlSubmit}
        onBack={() => activeTabId && webviewsRef.current[activeTabId]?.goBack()}
        onForward={() => activeTabId && webviewsRef.current[activeTabId]?.goForward()}
        onReload={() => activeTabId && webviewsRef.current[activeTabId]?.reload()}
        onToggleSettings={() => setSettingsOpen((prev) => !prev)}
        onBookmark={handleBookmark}
      />
      <div className="content-area">
        {tabs.map((tab) => (
          <webview
            key={tab.id}
            ref={(element) => {
              if (element) {
                webviewsRef.current[tab.id] = element;
                attachWebviewEvents(element, tab.id);
              }
            }}
            className={`webview ${tab.id === activeTabId ? 'active' : ''}`}
            src={tab.url}
            partition="persist:vanta"
            allowpopups="true"
            preload=""
            data-tab={tab.id}
            webpreferences="contextIsolation,javascript=yes"
          />
        ))}
      </div>
      <SettingsPanel
        isOpen={settingsOpen}
        settings={settings}
        onClose={() => setSettingsOpen(false)}
        onToggleTheme={handleToggleTheme}
        onToggleThirdPartyCookies={handleToggleThirdPartyCookies}
        onToggleTelemetry={handleToggleTelemetry}
      />
      <div className="footer">
        <span>Vanta · Browse faster. Leak less.</span>
      </div>
    </div>
  );
};

export default App;
