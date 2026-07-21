import styles from "./BarChart.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import {RateEntryDecorated, RatePeriodType} from "../../../features/connect/lib/types.ts";
import Legend from "../Legend/Legend.tsx";
import {useEffect, useMemo, useState} from "react";
import {expandRates} from "./util.ts";
import Rate from "../TariffPeriodTable/Rate/Rate.tsx";

type BarChartProps = {
    currencyCode: string;
    rates: Array<RateEntryDecorated>;
    period: RatePeriodType;
}

const placeholderBars = new Array(24).fill(0);
export const BarChart = (props: BarChartProps) => {
    const {currencyCode, rates, period} = props;
    const [animated, setAnimated] = useState(false);

    const classNames = [styles.bars];
    if (animated) {
        classNames.push(styles.animated);
    }

    useEffect(() => {
        setAnimated(true);
    }, []);

    const data = useMemo(() => {
        const values = rates.map((r) => Number(r.tariff.cost));
        if (!rates?.length) {
            return {
                max: 0,
                min: 0,
                values,
                rates: []
            }
        }
        return {
            max: Math.max(...values),
            min: Math.min(0, ...values),
            values,
            rates: expandRates(rates)
        };
    }, [rates]);

    const maxOffset = data.max - data.min;
    const barsCssProps: Record<string, string | number | undefined> = {
        '--bar-offset': `${(data.min / maxOffset * -100).toFixed(2)}%`
    };
    return (
        <View className={styles.host}>
            <View className={styles.chartWrapper}>
                <View className={styles.chartContent}>
                    {data.rates.length ? <View className={classNames.join(" ")} style={barsCssProps}>
                        {data.rates.map((col, index) => {
                            const cssProps: Record<string, string | number | undefined> = { };
                            const value = Number(col.tariff.cost);
                            const isPositive = value >= 0;
                            const factor = isPositive ? 100 : 100;
                            cssProps['--bar-progress'] = `${(value / maxOffset * factor).toFixed(2)}%`;
                            cssProps['--bar-color'] = `var(--bar-color-${col.peak.toLowerCase()})`;
                            return (
                                <View key={index.toString()} className={styles.bar} style={cssProps}/>
                            )
                        })}
                    </View> : (
                        <View className={styles.bars}>
                            {placeholderBars.map((_, index) => {
                                const cssProps: Record<string, string | number | undefined> = { };
                                cssProps['--bar-progress'] = `100%`;
                                return (
                                    <View key={index.toString()} className={styles.bar} style={cssProps}/>
                                )
                            })}
                            <View className={styles.noDataWarning}>
                                <Typography variant={"heading_h2_text"}  align={"center"}>Updating..</Typography>
                                <Typography variant={"button__forms16_book"} align={"center"}>
                                    {period === "tomorrow"
                                        ? "Prices are not yet available. They usually update in the afternoon. Please check again soon."
                                        : "The tariff for this period is not available yet. Please check back later."
                                    }
                                </Typography>
                            </View>
                        </View>
                    )}
                    <View className={styles.xAxis}>
                        <Typography color="black" variant="rp_300_11">
                            00<sup>:00</sup>
                        </Typography>
                        <Typography color="black" variant="rp_300_11">
                            04<sup>:00</sup>
                        </Typography>
                        <Typography color="black" variant="rp_300_11">
                            08<sup>:00</sup>
                        </Typography>
                        <Typography color="black" variant="rp_300_11">
                            12<sup>:00</sup>
                        </Typography>
                        <Typography color="black" variant="rp_300_11">
                            16<sup>:00</sup>
                        </Typography>
                        <Typography color="black" variant="rp_300_11">
                            20<sup>:00</sup>
                        </Typography>
                    </View>
                </View>
                <View className={styles.yAxis}>
                    <Rate currencyCode={currencyCode} cost={data.max ? data.max: 0.00} textVariant={"rp_300_11"}/>
                    <Rate currencyCode={currencyCode} cost={(data.max || data.min) ? (data.max - (data.max - data.min) / 2) : 0.00} textVariant={"rp_300_11"}/>
                    <Rate currencyCode={currencyCode} cost={data.min ? data.min: 0.00}  textVariant={"rp_300_11"}/>
                </View>
            </View>
            <Legend />
    </View>
    )
}
