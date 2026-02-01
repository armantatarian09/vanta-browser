import React from 'react';
import type { Settings } from '@core/settings';

type SettingsPanelProps = {
  isOpen: boolean;
  settings: Settings;
  onClose: () => void;
  onToggleTheme: () => void;
  onToggleThirdPartyCookies: () => void;
  onToggleTelemetry: () => void;
};

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isOpen,
  settings,
  onClose,
  onToggleTheme,
  onToggleThirdPartyCookies,
  onToggleTelemetry
}) => {
  if (!isOpen) return null;

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
      <div className="settings-section">
        <h3>Appearance</h3>
        <button type="button" onClick={onToggleTheme}>
          Theme: {settings.theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </div>
      <div className="settings-section">
        <h3>Privacy</h3>
        <label>
          <input
            type="checkbox"
            checked={settings.privacy.blockThirdPartyCookies}
            onChange={onToggleThirdPartyCookies}
          />
          Block third-party cookies
        </label>
        <label>
          <input
            type="checkbox"
            checked={settings.privacy.telemetryEnabled}
            onChange={onToggleTelemetry}
          />
          Telemetry (disabled by default)
        </label>
      </div>
      <div className="settings-section">
        <h3>Downloads</h3>
        <p>Downloads are listed here. This is a placeholder UI.</p>
      </div>
    </div>
  );
};
