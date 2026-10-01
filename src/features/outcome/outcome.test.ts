import {afterEach, describe, expect, it, vi} from "vitest";
import {CommonRenderRoute} from "../connect/lib/types.ts";
import {completeCallback, OutcomeTracker, postOutcome, wantsOutcomeMessage} from "./outcome.ts";

const summary = (structure_type?: "FIXED" | "TIME_OF_DAY" | "MARKET" | "DYNAMIC") => ({
    route: "tariff_summary",
    connect_token: "cot_1",
    type: "render",
    data: {
        currency_code: "GBP",
        market_rates_source: false,
        tariff: {name: "Agile Octopus", structure_type},
        provider: {id: "prv_1", display_name: "Octopus Energy", logo_url: ""},
        rates: {today: [], yesterday: [], tomorrow: []},
    },
}) as unknown as CommonRenderRoute;

const route = (name: string) => ({route: name, connect_token: "cot_1", type: "render"}) as unknown as CommonRenderRoute;

describe("wantsOutcomeMessage", () => {
    it("is opt-in, so app builds already in the field keep the legacy close", () => {
        expect(wantsOutcomeMessage("?fp_cot=cot_1&outcome=message")).toBe(true);
        expect(wantsOutcomeMessage("?fp_cot=cot_1")).toBe(false);
        expect(wantsOutcomeMessage("?fp_cot=cot_1&outcome=close")).toBe(false);
    });
});

describe("OutcomeTracker", () => {
    it("reports the tariff Flatpeak summarised as connected", () => {
        const tracker = new OutcomeTracker();
        tracker.observe(summary("TIME_OF_DAY"));

        expect(tracker.outcome()).toEqual({
            status: "connected",
            tariff: {name: "Agile Octopus", supplier: "Octopus Energy", varies: true},
        });
    });

    it.each([
        ["FIXED", false],
        [undefined, false],
        ["TIME_OF_DAY", true],
        ["MARKET", true],
        ["DYNAMIC", true],
    ] as const)("structure %s varies: %s", (structure, varies) => {
        const tracker = new OutcomeTracker();
        tracker.observe(summary(structure));

        expect(tracker.outcome().tariff?.varies).toBe(varies);
    });

    it("is a failure when the session ends without a summary", () => {
        const tracker = new OutcomeTracker();
        tracker.observe(route("provider_select"));

        expect(tracker.outcome()).toEqual({status: "failed", tariff: null});
    });

    it("forgets the tariff after a failed reconnect, and remembers a later success", () => {
        const tracker = new OutcomeTracker();
        tracker.observe(summary("FIXED"));
        tracker.observe(route("tariff_connection_failed"));
        expect(tracker.outcome().status).toBe("failed");

        tracker.observe(summary("DYNAMIC"));
        expect(tracker.outcome().status).toBe("connected");
    });

    it("finishes once, so the app gets exactly one outcome", () => {
        const tracker = new OutcomeTracker();

        expect(tracker.claimFinish()).toBe(true);
        expect(tracker.claimFinish()).toBe(false);
    });
});

describe("postOutcome", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("posts the JSON outcome over the React Native WebView bridge", () => {
        const postMessage = vi.fn();
        const win = {ReactNativeWebView: {postMessage}} as unknown as Window & typeof globalThis;
        Object.assign(win, {parent: win});
        vi.stubGlobal("window", win);

        postOutcome({status: "failed", tariff: null});

        expect(postMessage).toHaveBeenCalledWith('{"status":"failed","tariff":null}');
    });
});

describe("completeCallback", () => {
    afterEach(() => vi.unstubAllGlobals());

    it("is reached on any 2xx", async () => {
        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok: true}));

        expect(await completeCallback("https://api.example/tariff/flatpeak/callback?fp_cot=cot_1")).toBe(true);
    });

    it("is not reached on a network error or a non-2xx", async () => {
        vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
        expect(await completeCallback("https://api.example/cb")).toBe(false);

        vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok: false}));
        expect(await completeCallback("https://api.example/cb")).toBe(false);
    });
});
