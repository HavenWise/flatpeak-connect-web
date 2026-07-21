import Box from "../../Box/Box.tsx";
import Typography, {FontVariant} from "../../Typography/Typography.tsx";
import styles from "./Rate.module.scss";
import {getCurrencySymbol, roundRateValue} from "../../../lib/util.ts";

type RateProps = {
    currencyCode: string;
    cost: number;
    units?: string;
    textVariant?: FontVariant;
}

export default function Rate(props:RateProps) {
  const {cost, currencyCode, textVariant = "basic_string",  units} = props;

  const roundedCost = roundRateValue(cost, 4, currencyCode);
  const [base, decimals = "00"] = String(roundedCost).split('.')

  return (
    <Box cg={1} d="row">
      <Typography color="black" variant={textVariant} className={styles.numeric}>
          {base}
      </Typography>
      <Typography color="black" variant={textVariant} className={styles.dot}>
          .
      </Typography>
      <Typography color="black" variant={textVariant} className={styles.numeric}>
          {decimals}
      </Typography>
      <Typography color="black" variant={textVariant}>
          {"\u00A0" + getCurrencySymbol(currencyCode)}
      </Typography>
      {units && (<Typography color="black" variant="basic_string">{units}</Typography>)}
    </Box>
  );
}
