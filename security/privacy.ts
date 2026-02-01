export type PrivacyPolicy = {
  blockThirdPartyCookies: boolean;
  telemetryEnabled: boolean;
};

export const defaultPrivacyPolicy: PrivacyPolicy = {
  blockThirdPartyCookies: true,
  telemetryEnabled: false
};

export const applyPrivacyPolicy = (policy: PrivacyPolicy): PrivacyPolicy => {
  return {
    blockThirdPartyCookies: Boolean(policy.blockThirdPartyCookies),
    telemetryEnabled: Boolean(policy.telemetryEnabled)
  };
};
