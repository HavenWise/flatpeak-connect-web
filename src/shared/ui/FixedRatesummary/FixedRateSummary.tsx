import styles from "./FixedRateSummary.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import {getCurrencySymbol, roundRateValue} from "../../lib/util.ts";

type FixedRatesummaryProps = {
  tiered: boolean;
  cost?: number | string;
  currencyCode: string;
}
export default function FixedRateSummary(props: FixedRatesummaryProps) {
  const {cost = 0, currencyCode, tiered} = props;

  return (
    <View className={styles.host}>
      <View className={styles.rateWrapper}>
        <Typography color="black" variant="rp_300_72">
          {roundRateValue(cost, 4, currencyCode) || '0.00'}{getCurrencySymbol(currencyCode)}
        </Typography>
        <Typography color="black" variant="button__forms32_book">
          /kWh
        </Typography>
      </View>
      {tiered && <View className={styles.tierData}>
        <Typography color="black_a40" variant="button__forms16_book">
          Tiered tariff, lowest tier displayed
        </Typography>
      </View>}
    </View>
  );
}
