export type Theme = 'dark' | 'light';

export type PrivacySettings = {
  blockThirdPartyCookies: boolean;
  telemetryEnabled: boolean;
};

export type Settings = {
  theme: Theme;
  privacy: PrivacySettings;
};

export const defaultSettings: Settings = {
  theme: 'dark',
  privacy: {
    blockThirdPartyCookies: true,
    telemetryEnabled: false
  }
};
