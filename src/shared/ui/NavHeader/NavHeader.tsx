import styles from "./NavHeader.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import Logotypes from "../Logotypes/Logotypes.tsx";
import NavigationButton from "../NavigationButton/NavigationButton.tsx";
import {useConnect} from "../../../features/connect/lib/ConnectProvider.tsx";
import {useTheme} from "../../../features/theme/ThemeProvider.tsx";
import {HasProviderSummaryTrait} from "../../../features/connect/lib/types.ts";
import { submitAction } from '../../../features/connect/lib/service.ts';

export type TitleBlockProps = {
    showLeftButton?: boolean;
    showRightButton?: boolean;
}
export default function NavHeader(props: TitleBlockProps) {
    const {
        showLeftButton = true,
        showRightButton = true,
    } = props;

    const classList = [styles.host];
    // const hasNoExtraUi  = screen.height === window.innerHeight;
    // if (hasNoExtraUi) {
    //     classList.push(styles['host_no-extra-ui'])
    // }
    const {action, proceed} = useConnect();
    const {theme} = useTheme();
    const { provider} = (action?.data || {}) as HasProviderSummaryTrait;

    const handleBack = () => {
        proceed(
            submitAction({
                route: action.route,
                type: 'submit',
                connect_token: action.connect_token,
                action: 'BACK',
            })
        )
    }

    const handleClose = () => {
        const hasCloseAction = action?.actions?.includes("CLOSE") ?? false;
        
        if (hasCloseAction) {
            proceed(
                submitAction({
                    route: action.route,
                    type: 'submit',
                    connect_token: action.connect_token,
                    action: 'CLOSE',
                })
            )
        } else {
            history.back();
        }
    }

    const hasBackAction = (action?.actions as string[] || []).includes("BACK");
    const showLogo = Boolean(provider && provider.logo_url) && theme !== "failure";
    const showTitle = Boolean(provider && !provider.logo_url && provider.display_name) && theme !== "failure";
    return (
        <View component={"header"} className={classList.join(' ')}>
            {showLeftButton && hasBackAction && (
                <NavigationButton action="Left" onClick={handleBack} className={styles.leftButton} />
            )}
            {(showLogo || showTitle) && (
                <View className={styles.centerContent}>
                    {showLogo && <Logotypes src={provider.logo_url} title={provider.display_name} />}
                    {showTitle && <View className={styles.customProvider}>
                        <Typography color="black_a40" variant="rp_regular_10" align="center" transform={"uppercase"} className={styles.title}>
                            {provider.display_name}
                        </Typography>
                    </View>}
                </View>
            )}
            {showRightButton && (
                <NavigationButton action="Close" 
                    onClick={handleClose}
                    className={styles.rightButton}
                />
            )}
        </View>
    );
}
