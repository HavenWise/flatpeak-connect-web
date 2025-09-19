import styles from "./NavHeader.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import Logotypes from "../Logotypes/Logotypes.tsx";
import NavigationButton from "../NavigationButton/NavigationButton.tsx";
import {useConnect} from "../../../features/connect/lib/ConnectProvider.tsx";
import {useTheme} from "../../../features/theme/ThemeProvider.tsx";
import {HasProviderSummaryTrait} from "../../../features/connect/lib/types.ts";

export type TitleBlockProps = {
    showLeftButton?: boolean;
    showRightButton?: boolean;
}
export default function NavHeader(props: TitleBlockProps) {
    const {
        showLeftButton = true,
        showRightButton = false,
    } = props;

    const classList = [styles.host];
    // const hasNoExtraUi  = screen.height === window.innerHeight;
    // if (hasNoExtraUi) {
    //     classList.push(styles['host_no-extra-ui'])
    // }
    const {action} = useConnect();
    const {theme} = useTheme();
    const { provider} = (action?.data || {}) as HasProviderSummaryTrait;

    const showLogo = Boolean(provider && provider.logo_url) && theme !== "failure";
    const showTitle = Boolean(provider && !provider.logo_url && provider.display_name) && theme !== "failure";
    return (
        <View component={"header"} className={classList.join(' ')}>
            {showLeftButton && <NavigationButton action="Left" onClick={() => history.back()}/>}
            {showLogo && <Logotypes src={provider.logo_url} title={provider.display_name} />}
            {showTitle && <View className={styles.customProvider}>
                <Typography color="black_a40" variant="rp_regular_10" align="center" transform={"uppercase"} className={styles.title}>
                    {provider.display_name}
                </Typography>
            </View>}
            {showRightButton && <NavigationButton action="Close" onClick={() => {
                location.href = `/`
            }} />}
        </View>
    );
}
