import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler} from "react";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import InputText from "../../shared/ui/InputText/InputText.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";

export const TariffNameCapture = () => {
    const { action, proceed} = useConnect<"tariff_name_capture">();
    const {data: {tariff: {name: tariffName}}} = action;

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const {
            tariffName: {value},
        } = event.target as unknown as {[key: string]: {value: string}};
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                tariff: {
                    name: value
                }
            }
        }));
    }

    return (
        <Layout component={"form"} footer={<FooterActions><ButtonBig label={"Next"} type="submit"/></FooterActions>} onSubmit={handleSubmit} noValidate>
            <MainHeading text="What’s your tariff name?" />
            <LeadingText>
                <Typography color="black_a40" variant="leading_string">
                    What is the name of your tariff plan with your
                    electricity provider?
                </Typography>
            </LeadingText>
            <InputText
                secondaryText="Tariff plan name / description"
                primaryText="Tariff Plan Name"
                id="tariffName"
                name="tariffName"
                defaultValue={tariffName}
                autoFocus
            />
        </Layout>
    )
}
