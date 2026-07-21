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
import { getDecimalInputLimitMessage, getDecimalInputLimitViolation, validateDecimalInput } from "../../lib/inputValidation.ts";

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
): string {
    if (defaultValue !== undefined && defaultValue !== null && defaultValue !== "" && defaultValue !== 0) {
        return String(defaultValue);
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

function isDigit(char: string): boolean {
    return /^\d$/.test(char);
}

function isIntegerLimitExceeded(
    previousValue: string,
    rawValue: string,
    insertedChar: string,
    maxIntegerLength: number,
): boolean {
    if (!isDigit(insertedChar)) {
        return false;
    }

    const previousDotIndex = previousValue.indexOf(".");
    const previousInteger = previousDotIndex === -1
        ? previousValue
        : previousValue.slice(0, previousDotIndex);

    if (previousInteger.length < maxIntegerLength) {
        return false;
    }

    const normalizedRaw = replaceDecimalSeparators(rawValue);
    const rawDotIndex = normalizedRaw.indexOf(".");
    const rawInteger = rawDotIndex === -1
        ? normalizedRaw
        : normalizedRaw.slice(0, rawDotIndex);

    if (rawInteger.length > previousInteger.length) {
        return true;
    }

    if (previousDotIndex === -1 && rawDotIndex !== -1 && !isDecimalSeparator(insertedChar)) {
        return true;
    }

    if (previousDotIndex === -1 && rawDotIndex === -1 && normalizedRaw.length > previousValue.length) {
        return true;
    }

    return false;
}

function isDecimalSeparator(char: string): boolean {
    return /[.,，]/.test(char);
}

function getRejectedInvalidCursor(attemptedCursor: number, currentValue: string): number {
    return Math.min(Math.max(0, attemptedCursor - 1), currentValue.length);
}

function getRejectedCursor(
    currentValue: string,
    violation: "integer" | "decimal",
    attemptedCursor: number,
    maxDecimalLength: number,
): number {
    const dotIndex = currentValue.indexOf(".");

    if (violation === "integer") {
        return dotIndex === -1 ? currentValue.length : dotIndex;
    }

    if (dotIndex === -1) {
        return currentValue.length;
    }

    const fractionalEnd = dotIndex + 1 + maxDecimalLength;
    return Math.min(Math.max(attemptedCursor, dotIndex + 1), fractionalEnd);
}

function redirectPrependedDigit(
    raw: string,
    previousValue: string,
    maxIntegerLength: number,
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

    if (integerPart.length >= maxIntegerLength) {
        return previousValue;
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

    const [value, setValue] = useState(() => getInitialRateValue(defaultValue));
    const [isFocused, setIsFocused] = useState(false);
    const [limitError, setLimitError] = useState<string | null>(null);
    const [selectionTick, setSelectionTick] = useState(0);
    const placeholder = getPlaceholder(useDefault, showDecimals);
    const isPlaceholder = value === "" && Boolean(placeholder) && !isFocused;
    const displayValue = isPlaceholder ? placeholder : value;

    const inputRef = useRef<HTMLInputElement>(null);
    const selectionRef = useRef<{ start: number; end: number } | null>(null);

    const scheduleSelection = (start: number, end: number = start) => {
        selectionRef.current = { start, end };
        setSelectionTick((tick) => tick + 1);
    };

    useImperativeHandle(ref, () => ({
        reset: () => {
            setValue(getInitialRateValue(defaultValue));
            setLimitError(null);
        },
    }));

    const rejectInput = (
        attemptedCursor: number,
        violation: "integer" | "decimal" = "integer",
    ) => {
        const cursor = getRejectedCursor(value, violation, attemptedCursor, maxDecimalLength);
        setLimitError(getDecimalInputLimitMessage(violation, maxIntegerLength, maxDecimalLength, showDecimals));
        scheduleSelection(cursor);
    };

    useLayoutEffect(() => {
        const input = inputRef.current;
        if (!input) {
            return;
        }

        if (input.value !== value) {
            input.value = value;
        }

        if (!selectionRef.current) {
            return;
        }

        const { start, end } = selectionRef.current;
        input.setSelectionRange(start, end);
        selectionRef.current = null;
    }, [value, selectionTick]);

    const focusInputAtEnd = () => {
        const input = inputRef.current;
        if (!input) {
            return;
        }

        input.focus();
        const cursor = input.value.length;
        input.setSelectionRange(cursor, cursor);
    };

    const handleHostActivate = (event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (event.target === inputRef.current) {
            return;
        }

        focusInputAtEnd();
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        const cursor = e.target.value.length;
        requestAnimationFrame(() => {
            e.target.setSelectionRange(cursor, cursor);
        });
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        setLimitError(null);
        onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target;
        const cursor = input.selectionStart ?? input.value.length;
        const insertedChar = input.value.charAt(Math.max(0, cursor - 1));

        if (isIntegerLimitExceeded(value, input.value, insertedChar, maxIntegerLength)) {
            rejectInput(cursor, "integer");
            return;
        }

        const rawValue = showDecimals
            ? redirectPrependedDigit(input.value, value, maxIntegerLength, maxDecimalLength)
            : input.value;

        if (rawValue === value && input.value !== value) {
            rejectInput(cursor, "integer");
            return;
        }

        const normalized = normalizeRateInputValue(rawValue, value, normalizeOptions);

        if (normalized === null) {
            const violation = getDecimalInputLimitViolation(rawValue, maxIntegerLength, maxDecimalLength);
            if (violation === "decimal") {
                rejectInput(cursor, "decimal");
                return;
            }
            if (violation === "integer") {
                rejectInput(cursor, "integer");
                return;
            }
            scheduleSelection(getRejectedInvalidCursor(cursor, value));
            return;
        }

        if (normalized === value && isDecimalSeparator(insertedChar)) {
            const dotIndex = value.indexOf(".");
            const afterDecimal = dotIndex === -1 ? value.length : dotIndex + 1;
            scheduleSelection(afterDecimal);
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
        setLimitError(null);
        setValue(normalized);
    };

    return (
        <Box className={styles.field}>
            <View
                className={[
                    styles.host,
                    styles["variant-" + variant],
                    limitError ? styles.hostError : "",
                ].join(" ")}
                onClick={handleHostActivate}
                onTouchEnd={handleHostActivate}
            >
            <Box className={styles.placeholder}>
                <input
                    ref={inputRef}
                    className={styles.control}
                    type="text"
                    pattern="[0-9.,]*"
                    inputMode="decimal"
                    autoComplete="off"
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
            {limitError && (
                <Typography className={styles.error} color="red" variant="button__forms12_book">
                    {limitError}
                </Typography>
            )}
        </Box>
    );
});

export default InputRate;
