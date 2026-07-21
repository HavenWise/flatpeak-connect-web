import {memo, useMemo} from "react";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import Box from "../Box/Box.tsx";
import ColorDot from "../icons/ColorDot.tsx";
import {getCurrencySymbol, roundRateValue} from "../../lib/util.ts";
import styles from "./PriceNow.module.scss";
import TextArrowRight from '../icons/TextArrowRight.tsx';

type PriceNowProps = {
    rates: Array<{
        valid_from: string;
        valid_to: string;
        tariff: {
            cost: number;
        };
        peak: "Low" | "Medium" | "High";
    }>;
    currencyCode: string;
}

function PriceNow(props: PriceNowProps) {
    const {rates, currencyCode} = props;
    
    const currentInterval = useMemo(() => {
        const now = new Date();
        const currentRate = rates.find(rate => {
            const startTime = new Date(rate.valid_from);
            const endTime = new Date(rate.valid_to);
            const currentTime = now.getTime();
            return currentTime >= startTime.getTime() && currentTime < endTime.getTime();
        });
        
        if (!currentRate) {
            return null;
        }
        
        return {
            rate: currentRate,
            price: currentRate.tariff.cost
        };
    }, [rates]);
    
    const timeRange = useMemo(() => {
        if (!currentInterval?.rate) {
            return null;
        }
        
        const currentRate = currentInterval.rate;
        const roundedCurrentPrice = roundRateValue(currentRate.tariff.cost, 4, currencyCode);
        
        const sortedRates = [...rates].sort((a, b) => {
            const [aHours, aMinutes] = a.valid_from.substring(11, 16).split(":");
            const [bHours, bMinutes] = b.valid_from.substring(11, 16).split(":");
            const aTimeMinutes = parseInt(aHours) * 60 + parseInt(aMinutes);
            const bTimeMinutes = parseInt(bHours) * 60 + parseInt(bMinutes);
            return aTimeMinutes - bTimeMinutes;
        });
        
        const currentIndex = sortedRates.findIndex(rate => rate === currentRate);
        
        let startIndex = currentIndex;
        for (let i = currentIndex - 1; i >= 0; i--) {
            const rate = sortedRates[i];
            const roundedPrice = roundRateValue(rate.tariff.cost, 4, currencyCode);
            if (roundedPrice !== roundedCurrentPrice) {
                break;
            }
            startIndex = i;
        }
        
        let endIndex = currentIndex;
        for (let i = currentIndex + 1; i < sortedRates.length; i++) {
            const rate = sortedRates[i];
            const roundedPrice = roundRateValue(rate.tariff.cost, 4, currencyCode);
            if (roundedPrice !== roundedCurrentPrice) {
                break;
            }
            endIndex = i;
        }
        
        const startRate = sortedRates[startIndex];
        const endRate = sortedRates[endIndex];
        
        const [startHours, startMinutes] = startRate.valid_from.substring(11, 16).split(":");
        const [endHours, endMinutes] = endRate.valid_to.substring(11, 16).split(":");
        
        return {
            start: `${startHours}:${startMinutes}`,
            end: `${endHours}:${endMinutes}`
        };
    }, [currentInterval, rates, currencyCode]);
    
    const currentPrice = useMemo(() => {
        return currentInterval?.price || 0;
    }, [currentInterval]);

    const roundedPrice = roundRateValue(currentPrice, 4, currencyCode);
    const [base, decimals = "00"] = String(roundedPrice).split('.');
    
    return (
        <View className={styles.host}>
            <Box className={styles.content}>
                <Box className={styles.header}>
                    <Typography  variant="button__forms14_book">
                        Now
                    </Typography>
                    <Box className={styles.timeRange}>
                        <ColorDot peak={currentInterval?.rate?.peak || "Medium"} width={10} height={10} />
                        {timeRange ? (
                            <Typography color="black" variant="button__forms14_sup_regular">
                                {timeRange.start} <TextArrowRight /> {timeRange.end}
                            </Typography>
                        ) : (
                            <Typography color="black" variant="button__forms14_sup_regular">
                                No data
                            </Typography>
                        )}
                    </Box>
                </Box>
                <Box className={styles.priceRow}>
                    <Typography color="black" variant="button__forms30_regular">
                        {base}.{decimals}{"\u00A0"}
                    </Typography>
                    <Typography color="black" variant="button__forms20_regular">{getCurrencySymbol(currencyCode)}/kWh</Typography>
                </Box>
            </Box>
        </View>
    );
}

export default memo(PriceNow);
