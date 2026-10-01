/*
 * The structured outcome message for the Havenwise app (HAV-1039).
 *
 * Opt-in: the app adds `outcome=message` to the page URL. Without it the page behaves exactly as
 * before, because app builds already in the field rely on the page navigating to our API callback,
 * which links the tariff and then posts the bare string "close".
 *
 * With it, the page posts one message when the flow finishes:
 *   { status: 'connected' | 'failed', tariff: { name, supplier, varies } | null }
 *
 * `connected` means Flatpeak finished with a tariff, and our callback was reached without a
 * network error. The callback always answers 200, so it cannot confirm that Havenwise linked the
 * tariff. The app confirms that by re-reading GET /buildings/{id}/suggestions, where
 * connect_tariff disappears once the link has landed.
 *
 * The only credential the page holds is the single-use connect token in `fp_cot`.
 */
import {CommonRenderRoute, TariffStructureType} from "../connect/lib/types.ts";

export const OUTCOME_PARAM = "outcome";
export const OUTCOME_MESSAGE = "message";

export type OutcomeTariff = {
    name: string;
    supplier: string;
    varies: boolean;
};

export type TariffOutcome = {
    status: "connected" | "failed";
    tariff: OutcomeTariff | null;
};

export const wantsOutcomeMessage = (search: string): boolean =>
    new URLSearchParams(search).get(OUTCOME_PARAM) === OUTCOME_MESSAGE;

// A fixed tariff is one price all day; every other structure moves with the time or the market.
const FIXED: TariffStructureType = "FIXED";

/*
 * Follows the Connect responses for one session and answers what the outcome is. The summary
 * route is Flatpeak saying a tariff is connected on its side; a later failed route (a reconnect
 * that did not take) forgets it, and a later summary restores it.
 */
export class OutcomeTracker {
    private tariff: OutcomeTariff | null = null;
    private finished = false;

    observe(response: Partial<CommonRenderRoute> | undefined): void {
        if (response?.route === "tariff_summary") {
            const summary = (response as CommonRenderRoute<"tariff_summary">).data;
            this.tariff = {
                name: summary.tariff.name,
                supplier: summary.provider.display_name,
                varies: (summary.tariff.structure_type ?? FIXED) !== FIXED,
            };
        } else if (response?.route === "tariff_connection_failed") {
            this.tariff = null;
        }
    }

    outcome(): TariffOutcome {
        return this.tariff ? {status: "connected", tariff: this.tariff} : {status: "failed", tariff: null};
    }

    failure(): TariffOutcome {
        return {status: "failed", tariff: null};
    }

    /* True the first time only, so the app gets exactly one outcome per session. */
    claimFinish(): boolean {
        if (this.finished) {
            return false;
        }
        this.finished = true;
        return true;
    }
}

export const postOutcome = (outcome: TariffOutcome): void => {
    const message = JSON.stringify(outcome);
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(message);
    }
    if (window.parent !== window) {
        window.parent.postMessage(message, "*");
    }
};

/*
 * Reach our API callback in the background rather than navigating to it: navigating would land
 * on the callback's legacy page, which posts "close" instead of the outcome. The callback links
 * the tariff; a network error means it was not reached, so the outcome is a failure.
 */
export const completeCallback = async (redirectUrl: string): Promise<boolean> => {
    try {
        const response = await fetch(redirectUrl, {method: "GET", credentials: "omit"});
        return response.ok;
    } catch {
        return false;
    }
};
