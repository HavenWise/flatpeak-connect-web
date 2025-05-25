import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler} from "react";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import TariffBadges from "../../shared/ui/TariffBadges/TariffBadges.tsx";
import FixedRateSummary from "../../shared/ui/FixedRatesummary/FixedRateSummary.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import TariffDetails from "../../shared/ui/TariffBadges/TariffDetails.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {getCurrencySymbol} from "../../shared/lib/util.ts";

declare global {
    interface Window {
      ReactNativeWebView?: {
        postMessage: (message: string) => void;
      };
    }
  }  

export const SummaryFixedConfirm = () => {
    const { action, proceed} = useConnect<'summary_fixed_confirm'>();

    const {tariff, cost} = action.data;
    const handleSubmit: FormEventHandler = (event) => {
        // Send message to app to close the WebView
        window.ReactNativeWebView?.postMessage(JSON.stringify({ action: 'close' }));
        event.preventDefault();
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "SAVE"
        }));
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
                    <FooterActions variant={"secondary"}>
                        <ButtonBig label={"Edit tariff"} type="button" variant={'link'} size={"small"} onClick={handleEdit}/>
                        <ButtonBig label={"Save"} type="submit" size={"small"}/>
                    </FooterActions>
                )}>
            <MainHeading text="Your tariff" />
            <TariffBadges
                contract_type={action.direction}
                structure_type={'FIXEDRATE'}
            />
            <Box mt={16} rg={24} d={"column"} f={1}>
                <TariffDetails name={tariff.name} endDate={tariff.contract_end_date}/>
                <FixedRateSummary
                    currency={getCurrencySymbol(action.data.currency_code)}
                    cost={cost}
                    tiered={!!tariff.tiered} />
                <ButtonBig label={"Disconnect tariff"} variant="critical" type={"button"} onClick={handleDisconnect} />
            </Box>
        </Layout>
    )
}
