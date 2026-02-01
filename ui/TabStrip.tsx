import React from 'react';
import type { Tab } from '@core/tabModel';

type TabStripProps = {
  tabs: Tab[];
  activeTabId: string | null;
  onActivate: (id: string) => void;
  onClose: (id: string) => void;
  onNewTab: () => void;
};

export const TabStrip: React.FC<TabStripProps> = ({
  tabs,
  activeTabId,
  onActivate,
  onClose,
  onNewTab
}) => {
  return (
    <div className="tab-strip">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab ${tab.id === activeTabId ? 'active' : ''}`}
          onClick={() => onActivate(tab.id)}
          type="button"
        >
          <span className="tab-title">{tab.title}</span>
          <span className={`tab-status ${tab.isLoading ? 'loading' : ''}`} />
          <span
            className="tab-close"
            onClick={(event) => {
              event.stopPropagation();
              onClose(tab.id);
            }}
            role="button"
          >
            ×
          </span>
        </button>
      ))}
      <button className="tab new" onClick={onNewTab} type="button">
        +
      </button>
    </div>
  );
};
