import styles from "./TariffDirectionBadge.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import DirectionIcon from "../icons/DirectionIcon.tsx";
import {ContractDirection} from "../../../features/connect/lib/types.ts";

type TariffDirectionBadgeProps = {
  value: ContractDirection
}

export default function TariffDirectionBadge(props: TariffDirectionBadgeProps) {
  const {value = 'IMPORT'} = props;
  const label = {'IMPORT': 'Import', 'EXPORT': 'Export'}[value];
  return (
    <View
      className={styles.host}
    >
      <DirectionIcon width={12} height={12} />
      <Typography color="blue_2" variant="button__forms12_sup_regular">
        {label}
      </Typography>
    </View>
  );
}
