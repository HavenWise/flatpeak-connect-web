import styles from "./TimePeriodTableRow.module.scss";
import View from "../../View/View.tsx";
import TimePeriod from "../TimePeriod/TimePeriod.tsx";
import Rate from "../Rate/Rate.tsx";
import { RateEntryDecorated} from "../../../../features/connect/lib/types.ts";

type TimePeriodTableRowProps = {
    currencyCode: string;
    rate: RateEntryDecorated;
}

export default function TimePeriodTableRow(props: TimePeriodTableRowProps) {
    const {currencyCode, rate: {valid_from,valid_to, peak, tariff: {cost}},} = props;
  return (
    <View className={styles.host}>
      <TimePeriod
          peak={peak}
          validFrom={valid_from}
          validTo={valid_to}
      />
        <View className={styles.rateCol}>
            <Rate cost={cost} currencyCode={currencyCode} units={"/kWh"} />
        </View>
    </View>
  );
}
