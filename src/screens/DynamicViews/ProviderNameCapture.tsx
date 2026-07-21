import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler} from "react";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import BlockHeading from "../../shared/ui/BlockHeading/BlockHeading.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import InputText from "../../shared/ui/InputText/InputText.tsx";
import NoteIcon from "../../shared/ui/icons/NoteIcon.tsx";
import AddressCheckBlock from "../../shared/ui/AddressCheckBlock/AddressCheckBlock.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {formatPostalAddress} from "../../shared/lib/util.ts";

export const ProviderNameCapture = () => {
    const {action, proceed} = useConnect<"provider_name_capture">();
    const {postal_address} = action.data

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const {
            provider_name: {value},
        } = event.target as unknown as {[PostalAddressKey: string]: {value: string}};

        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                provider: {
                    name: value
                }
            }
        }));
    }

    const onChangeAddress = () => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "ADDRESS_CHANGE"
        }));
    }

    return (
        <Layout component={"form"} footer={<FooterActions><ButtonBig label={"Next"} type="submit"/></FooterActions>} onSubmit={handleSubmit} noValidate>
            <MainHeading text="Your provider" />
            <LeadingText>
                <Typography color="black_a40" variant="leading_string">
                    Sorry your provider is not listed yet. Please check if your postal
                    address is correct and enter Enter provider name.
                </Typography>
            </LeadingText>

            {((action.actions || []) as Array<string>).includes("ADDRESS_CHANGE") && (
                <AddressCheckBlock
                    address={formatPostalAddress(postal_address)}
                    onClick={onChangeAddress}
                />)
            }


            <Box mt={40} rg={16}>
                <BlockHeading text="Enter provider name" icon={<NoteIcon width={24} height={32}/>}/>
                <InputText
                    secondaryText="Enter provider name"
                    primaryText="Provider"
                    name={"provider_name"}
                    autoFocus={true}
                />
            </Box>
        </Layout>
    )
}
