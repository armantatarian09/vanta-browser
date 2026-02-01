import React from 'react';

type ToolbarProps = {
  urlValue: string;
  onUrlChange: (value: string) => void;
  onUrlSubmit: () => void;
  onBack: () => void;
  onForward: () => void;
  onReload: () => void;
  onToggleSettings: () => void;
  onBookmark: () => void;
};

export const Toolbar: React.FC<ToolbarProps> = ({
  urlValue,
  onUrlChange,
  onUrlSubmit,
  onBack,
  onForward,
  onReload,
  onToggleSettings,
  onBookmark
}) => {
  return (
    <div className="toolbar">
      <div className="nav-controls">
        <button type="button" onClick={onBack} aria-label="Back">
          ←
        </button>
        <button type="button" onClick={onForward} aria-label="Forward">
          →
        </button>
        <button type="button" onClick={onReload} aria-label="Reload">
          ⟳
        </button>
      </div>
      <form
        className="address-bar"
        onSubmit={(event) => {
          event.preventDefault();
          onUrlSubmit();
        }}
      >
        <input
          value={urlValue}
          onChange={(event) => onUrlChange(event.target.value)}
          placeholder="Search or enter URL"
        />
      </form>
      <div className="toolbar-actions">
        <button type="button" onClick={onBookmark} aria-label="Bookmark">
          ☆
        </button>
        <button type="button" onClick={onToggleSettings} aria-label="Settings">
          ⚙
        </button>
      </div>
    </div>
  );
};
