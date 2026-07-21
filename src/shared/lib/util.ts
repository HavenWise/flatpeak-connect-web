import {PostalAddress} from "../../features/connect/lib/types.ts";
import {COUNTRIES} from "./countries.ts";
import { convertCurrencyToMinorUnits, getCurrencyMinorSymbol } from './currencyUtils.ts';
import { CURRENCY_MINOR_DATA } from './currencyUnits.ts';

export function getCurrencySymbol(currencyCode: string, locale: string = 'en-US'): string {
    if (!currencyCode || currencyCode.trim() === '') {
        return '';
    }
    
    const minorSymbol = getCurrencyMinorSymbol(currencyCode);

    if (minorSymbol) {
        return minorSymbol;
    }
    
    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    });
    const parts = formatter.formatToParts(0);
    const currencyPart = parts.find(part => part.type === 'currency');
    return currencyPart ? currencyPart.value : '';
}

export function roundRateValue(value: number | string, precision = 4, currencyCode?: string):number {
    if (currencyCode && CURRENCY_MINOR_DATA[currencyCode]) {
        return convertCurrencyToMinorUnits(currencyCode, Number(value));
    }

    const valueWithEps = Math.floor(Number(value + "e" + precision));
    return Number(valueWithEps + "e" + -precision);
}

export function formatPostalAddress(address: PostalAddress): string {
    const { address_line1, address_line2, city, state, post_code, country_code } = address;

    const addressParts: Array<string|undefined> = [
        address_line1,
        address_line2,
        city,
        state,
        post_code,
        COUNTRIES.find((c) => c.value === country_code)?.label || country_code
    ];

    const nonEmptyParts = addressParts.filter(part => part);

    return nonEmptyParts.join(", ");
}
