import styles from "./TabsSelector.module.scss";
import View from "../View/View.js";
import SelectorTab from "../SelectorTab/SelectorTab.tsx";
import SelectorTabsBlockSlidingBackground from "../SlidingBackground/SlidingBackground.tsx";
import TouchableOpacity from "../../TouchahbleOpacity/TouchableOpacity.tsx";
import {RatePeriodType} from "../../../features/connect/lib/types.ts";

const TAB_LABELS: Record<RatePeriodType, string> = {
    yesterday: "Yesterday",
    today: "Today",
    tomorrow: "Tomorrow",
};

type TabsSelectorProps = {
    currentTab: RatePeriodType;
    changeTab: (tab: RatePeriodType) => void;
    showYesterdayTab?: boolean;
}
export default function TabsSelector(props: TabsSelectorProps) {
    const {currentTab, changeTab, showYesterdayTab = true} = props;
    const tabs: RatePeriodType[] = showYesterdayTab ? ["yesterday", "today", "tomorrow"] : ["today", "tomorrow"];
    const index = tabs.indexOf(currentTab);
    const safeIndex = index === -1 ? 0 : index;
  return (
    <View className={styles.host}>
        <View className={styles.wrapper}>
            <SelectorTabsBlockSlidingBackground index={safeIndex} total={tabs.length} />
            {tabs.map((tab) => (
                <TouchableOpacity key={tab} className={styles.caption} onClick={() => changeTab(tab)}>
                    <SelectorTab label={TAB_LABELS[tab]} />
                </TouchableOpacity>
            ))}
        </View>
    </View>
  );
}
