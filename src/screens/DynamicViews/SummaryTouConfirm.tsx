import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler} from "react";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import TariffBadges from "../../shared/ui/TariffBadges/TariffBadges.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import TariffDetails from "../../shared/ui/TariffBadges/TariffDetails.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import DynamicRateSummary from "../../shared/ui/DynamicRateSummary/DynamicRateSummary.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {getCurrencySymbol} from "../../shared/lib/util.ts";

// Extend Window interface to include ReactNativeWebView
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}

export const SummaryTouConfirm = () => {
    const { action, proceed} = useConnect<'summary_tou_confirm'>();

    const {tariff, rates} = action.data;


    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();

        window.ReactNativeWebView?.postMessage(JSON.stringify({ action: 'handle submit started' }));

        setTimeout(() => {
            window.ReactNativeWebView?.postMessage(JSON.stringify({ action: 'handle submit timeout' }));
        }, 1000);        
        
        const promise = submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "SAVE"
        });

        window.ReactNativeWebView?.postMessage(JSON.stringify({ action: 'handle submit promise created' }));

        promise.then(() => {
            // Send message to app to close the WebView
            window.ReactNativeWebView?.postMessage(JSON.stringify({ action: 'close', fp_cot: action.connect_token }));
            
            // Don't call proceed - let the WebView close without navigation
        }).catch((error) => {
            // Only call proceed on error to show error state
            console.error('Submit action failed:', error);
            proceed(Promise.reject(error));
        });     
    }
    
    const handleEdit = () => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "EDIT"
        }));
    }
    const handleDisconnect = () => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "DISCONNECT"
        }));
    }

    return (
        <Layout component={"form"} onSubmit={handleSubmit} noValidate
                footer={(
                    <FooterActions variant={"secondary"} transparent={false}>
                        <ButtonBig label={"Edit tariff"} type="button" variant={'link'} size={"small"} onClick={handleEdit}/>
                        <ButtonBig label={"Save"} type="submit" size={"small"}/>
                    </FooterActions>
                )}>
            <MainHeading text="Your tariff" />
            <TariffBadges
                contract_type={action.direction}
                structure_type={action.data.market_rates_source ? 'MARKET' : 'TIMEOFUSE'}
            />
            <Box mt={16} rg={24} d={"column"} f={1}>
                <TariffDetails name={tariff.name} endDate={tariff.contract_end_date}/>
                <DynamicRateSummary currency={getCurrencySymbol(action.data.currency_code)} rates={rates} tiered={!!tariff.tiered} />
                <ButtonBig label={"Disconnect tariff"} variant="critical" type={"button"} onClick={handleDisconnect}/>
            </Box>
        </Layout>
    )
}
