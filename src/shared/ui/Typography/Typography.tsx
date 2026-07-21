import { PropsWithChildren } from "react";
import styles from "./Typography.module.scss";

export type TypographyColor =
  | "black_a23"
  | "black_a40"
  | "black_a53"
  | "black_a60"
  | "black"
  | "blue_2"
  | "carnation"
  | "carnation-1"
  | "mine-shaft_a50"
  | "primary"
  | "red"
  | "white"
  | "white_a20"
  | "yellow";
export type FontVariant =
  | "basic_string"
  | "basic_text"
  | "body"
  | "button__forms12_book"
  | "button__forms12_sup_regular"
  | "button__forms14_book"
  | "button__forms16_book"
  | "button__forms16_book_kwh"
  | "button__forms16_regular"
  | "button__forms18_book"
  | "button__forms20_regular"
  | "button__forms24_book"
  | "button__forms28_book"
  | "button__forms32_book"
  | "fa6f_bold_20"
  | "frnt_regular_14"
  | "heading_h1_string"
  | "heading_h2_text"
  | "i_regular_15"
  | "leading_string"
  | "rp_300_11"
  | "rp_300_14"
  | "rp_300_72"
  | "rp_regular_10"
  | "rp_regular_14"
  | "rp_regular_16"
  | "spd_300_12"
  | "spd_300_32"
  | "spd_medium_12"
  | "spd_regular_12"
  | "spd_regular_18"
  | "spd_regular_20"
  | "spd_regular_80"
  | "spd_semibold_9"
  | "spt_regular_16"
  | "spt_regular_17"
  | "spt_semibold_14_75|"
  | "button__forms14_sup_regular"
  | "button__forms30_regular"
  | "button__forms21_book";

type TypographyProps = {
  className?: string;
  color?: TypographyColor | "dynamic";
  variant?: FontVariant;
  align?: "center" | "left" | "right";
  transform?: "uppercase";
  decoration?: "underline";
  component?: "h1" | "h2" | "p" | "span" | "label";
  htmlFor?: string;
};

export default function Typography(props: PropsWithChildren<TypographyProps>) {
  const {
    className,
    component = "span",
    children,
    color,
    variant,
    align,
    transform,
    decoration,
    htmlFor,
  } = props;
  const Tag = component || "span";

  const classNames = [
    className,
    styles.host,
    color && styles["color_" + color],
    variant && styles["variant_" + variant],
    align && styles["align_" + align],
    transform && styles["transform_" + transform],
    decoration && styles["decoration_" + decoration],
  ].filter(Boolean);

  return (
    <Tag className={classNames.join(" ")} htmlFor={htmlFor}>
      {children}
    </Tag>
  );
}
