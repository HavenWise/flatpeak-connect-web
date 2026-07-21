import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";

import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import TariffStructureButton from "../../shared/ui/TariffStructureButton/TariffStructureButton.tsx";
import HandIcon from "../../shared/ui/icons/HandIcon.tsx";
import ClockIcon from "../../shared/ui/icons/ClockIcon.tsx";
import MarketIcon from "../../shared/ui/icons/MarketIcon.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {TariffStructureOption} from "../../features/connect/lib/types.ts";

export const CaptureTariffStructure = () => {
    const {action, proceed} = useConnect<"tariff_structure_select">();
    const {options} = action.data;

    const selectRateType = (type: TariffStructureOption) => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                options: [type]
            }
        }));
    }

    return (
        <Layout component={"main"}>
            <MainHeading text="Your tariff plan structure" />
            <LeadingText>
                <Typography color="black_a40" variant="leading_string">
                    What affects your rate?
                </Typography>
            </LeadingText>
            <Box rg={8}>
                {options.includes('FIXED') && (
                    <TariffStructureButton
                        key={'fixed'}
                        description="My tariff is flat-rate"
                        mainText="Fixed Rate"
                        icon={<HandIcon/>}
                        onClick={() => selectRateType('FIXED')}
                    />
                )}
                {options.includes('TIME_OF_DAY') && (
                    <TariffStructureButton
                        key={"time-of-day"}
                        mainText="Day & Night"
                        description="My tariff varies by time of day"
                        icon={<ClockIcon/>}
                        onClick={() => selectRateType('TIME_OF_DAY')}
                    />
                )}
                {options.includes('MARKET') && (
                    <TariffStructureButton
                        key={"market"}
                        mainText="Market"
                        description="My tariff follows market prices"
                        icon={<MarketIcon/>}
                        onClick={() => selectRateType('MARKET')}
                    />
                )}
            </Box>
        </Layout>
    )
}
