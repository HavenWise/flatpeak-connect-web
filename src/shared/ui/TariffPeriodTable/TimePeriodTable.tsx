import styles from "./TimePeriodTable.module.scss";
import Box from "../Box/Box.tsx";
import Typography from "../Typography/Typography.tsx";
import TimePeriodTableRow from "./TimePeriodTableRow/TimePeriodTableRow.tsx";
import View from "../View/View.tsx";
import {RateEntryDecorated} from "../../../features/connect/lib/types.ts";

type TimePeriodTableProps = {
    currencyCode: string;
    rates: Array<RateEntryDecorated>;
}

export default function TimePeriodTable(props: TimePeriodTableProps) {
  const {rates, currencyCode} = props;
  return (
      <View>
          <Box d={"row"} jc={"space-between"} className={styles.caption}>
              <Typography color="mine-shaft_a50" variant="frnt_regular_14">
                  Time Periods:
              </Typography>
              <Typography color="mine-shaft_a50" variant="frnt_regular_14">
                  Tariff Rates:
              </Typography>
          </Box>
        <View>
            {rates.map((rate) => <TimePeriodTableRow key={rate.valid_from} rate={rate} currencyCode={currencyCode}/>)}
        </View>
      </View>
  );
}


