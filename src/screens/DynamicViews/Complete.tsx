import {FormEventHandler, useCallback, useEffect} from "react";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import WarningIcon from "../../shared/ui/icons/WarningIcon.tsx";
import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";

// Allow signalling completion to a React Native WebView host (see closeEmbed below).
declare global {
    interface Window {
        ReactNativeWebView?: {
            postMessage: (message: string) => void;
        };
    }
}

export const CompleteView = () => {
    const {action} = useConnect<'complete_tariff'>();

    // When embedded in the HavenWise React Native app (WebView) or an iframe, tell the
    // host to close and hand back the connect token instead of navigating the web app to
    // the callback URL. Returns true when an embedding host was signalled.
    const closeEmbed = useCallback(() => {
        const message = JSON.stringify({action: 'close', fp_cot: action?.connect_token});
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(message);
            return true;
        }
        if (window.parent && window.parent !== window) {
            window.parent.postMessage(message, "*");
            return true;
        }
        return false;
    }, [action?.connect_token]);

    const redirect = useCallback(() => {
        if (closeEmbed()) {
            return;
        }
        location.href = `/`;
    }, [closeEmbed]);

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        redirect();
    }

    useEffect(() => {
        // Embedded hosts close immediately on completion; standalone web keeps the
        // original 30s auto-redirect to the callback URL.
        if (closeEmbed()) {
            return;
        }
        const timer = setTimeout(() => {
            redirect()
        }, 30000);
        return () => {
            clearTimeout(timer);
        }
    }, [closeEmbed, redirect]);


    return (
        <Layout component={"form"}
                footer={<FooterActions><ButtonBig label={"Next"} type="submit"></ButtonBig></FooterActions>}
                onSubmit={handleSubmit} noValidate>
            <MainHeading text="Complete" />
            <LeadingText>
                <Typography color="black_a40" variant="leading_string">
                    Now, you will be redirected to <a href="/"> original callback url</a>.<br/>
                    If it doesn't happen automatically, please click on the "Next" button.
                </Typography>
            </LeadingText>

            <Box pt={88} ai={"center"}>
                <WarningIcon color={'var(--color-fill-black)'}/>
            </Box>
        </Layout>
    )
}
