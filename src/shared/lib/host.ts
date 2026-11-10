// Messages to the Havenwise app when this page is embedded in its React Native WebView or in an
// iframe (the app on web). The app reads the outcome, so a page the person closed never reaches it
// as a connected tariff, and "not listed" opens the app's own tariff list instead of a dead end.

declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}

export type HostMessage =
    | { action: 'close'; outcome: 'connected'; fp_cot?: string }
    | { action: 'close'; outcome: 'cancelled'; fp_cot?: string }
    | { action: 'not_listed'; stage: 'provider' | 'tariff'; fp_cot?: string };

// App builds that read `outcome` and `not_listed` open this page with `?hw_host=2` (HAV-1383).
// Older builds only act on a close, as a success: for them "cancelled" and "not listed" would be
// dead buttons, so without the flag the page keeps Flatpeak's own behaviour for those. Read once
// at load and kept for the session, because the page rewrites its URL to `/?fp_cot=` as it goes.
const HOST_VERSION_PARAM = 'hw_host';
const OUTCOMES_VERSION = '2';
const STORAGE_KEY = 'hw_host';

const readHostVersion = (): string | null => {
    const fromUrl = new URLSearchParams(window.location.search).get(HOST_VERSION_PARAM);
    try {
        if (fromUrl) {
            window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
            return fromUrl;
        }
        return window.sessionStorage.getItem(STORAGE_KEY);
    } catch {
        return fromUrl;
    }
};

const HOST_VERSION = readHostVersion();

export const isEmbedded = (): boolean => !!window.ReactNativeWebView || window.parent !== window;

/** The embedding app understands `outcome: 'cancelled'` and `not_listed`. */
export const hostReadsOutcomes = (): boolean => isEmbedded() && HOST_VERSION === OUTCOMES_VERSION;

// Posts on BOTH transports: newer app builds read the React Native WebView onMessage bridge, while
// builds already in the wild listen for the window 'message' event. Returns true when the message
// was sent, so the caller skips its own behaviour. A connected close goes to every embedding host,
// as it always has; "cancelled" and "not listed" only to a host that reads them.
export const postToHost = (message: HostMessage): boolean => {
    const understood = message.action === 'close' && message.outcome === 'connected'
        ? isEmbedded()
        : hostReadsOutcomes();
    if (!understood) {
        return false;
    }
    const serialised = JSON.stringify(message);
    window.ReactNativeWebView?.postMessage(serialised);
    // Always, as closeEmbed did, WebView included: there `window.parent` is the page itself, and
    // that window 'message' event is the transport older builds listen on.
    window.parent.postMessage(serialised, '*');
    return true;
};
