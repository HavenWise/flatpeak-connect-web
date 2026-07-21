import Big from 'big.js';
import { CURRENCY_MINOR_DATA } from './currencyUnits.ts';

const MINOR_DECIMALS = 4;

export function getCurrencyMinorSymbol(currencyCode: string): string | null {
  return CURRENCY_MINOR_DATA[currencyCode]?.symbol || null;
}

export function convertCurrencyToMinorUnits(currencyCode: string, amount: number): number {
  if (!CURRENCY_MINOR_DATA[currencyCode]) {
    return amount;
  }
  
  const exponent = CURRENCY_MINOR_DATA[currencyCode].exponent;
  const converted = new Big(amount).times(new Big(10).pow(exponent));

  return Number(converted.toFixed(MINOR_DECIMALS));
}

export function convertCurrencyToMajorUnits(currencyCode: string, amount: number): number {
  if (!CURRENCY_MINOR_DATA[currencyCode]) {
    return amount;
  }
  
  const exponent = CURRENCY_MINOR_DATA[currencyCode].exponent;
  const divisor = new Big(10).pow(exponent);
  const result = new Big(amount).div(divisor);
  const decimalPlaces = exponent + MINOR_DECIMALS;

  return Number(result.toFixed(decimalPlaces));
}
