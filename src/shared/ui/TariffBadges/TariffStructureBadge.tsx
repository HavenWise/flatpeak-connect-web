import styles from "./TariffStructureBadge.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import {TariffStructureType} from "../../../features/connect/lib/types.ts";
import HandIcon from "../icons/HandIcon.tsx";
import MarketIcon from "../icons/MarketIcon.tsx";
import ClockIcon from "../icons/ClockIcon.tsx";

type TariffStructureBadgeProps = {
    value: TariffStructureType
}

export default function TariffStructureBadge(props: TariffStructureBadgeProps) {
    const {value = 'FIXED'} = props;

    const label = {
        'FIXED': 'Flat Rate',
        'TIME_OF_DAY': 'Day & night',
        'DYNAMIC':'Variable',
        'MARKET': 'Market Rate',
        'STATIC': 'Variable'
    }[value] || 'Variable';
 
    const Icon = {
        'FIXED': HandIcon,
        'TIME_OF_DAY': ClockIcon,
        'DYNAMIC': ClockIcon,
        'MARKET': MarketIcon,
        'STATIC': ClockIcon
    }[value] || ClockIcon;

  return (
    <View className={styles.host}>
      <Icon width={14} height={14} color={'var(--color-fill-black)'}/>
      <Typography color="black" variant="button__forms12_sup_regular">
          {label}
      </Typography>
    </View>
  );
}
