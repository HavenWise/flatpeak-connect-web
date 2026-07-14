import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler, useState, useMemo} from "react";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import BlockHeading from "../../shared/ui/BlockHeading/BlockHeading.tsx";
import InputRate from "../../shared/ui/InputRate/InputRate.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import NightIcon from "../../shared/ui/icons/NightIcon.tsx";
import DayIcon from "../../shared/ui/icons/DayIcon.tsx";
import Separator from "../../shared/ui/Separator/Separator.tsx";
import InputTime from "../../shared/ui/InputTime/InputTime.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {getCurrencySymbol} from "../../shared/lib/util.ts";
import { convertCurrencyToMinorUnits, convertCurrencyToMajorUnits } from '../../shared/lib/currencyUtils.ts';

type HourEntry = {
    cost: number;
    valid_from: string;
    valid_to: string;
};

type ConsolidatedPeriod = {
    cost: number;
    start: string;
    end: string;
    duration: number;
};

const getDuration = (from: string, to: string): number => {
    const [fromH, fromM] = from.split(':').map(Number);
    const [toH, toM] = to.split(':').map(Number);
    const fromMin = fromH * 60 + fromM;
    const toMin = toH * 60 + toM;
    return toMin < fromMin ? (24 * 60 - fromMin) + toMin : toMin - fromMin;
};

const processHours = (hours: HourEntry[]): {day: ConsolidatedPeriod | null; night: ConsolidatedPeriod | null} => {
    if (!hours?.length) return {day: null, night: null};
    
    const byCost = new Map<number, HourEntry[]>();
    for (const hour of hours) {
        const existing = byCost.get(hour.cost) || [];
        existing.push(hour);
        byCost.set(hour.cost, existing);
    }
    
    const periods: ConsolidatedPeriod[] = [];
    
    for (const [cost, entries] of byCost) {
        const ranges = entries.map(e => ({
            from: e.valid_from.substring(0, 5),
            to: e.valid_to.substring(0, 5)
        }));
        
        let start: string;
        let end: string;
        
        if (ranges.length === 1) {
            ({from: start, to: end} = ranges[0]);
        } else {
            const afterMidnight = ranges.find(r => r.from === "00:00");
            const beforeMidnight = ranges.find(r => r.to === "00:00");
            
            if (afterMidnight && beforeMidnight) {
                start = beforeMidnight.from;
                end = afterMidnight.to;
            } else {
                const starts = ranges.map(r => r.from).sort();
                const ends = ranges.map(r => r.to).sort().reverse();
                start = starts[0];
                end = ends[0];
            }
        }
        
        periods.push({cost, start, end, duration: getDuration(start, end)});
    }
    
    if (periods.length === 1) {
        return {day: periods[0], night: null};
    }
    
    periods.sort((a, b) => b.duration - a.duration);
    return {day: periods[0], night: periods[1] || null};
};

export const RateTodCapture = () => {
    const { action, proceed} = useConnect<"rate_tod_capture">();

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const form = event.target as unknown as Record<string, {value: string}>;
        const currencyCode = action.data.currency_code;
        
        const initialHours = action.data.hours || [];
        const { night: initialNight } = processHours(initialHours);
        const hours = [
            {
                valid_from: `${form.day_startTime.value}:00`,
                valid_to: `${form.day_endTime.value}:00`,
                cost: convertCurrencyToMajorUnits(currencyCode, Number(form.day_cost.value))
            },
        ];

        if (!initialHours.length || initialNight !== null) {
            hours.push({
                valid_from: `${form.night_startTime.value}:00`,
                valid_to: `${form.night_endTime.value}:00`,
                cost: convertCurrencyToMajorUnits(currencyCode, Number(form.night_cost.value))
            });
        }

        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: { hours }
        }));
    };

    const currencyCode = action.data.currency_code;

    const {day, night} = useMemo(
        () => processHours(action.data.hours || []),
        [action.data.hours]
    );

    const [dayStart, setDayStart] = useState(() => day?.start ?? "00:00");
    const [dayEnd, setDayEnd] = useState(() => day?.end ?? "00:00");
    const [nightStart, setNightStart] = useState(() => night?.start ?? "00:00");
    const [nightEnd, setNightEnd] = useState(() => night?.end ?? "00:00");
    const dayCost = day ? convertCurrencyToMinorUnits(currencyCode, day.cost) : 0;
    const nightCost = night ? convertCurrencyToMinorUnits(currencyCode, night.cost) : 0;

    const timeInputsKey = useMemo(
        () => [action.connect_token, day?.start, day?.end, night?.start, night?.end].join(":"),
        [action.connect_token, day?.start, day?.end, night?.start, night?.end]
    );

    return (
      <Layout
        component={'form'}
        footer={
          <FooterActions>
            <ButtonBig label={'Next'} type="submit" />
          </FooterActions>
        }
        onSubmit={handleSubmit}
        noValidate
      >
        <MainHeading text="Day & night tariff plan" />
        <LeadingText>
          <Typography color="black_a40" variant="leading_string">
            Please input periods and rates for day and night, including VAT.
          </Typography>
        </LeadingText>
        <Box rg={16}>
          <BlockHeading text={`Day rate (${getCurrencySymbol(action.data.currency_code)}/kWh)`} icon={<DayIcon width={24} height={32} />} />
          <Box cg={8} d={'row'} pb={28}>
            <InputTime
              key={`day_start_${timeInputsKey}`}
              name="day_startTime"
              value={dayStart}
              label={'Start'}
              variant={'primary'}
              onChange={(e) => {
                setDayStart(e.target.value)
                setNightEnd(e.target.value)
              }}
            />
            <InputTime
              key={`day_end_${timeInputsKey}`}
              name="day_endTime"
              value={dayEnd}
              label={'End'}
              variant={'primary'}
              onChange={(e) => {
                setDayEnd(e.target.value)
                setNightStart(e.target.value)
              }}
            />
            <InputRate 
                key={`day_cost_${dayCost}`}
                name="day_cost" 
                defaultValue={dayCost}
                suffix={false}      
                label="Rate"
            />
          </Box>

          <Separator />

          <BlockHeading text={`Night rate (${getCurrencySymbol(action.data.currency_code)}/kWh)`} icon={<NightIcon width={24} height={32} />} />
          <Box cg={8} d={'row'} pb={28}>
            <InputTime
              key={`night_start_${timeInputsKey}`}
              name="night_startTime"
              value={nightStart}
              label={'Start'}
              variant={'primary'}
              onChange={(e) => {
                setNightStart(e.target.value)
                setDayEnd(e.target.value)
              }}
            />
            <InputTime
              key={`night_end_${timeInputsKey}`}
              name="night_endTime"
              value={nightEnd}
              label={'End'}
              variant={'primary'}
              onChange={(e) => {
                setNightEnd(e.target.value)
                setDayStart(e.target.value)
              }}
            />
            <InputRate 
                key={`night_cost_${nightCost}`}
                name="night_cost" 
                defaultValue={nightCost}
                suffix={false}
                label="Rate"
            />
          </Box>
        </Box>
      </Layout>
    )
}
