import styles from "./InputRate.module.scss";
import View from "../View/View.js";
import Typography from "../Typography/Typography.js";
import {
    forwardRef,
    InputHTMLAttributes,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import Box from "../Box/Box.js";
import { validateDecimalInput } from "../../lib/inputValidation.ts";

type InputRateTimeProps = {
    variant?: "primary" | "secondary",
    prefix?: string;
    prefixPosition?: "start" | "end";
    suffix?: boolean;
    useDefault?: boolean;
    layoutRightOffset?: number;
    showDecimals?: boolean;
    label?: string;
    maxIntegerLength?: number;
    maxDecimalLength?: number;
} & InputHTMLAttributes<HTMLInputElement>;

export type InputRateHandle = {
    reset: () => void;
};

const DECIMAL_SEPARATORS = /[,，]/g;

type NormalizeOptions = {
    showDecimals: boolean;
    maxIntegerLength: number;
    maxDecimalLength: number;
};

function getPlaceholder(useDefault: boolean, showDecimals: boolean): string {
    if (!useDefault) {
        return "";
    }
    return showDecimals ? "0.00" : "0";
}

function getInitialRateValue(
    defaultValue: InputHTMLAttributes<HTMLInputElement>["defaultValue"],
    useDefault: boolean,
): string {
    if (defaultValue !== undefined && defaultValue !== null && defaultValue !== "" && defaultValue !== 0) {
        return String(defaultValue);
    }
    if (!useDefault) {
        return "";
    }
    return "";
}

function replaceDecimalSeparators(value: string): string {
    return value.replace(DECIMAL_SEPARATORS, ".");
}

function normalizeRateInputValue(
    raw: string,
    previousValue: string,
    { showDecimals, maxIntegerLength, maxDecimalLength }: NormalizeOptions,
): string | null {
    let value = replaceDecimalSeparators(raw);

    if (showDecimals && previousValue === "0.00" && value.startsWith("0.00") && value.length > 4) {
        value = value.slice(4);
    }

    if (!showDecimals && previousValue === "0" && value.startsWith("0") && value.length > 1) {
        value = value.slice(1);
    }

    if (showDecimals) {
        const dotIndex = value.indexOf(".");
        if (dotIndex !== -1) {
            value = value.slice(0, dotIndex + 1) + value.slice(dotIndex + 1).replace(/\./g, "");
        }
    } else {
        value = value.replace(/\./g, "");
    }

    if (!validateDecimalInput(value, maxIntegerLength, maxDecimalLength)) {
        return null;
    }

    return value;
}

function isDecimalSeparator(char: string): boolean {
    return /[.,，]/.test(char);
}

function redirectPrependedDigit(
    raw: string,
    previousValue: string,
    maxDecimalLength: number,
): string {
    if (!previousValue.includes(".")) {
        return raw;
    }

    const dotIndex = previousValue.indexOf(".");
    const integerPart = previousValue.slice(0, dotIndex);
    const fractionalPart = previousValue.slice(dotIndex + 1);
    const withSeparatorsReplaced = replaceDecimalSeparators(raw);
    const normalizedDotIndex = withSeparatorsReplaced.indexOf(".");

    if (normalizedDotIndex === -1) {
        return raw;
    }

    const nextIntegerPart = withSeparatorsReplaced.slice(0, normalizedDotIndex);
    const nextFractionalPart = withSeparatorsReplaced.slice(normalizedDotIndex + 1).replace(/\./g, "");

    if (nextIntegerPart.length <= integerPart.length || !nextIntegerPart.endsWith(integerPart)) {
        return raw;
    }

    const prependedDigits = nextIntegerPart.slice(0, nextIntegerPart.length - integerPart.length);
    if (!/^\d+$/.test(prependedDigits)) {
        return raw;
    }

    const appendedFractionalDigits = nextFractionalPart.startsWith(fractionalPart)
        ? nextFractionalPart.slice(fractionalPart.length)
        : nextFractionalPart;

    const corrected = `${integerPart}.${fractionalPart}${prependedDigits}${appendedFractionalDigits}`;
    const correctedDotIndex = corrected.indexOf(".");

    if (correctedDotIndex === -1) {
        return corrected;
    }

    return corrected.slice(0, correctedDotIndex + 1) + corrected.slice(
        correctedDotIndex + 1,
        correctedDotIndex + 1 + maxDecimalLength,
    );
}

function mapCursorThroughNormalization(
    raw: string,
    previousValue: string,
    cursor: number,
    showDecimals: boolean,
): number {
    let value = replaceDecimalSeparators(raw);
    let nextCursor = cursor;

    if (showDecimals && previousValue === "0.00" && value.startsWith("0.00") && value.length > 4) {
        value = value.slice(4);
        nextCursor = Math.max(0, nextCursor - 4);
    }

    if (!showDecimals && previousValue === "0" && value.startsWith("0") && value.length > 1) {
        value = value.slice(1);
        nextCursor = Math.max(0, nextCursor - 1);
    }

    if (showDecimals) {
        const dotIndex = value.indexOf(".");
        if (dotIndex !== -1) {
            const extraDotsBeforeCursor = (value.slice(0, nextCursor).slice(dotIndex + 1).match(/\./g) || []).length;
            nextCursor = Math.max(0, nextCursor - extraDotsBeforeCursor);
            value = value.slice(0, dotIndex + 1) + value.slice(dotIndex + 1).replace(/\./g, "");
        }
    }

    return Math.min(Math.max(0, nextCursor), value.length);
}

function resolveSelectionAfterChange(
    raw: string,
    previousValue: string,
    normalized: string,
    cursor: number,
    selectionEnd: number,
    showDecimals: boolean,
): { start: number; end: number } {
    const dotIndex = normalized.indexOf(".");

    if (showDecimals && dotIndex !== -1) {
        const insertedChar = raw.charAt(Math.max(0, cursor - 1));
        const decimalSeparatorTyped = isDecimalSeparator(insertedChar);
        const enteredFractionalPart =
            decimalSeparatorTyped ||
            (normalized.endsWith(".") && !previousValue.includes("."));

        if (enteredFractionalPart) {
            const afterDecimal = dotIndex + 1;
            return { start: afterDecimal, end: afterDecimal };
        }
    }

    return {
        start: mapCursorThroughNormalization(raw, previousValue, cursor, showDecimals),
        end: mapCursorThroughNormalization(raw, previousValue, selectionEnd, showDecimals),
    };
}

const InputRate = forwardRef<InputRateHandle, InputRateTimeProps>((props, ref) => {
    const {
        variant,
        prefix = "",
        prefixPosition = "start",
        suffix = true,
        defaultValue,
        useDefault = true,
        layoutRightOffset = 0,
        showDecimals = true,
        label,
        maxIntegerLength = 6,
        maxDecimalLength = 4,
        onFocus,
        onBlur,
        ...inputAttributes
    } = props;

    const normalizeOptions: NormalizeOptions = {
        showDecimals,
        maxIntegerLength,
        maxDecimalLength,
    };

    const [value, setValue] = useState(() => getInitialRateValue(defaultValue, useDefault));
    const [isFocused, setIsFocused] = useState(false);
    const placeholder = getPlaceholder(useDefault, showDecimals);
    const isPlaceholder = value === "" && Boolean(placeholder) && !isFocused;
    const displayValue = isPlaceholder ? placeholder : value;

    const inputRef = useRef<HTMLInputElement>(null);
    const selectionRef = useRef<{ start: number; end: number } | null>(null);

    useImperativeHandle(ref, () => ({
        reset: () => setValue(getInitialRateValue(defaultValue, useDefault)),
        input: inputRef.current,
    }));

    useLayoutEffect(() => {
        if (!selectionRef.current || !inputRef.current) {
            return;
        }

        const { start, end } = selectionRef.current;
        inputRef.current.setSelectionRange(start, end);
        selectionRef.current = null;
    }, [value]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const cursor = input.selectionStart ?? input.value.length;
        const insertedChar = input.value.charAt(Math.max(0, cursor - 1));
        const rawValue = showDecimals
            ? redirectPrependedDigit(input.value, value, maxDecimalLength)
            : input.value;
        const normalized = normalizeRateInputValue(rawValue, value, normalizeOptions);

        if (normalized === null) {
            selectionRef.current = { start: cursor, end: cursor };
            setValue(value);
            return;
        }

        if (normalized === value && isDecimalSeparator(insertedChar)) {
            const dotIndex = value.indexOf(".");
            const afterDecimal = dotIndex === -1 ? value.length : dotIndex + 1;
            selectionRef.current = { start: afterDecimal, end: afterDecimal };
            setValue(value);
            return;
        }

        selectionRef.current = resolveSelectionAfterChange(
            rawValue,
            value,
            normalized,
            cursor,
            input.selectionEnd ?? cursor,
            showDecimals,
        );
        setValue(normalized);
    };

    return (
        <View className={[styles.host, styles["variant-" + variant]].join(" ")}>
            <Box className={styles.placeholder}>
                <input
                    ref={inputRef}
                    className={styles.control}
                    type="text"
                    pattern="[0-9.,]*"
                    inputMode="decimal"
                    step={0.01}
                    value={value}
                    {...inputAttributes}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onChange={handleChange}
                />
                <View className={styles.overlay}>
                    {label && (
                        <Typography className={styles.label} color="black_a40" variant="button__forms12_book">
                            {label}
                        </Typography>
                    )}
                    <View className={styles.wrapper}>
                        <Typography
                            color={isPlaceholder ? "black_a40" : "black"}
                            variant="button__forms32_book"
                            className={styles.value}
                        >
                            {displayValue}
                        </Typography>
                        {Boolean(prefix) && prefixPosition === "start" && (
                            <View className={styles.leftDock}>
                                <Typography color="black" variant="button__forms16_book_kwh" className={styles.prefix}>
                                    {prefix}
                                </Typography>
                            </View>
                        )}
                        {(prefixPosition === "end" && Boolean(prefix)) || suffix ? (
                            <View className={styles.rightDock}>
                                {prefixPosition === "end" && Boolean(prefix) && (
                                    <Typography color="black" variant="button__forms16_book_kwh" className={styles.prefix}>
                                        {prefix}
                                    </Typography>
                                )}
                                {suffix && (
                                    <Typography color="black" variant="button__forms16_book_kwh">
                                        /kWh
                                    </Typography>
                                )}
                            </View>
                        ) : null}
                    </View>
                </View>
            </Box>
            {Boolean(layoutRightOffset) && <Box pr={layoutRightOffset} />}
        </View>
    );
});

export default InputRate;
