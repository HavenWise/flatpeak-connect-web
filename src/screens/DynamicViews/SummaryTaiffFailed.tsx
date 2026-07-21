import { useConnect } from '../../features/connect/lib/ConnectProvider.tsx';
import Layout from '../../shared/ui/Layout/Layout.tsx';
import MainHeading from '../../shared/ui/MainHeading/MainHeading.tsx';
import ButtonBig from '../../shared/ui/ButtonBig/ButtonBig.tsx';
import Box from '../../shared/ui/Box/Box.tsx';
import FooterActions from '../../shared/ui/FooterActions/FooterActions.tsx';
import { submitAction } from '../../features/connect/lib/service.ts';
import Typography from '../../shared/ui/Typography/Typography.tsx';
import InfoMessage from '../../shared/ui/InfoMessage/InfoMessage.tsx';
import CloudOffIcon from '../../shared/ui/icons/CloudOffIcon.tsx';

export const SummaryTaiffFailed = () => {
    const { action, proceed } = useConnect<'tariff_connection_failed'>();

    const handleEdit = () => {
        proceed(
            submitAction({
                route: action.route,
                type: 'submit',
                connect_token: action.connect_token,
                action: 'EDIT',
            })
        )
    }

    const handleDisconnect = () => {
        proceed(
            submitAction({
                route: action.route,
                type: 'submit',
                connect_token: action.connect_token,
                action: 'DISCONNECT',
            })
        )
    }

    return (
        <Layout
            component={'main'}
            noValidate
            footer={
                <FooterActions variant={'secondary'} transparent={false}>
                    <ButtonBig
                        label={'Cancel'}
                        type='button'
                        variant={'link'}
                        size={'small'}
                        onClick={handleDisconnect}
                    />
                    <ButtonBig label={'Start again'} type='button' size={'small'} onClick={handleEdit} />
                </FooterActions>
            }>
            <MainHeading text='Tariff connection failed' />
            <Box mt={16} rg={24} pb={30} d={'column'} f={1} ai={'center'} jc={'space-between'}>
                <InfoMessage severity={'error'}>
                    <Box pb={30} jc={'center'} d={'row'}>
                        <CloudOffIcon color={'var(--color-fill-red)'} width={40} height={40} />
                    </Box>
                    <Typography color='black' variant='button__forms24_book'>
                        Connection failed. We are unable to retrieve your tariff. <br /><br />
                        Please disconnect it using the link below and try again.
                    </Typography>
                </InfoMessage>
            </Box>
        </Layout>
    );
}
