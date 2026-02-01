export type Tab = {
  id: string;
  title: string;
  url: string;
  isLoading: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
};

export const createTab = (url: string): Tab => ({
  id: crypto.randomUUID(),
  title: 'New Tab',
  url,
  isLoading: true,
  canGoBack: false,
  canGoForward: false
});

export const updateTab = (tab: Tab, patch: Partial<Tab>): Tab => ({
  ...tab,
  ...patch
});

export const nextTabId = (tabs: Tab[], activeId: string | null): string | null => {
  if (tabs.length === 0) return null;
  const index = tabs.findIndex((tab) => tab.id === activeId);
  const nextIndex = index === -1 ? 0 : (index + 1) % tabs.length;
  return tabs[nextIndex].id;
};

export const previousTabId = (tabs: Tab[], activeId: string | null): string | null => {
  if (tabs.length === 0) return null;
  const index = tabs.findIndex((tab) => tab.id === activeId);
  const nextIndex = index <= 0 ? tabs.length - 1 : index - 1;
  return tabs[nextIndex].id;
};
