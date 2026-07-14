import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {useState} from "react";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import TariffBadges from "../../shared/ui/TariffBadges/TariffBadges.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import DynamicRateSummary from "../../shared/ui/DynamicRateSummary/DynamicRateSummary.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import FixedRateSummary from "../../shared/ui/FixedRatesummary/FixedRateSummary.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";

export const TariffSummary = () => {
    const { action, proceed} = useConnect<'tariff_summary'>();
    const [isReportProblemDisabled, setIsReportProblemDisabled] = useState(false);

    const {tariff, rates} = action.data;

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

    // The tariff is already connected by the time the summary is shown, so there is nothing
    // to "save" — Done simply completes/closes the session. Mirror NavHeader's close button:
    // submit CLOSE, and the server returns the complete_tariff view (which posts the close
    // message to the embedding app). Only offered when the server advertises CLOSE.
    const canClose = action.actions?.includes("CLOSE") ?? false;
    const handleDone = () => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "CLOSE"
        }));
    }
    
    const handleReportProblem = () => {
        setIsReportProblemDisabled(true);
        
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "WRONG_TARIFF"
        }))
        .finally(() => {
            setIsReportProblemDisabled(false);
        });
    }

    return (
        <Layout component={"form"} noValidate
                footer={(
                    <FooterActions variant={"secondary"} transparent={false}>
                        <ButtonBig label={"Disconnect"} type="button" variant={'link'} size={"small"} onClick={handleDisconnect}/>
                        <ButtonBig label={"Edit"} type="button" variant={'link'} size={"small"} onClick={handleEdit}/>
                        {canClose && <ButtonBig label={"Done"} type="button" size={"small"} onClick={handleDone}/>}
                    </FooterActions>
                )}>
            <Typography color="black" variant="basic_string" align="center">{tariff.name}</Typography>
            <MainHeading text="Tariff summary" />
            <TariffBadges
                contract_type={action.direction}
                structure_type={tariff.structure_type || 'FIXED'}
                onReportProblem={handleReportProblem}
                isReportProblemDisabled={isReportProblemDisabled}
            />
            <Box mt={16} rg={24} d={"column"} f={1}>
                {tariff.structure_type === 'FIXED' ? 
                 <FixedRateSummary currencyCode={action.data.currency_code} cost={rates.today?.[0]?.tariff.cost || 0} tiered={!!tariff.tiered} /> 
                 : <DynamicRateSummary currencyCode={action.data.currency_code} rates={rates} tiered={!!tariff.tiered} />}
            </Box>
        </Layout>
    )
}