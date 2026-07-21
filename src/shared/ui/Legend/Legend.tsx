import styles from "./Legend.module.scss";
import View from "../View/View.js";
import Typography from "../Typography/Typography.js";
import ColorDot from "../icons/ColorDot.tsx";

export default function Legend() {
    return (
        <View className={styles.host}>
            <View className={styles.timePeriod}>
                <ColorDot peak="Low"/>
                <Typography color="black" variant="button__forms12_book">
                    Off Peak
                </Typography>
            </View>
            <View className={styles.timePeriod}>
                <ColorDot peak="Medium"/>
                <Typography color="black" variant="button__forms12_book">
                    Mid Peak
                </Typography>
            </View>
            <View className={styles.timePeriod}>
                <ColorDot peak="High"/>
                <Typography color="black" variant="button__forms12_book">
                    High Peak
                </Typography>
            </View>
        </View>
    );
}
