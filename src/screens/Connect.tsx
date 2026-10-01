import {DynamicViewRouter} from "../features/connect/ui/DynamicViewRouter.tsx";
import {PostalAddressCapture} from "./DynamicViews/PostalAddressCapture.tsx";
import {UnknownView} from "./DynamicViews/UnknownView.tsx";
import {ConnectProvider} from "../features/connect/lib/ConnectProvider.tsx";
import {useLocation} from "react-router-dom";
import {ProviderSelect} from "./DynamicViews/ProviderSelect.tsx";
import {CaptureTariffStructure} from "./DynamicViews/CaptureTariffStructure.tsx";
import {RateFixedCapture} from "./DynamicViews/RateFixedCapture.tsx";
import {TariffNameCapture} from "./DynamicViews/TariffNameCapture.tsx";
import {ContractTermCapture} from "./DynamicViews/ContractTermCapture.tsx";
import {TariffSelect} from "./DynamicViews/TariffSelect.tsx";
import NavHeader from "../shared/ui/NavHeader/NavHeader.tsx";
import {useTheme} from "../features/theme/ThemeProvider.tsx";
import {useEffect, useMemo, useRef, useState} from "react";
import {Exception} from "./CommonViews/Exception.tsx";
import {RateTodCapture} from "./DynamicViews/RateTodCapture.tsx";
import {MarketSurchargeCapture} from "./DynamicViews/MarketSurchargeCapture.tsx";
import {ProviderNameCapture} from "./DynamicViews/ProviderNameCapture.tsx";
import {CompleteView} from "./DynamicViews/Complete.tsx";
import {ActionException} from "../features/connect/lib/types.ts";
import {useNextAction} from "../features/request/lib/useNextAction.ts";
import {ErrorRoute} from "./DynamicViews/ErrorRoute.tsx";
import {submitAction} from "../features/connect/lib/service.ts";
import {SummaryTaiffInProgress} from "./DynamicViews/SummaryTaiffInProgress.tsx";
import DemoDisclaimer from "../shared/ui/DemoDisclaimer/DemoDisclaimer.tsx";
import {SummaryTaiffFailed} from "./DynamicViews/SummaryTaiffFailed.tsx";
import {RegionSelect} from "./DynamicViews/RegionSelect.tsx";
import { TariffSummary } from "./DynamicViews/TariffSummary.tsx";
import {
    completeCallback,
    isHavenwiseCallback,
    OutcomeTracker,
    postOutcome,
    takeSubmittedAction,
    wantsOutcomeMessage,
} from "../features/outcome/outcome.ts";

export const Connect = () => {
    const {state} = useLocation();
    const {response} = state || {};
    const {setTheme} = useTheme();
    const {token, ready: tokenParsed, proceed} = useNextAction();
    // Read once, from the URL the app opened: later navigations keep only fp_cot.
    const [outcomeMode] = useState(() => wantsOutcomeMessage(window.location.search));
    const tracker = useRef(new OutcomeTracker()).current;
    const {isFailed, error, requestId} = useMemo(() => {
        if (!response) {
            return { isFailed: false, error: '', requestId: undefined };
        }
        const maybeException = response as ActionException;
        const failed = maybeException.object === "error";
        return {
            isFailed: failed,
            error: failed ? maybeException.message : '',
            requestId: failed ? maybeException.request_id : undefined
        };
    }, [response]);

    useEffect(() => {
        if (!response && tokenParsed) {
            proceed(
                submitAction({
                    route: "session_start",
                    connect_token: token,
                    type: "submit",
                })
            )
        }
    }, [response, token, tokenParsed, proceed])

    useEffect(() => {
        setTheme(isFailed ? "failure" : 'light')
    }, [isFailed, setTheme])

    // HAV-1039: one structured outcome per session, posted when the flow finishes. Errors are not
    // a finish: the error view offers "Try again", and closing the page changes nothing.
    useEffect(() => {
        if (!outcomeMode || !response || isFailed) {
            return;
        }
        tracker.observe(response, takeSubmittedAction());
        if (response.route === "complete_tariff" && tracker.claimFinish()) {
            postOutcome(tracker.outcome());
        }
        if (response.route === "session_redirect" && isHavenwiseCallback(response.data.redirect_url)
            && tracker.claimFinish()) {
            completeCallback(response.data.redirect_url)
                .then((reached) => postOutcome(reached ? tracker.outcome() : tracker.failure()));
        }
    }, [outcomeMode, response, isFailed, tracker])

    const routerProps = useMemo(() => {
        return {
            unknown: UnknownView,
            error: ErrorRoute,
            postal_address_capture: PostalAddressCapture,
            provider_select: ProviderSelect,
            provider_name_capture: ProviderNameCapture,
            tariff_select: TariffSelect,
            contract_term_capture: ContractTermCapture,
            tariff_name_capture: TariffNameCapture,
            tariff_structure_select: CaptureTariffStructure,
            rate_fixed_capture: RateFixedCapture,
            rate_tod_capture: RateTodCapture,
            surcharge_capture: MarketSurchargeCapture,
            tariff_connection_pending: SummaryTaiffInProgress,
            tariff_connection_failed: SummaryTaiffFailed,
            tariff_summary: TariffSummary,
            complete_tariff: CompleteView,
            region_select: RegionSelect
        };
    }, []);


    if (!response) {
        return null;
    }

    if (response.route === "session_redirect") {
        // In outcome mode the effect above reaches our callback in the background instead. Any
        // other redirect (a supplier's own login) navigates as it always has.
        if (!outcomeMode || !isHavenwiseCallback(response.data.redirect_url)) {
            window.location.replace(response.data.redirect_url);
        }
        return null;
    }

    return (
        <ConnectProvider response={response} proceed={proceed}>
            <DemoDisclaimer/>
            <NavHeader />
            {error ? (
                <Exception token={response.connect_token} message={error} requestId={requestId}/>)
            : (
                <DynamicViewRouter {...routerProps} />
                )}
        </ConnectProvider>
    )
}
