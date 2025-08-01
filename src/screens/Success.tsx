import Typography from "../shared/ui/Typography/Typography.tsx";
import Box from "../shared/ui/Box/Box.tsx";
import Layout from "../shared/ui/Layout/Layout.tsx";
import { useEffect } from "react";

export const Success = () => {
    useEffect(() => {
        // Send close event to React Native WebView
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
                action: 'close'
            }));
        }
    }, []);

    return (
        <Layout component="main">
            <Box jc="center" ai="center" d="column" rg={24} mih="80vh">
                <Box>
                    <Typography variant="heading_h1_string" align="center">
                        Successfully updated tariff!
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="body" align="center">
                        You can now continue using the app via the tab bar below.
                    </Typography>
                </Box>
            </Box>
        </Layout>
    );
}; 