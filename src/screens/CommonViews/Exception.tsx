import Layout from "../../shared/ui/Layout/Layout.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import WarningIcon from "../../shared/ui/icons/WarningIcon.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import {ReactElement} from "react";

type ExceptionProps = {
    message?: string | ReactElement;
    token?: string;
    requestId?: string;
}

export const Exception = (props: ExceptionProps) => {
    const {message, token, requestId} = props

    return (
        <Layout component={"main"} footer={<FooterActions>
            <ButtonBig label={"Try again"} variant={'critical-invert'} onClick={() => history.back()}/>              
            </FooterActions>}>
            <MainHeading text="Error" />
            <LeadingText>
                <Typography color="white" variant="leading_string">
                    {token && (<>Token: {token}<br/><br/></>)}
                    {requestId && (<>Request: {requestId}<br/><br/></>)}
                    {message || 'Something went wrong, or there was a problem with your connection.'}<br/><br/>
                    Please try again later; if the problem persists, take a screenshot of this page and contact support.
                </Typography>
            </LeadingText>
            <Box pt={88} ai={"center"}>
                <WarningIcon/>
            </Box>
        </Layout>
    )
}
