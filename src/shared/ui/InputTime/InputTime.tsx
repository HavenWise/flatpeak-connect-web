import styles from "./InputTime.module.scss";
import View from "../View/View.js";
import Typography from "../Typography/Typography.js";
import {InputHTMLAttributes, useRef} from "react";

type InputTimeTimeProps = {
    label: string;
    variant: "primary" | "secondary"
} &  InputHTMLAttributes<HTMLInputElement>

const PICKER_DEBOUNCE_MS = 300;

const openTimePicker = (input: HTMLInputElement) => {
    input.focus();

    if (typeof input.showPicker === "function") {
        try {
            input.showPicker();
            return;
        } catch {
            // showPicker can throw when not triggered by a user gesture.
        }
    }

    input.click();
};

export default function InputTime(props: InputTimeTimeProps) {
    const { label, variant, onClick, onTouchEnd, ...inputAttributes } = props
    const inputRef = useRef<HTMLInputElement>(null);
    const lastOpenRef = useRef(0);

    const handleOpenPicker = () => {
        const now = Date.now();
        if (now - lastOpenRef.current < PICKER_DEBOUNCE_MS) {
            return;
        }
        lastOpenRef.current = now;

        if (inputRef.current) {
            openTimePicker(inputRef.current);
        }
    };

    const handleInputClick = (event: React.MouseEvent<HTMLInputElement>) => {
        onClick?.(event);
        handleOpenPicker();
    };

    const handleInputTouchEnd = (event: React.TouchEvent<HTMLInputElement>) => {
        onTouchEnd?.(event);
        handleOpenPicker();
    };

  return (
      <View
          className={[styles.host, styles['variant-'+variant]].join(' ')}
          onClick={(event) => {
              if (event.target === inputRef.current) {
                  return;
              }
              handleOpenPicker();
          }}
          onTouchEnd={(event) => {
              if (event.target === inputRef.current) {
                  return;
              }
              handleOpenPicker();
          }}
      >
          <input
                 ref={inputRef}
                 className={styles.control}
                 type="time"
                 {...inputAttributes}
                 onClick={handleInputClick}
                 onTouchEnd={handleInputTouchEnd}
          />
          <View className={styles.overlay}>
              <Typography className={styles.label} color="black_a40" variant="button__forms12_book">
                  {label}
              </Typography>
          </View>
      </View>
  );
}
