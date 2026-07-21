import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import InfoMessage from "../../shared/ui/InfoMessage/InfoMessage.tsx";
import HourglassIcon from '../../shared/ui/icons/HourglassIcon.tsx';

export const SummaryTaiffInProgress = () => {
    const { action, proceed} = useConnect<'tariff_connection_pending'>();

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
        <Layout
            component={'main'}
            noValidate
            footer={
                <FooterActions variant={'secondary'}>
                    <ButtonBig label={'Cancel'} type="button" variant={'link'} size={'small'} onClick={handleDisconnect}
                    />
                    <ButtonBig label={'Start again'} type="button" size={'small'} onClick={handleEdit} />
                </FooterActions>
            }
        >
            <MainHeading text="Tariff connection in progress" />
            <Box mt={16} rg={24} pb={30} d={'column'} f={1} ai={'center'} jc={'space-between'}>
                <InfoMessage severity={'warning'}>
                    <Box pb={30} jc={'center'} d={'row'}>
                        <HourglassIcon />
                    </Box>
                    <Typography variant="button__forms21_book">
                        Retrieving your tariff is taking a little longer than expected. <br /><br />
                        Please check back again in a few hours—we'll have it ready as soon as possible.
                    </Typography>
                </InfoMessage>
            </Box>
        </Layout>
    );
};
