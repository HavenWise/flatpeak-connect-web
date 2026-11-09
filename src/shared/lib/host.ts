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

export const isEmbedded = (): boolean => !!window.ReactNativeWebView || window.parent !== window;

// Posts on BOTH transports: newer app builds read the React Native WebView onMessage bridge, while
// builds already in the wild listen for the window 'message' event. Returns true when embedded, so
// the caller skips its standalone behaviour.
export const postToHost = (message: HostMessage): boolean => {
    if (!isEmbedded()) {
        return false;
    }
    const serialised = JSON.stringify(message);
    window.ReactNativeWebView?.postMessage(serialised);
    if (window.parent !== window) {
        window.parent.postMessage(serialised, '*');
    }
    return true;
};
