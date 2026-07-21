import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler, useState} from "react";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import {CommonRenderRoute} from "../../features/connect/lib/types.ts";
import {submitAction} from "../../features/connect/lib/service.ts";
import Calendar from '../../shared/ui/Calendar/Calendar.tsx';

export const ContractTermCapture = () => {
    const { proceed, action} = useConnect();

    const {contract_end_date} = (action as CommonRenderRoute<'contract_term_capture'>).data;

    const [selectedDate, setSelectedDate] = useState<Date | null>(
        contract_end_date ? new Date(contract_end_date) : null
    );

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    const handleSubmit: FormEventHandler = event => {
        event.preventDefault();
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            ...(selectedDate && {
                data: {
                    contract_end_date: selectedDate,
                }
            })
        }));
    }

        const skipUntilTerminated = () => {
            proceed(submitAction({
                route: "contract_term_capture",
                type: "submit",
                connect_token: action.connect_token
            }));
        }

    return (
        <Layout
            component={'form'}
            footer={
                <FooterActions>
                    <ButtonBig label={'Skip / Until terminated'} variant={'outlined'} type={'button'} onClick={skipUntilTerminated} />
                    <ButtonBig label={'Next'} type='submit' />
                </FooterActions>
            }
            onSubmit={handleSubmit}
            noValidate
        >
            <MainHeading text="Contract expiry date" />
            <LeadingText>
                <Typography color="black_a40" variant="leading_string">
                    Tell us when your contract expires so we can remind you to update this connection when it happens.
                </Typography>
            </LeadingText>
            <Calendar
                placeholder='Choose expiry date'
                value={selectedDate || undefined}
                onChange={handleDateChange}
                name='contractEndDate'
            />
        </Layout>
    )
}
