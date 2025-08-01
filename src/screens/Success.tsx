import Typography from "../shared/ui/Typography/Typography.tsx";
import Box from "../shared/ui/Box/Box.tsx";
import Layout from "../shared/ui/Layout/Layout.tsx";

export const Success = () => {
    return (
        <Layout component="main">
            <Box jc="center">
                <Typography variant="heading_h1_string" align="center">
                    Successfully updated tariff!
                </Typography>
                <Typography variant="body" align="center">
                    You can now continue using the app via the tab bar below.
                </Typography>
            </Box>
        </Layout>
    );
}; 