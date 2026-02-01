import type React from 'react';

export {};

declare global {
  interface Window {
    vanta: {
      readStore: (key: string) => Promise<string | null>;
      writeStore: (key: string, value: string) => Promise<void>;
      log: (level: 'info' | 'warn' | 'error', message: string) => void;
      setPrivacy: (payload: { blockThirdPartyCookies: boolean }) => Promise<void>;
    };
  }

  namespace JSX {
    interface IntrinsicElements {
      webview: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        src?: string;
        partition?: string;
        allowpopups?: string;
        preload?: string;
        webpreferences?: string;
        onDidStartLoading?: () => void;
        onDidStopLoading?: () => void;
        onPageTitleUpdated?: (event: { title: string }) => void;
        onDidNavigate?: (event: { url: string }) => void;
        onDidNavigateInPage?: (event: { url: string }) => void;
      };
    }
  }
}
