export const validateDecimalInput = (
    value: string,
    maxIntegerLength: number = 6,
    maxDecimalLength: number = 4
): boolean => {
    return getDecimalInputLimitViolation(value, maxIntegerLength, maxDecimalLength) === null;
};

export type DecimalInputLimitViolation = "integer" | "decimal" | "invalid";

export function getDecimalInputLimitViolation(
    value: string,
    maxIntegerLength: number = 6,
    maxDecimalLength: number = 4,
): DecimalInputLimitViolation | null {
    const normalizedValue = value.replace(/,/g, ".");
    const parts = normalizedValue.split(".");
    const integerPart = parts[0] || "";
    const decimalPart = parts[1] || "";

    if (!/^\d*$/.test(integerPart) || !/^\d*$/.test(decimalPart)) {
        return "invalid";
    }

    if (integerPart.length > maxIntegerLength) {
        return "integer";
    }

    if (decimalPart.length > maxDecimalLength) {
        return "decimal";
    }

    return null;
}

export function getDecimalInputLimitMessage(
    violation: DecimalInputLimitViolation,
    maxIntegerLength: number,
    maxDecimalLength: number,
    showDecimals: boolean,
): string {
    if (!showDecimals) {
        return `Up to ${maxIntegerLength} digits`;
    }

    if (violation === "integer") {
        return `Up to ${maxIntegerLength} digits before the decimal`;
    }

    if (violation === "decimal") {
        return `Up to ${maxDecimalLength} decimal places`;
    }

    return "";
}
