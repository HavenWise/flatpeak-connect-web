import styles from "./InfoMessage.module.scss";
import View from "../View/View.tsx";
import {PropsWithChildren} from "react";

export default function InfoMessage(props: PropsWithChildren<{severity?: "error" | "info" | "warning"}>) {
    const {children, severity = "info"} = props;
  return (
    <View className={[styles.host, styles[severity]].join(" ")}>
        {children}
    </View>
  );
}
