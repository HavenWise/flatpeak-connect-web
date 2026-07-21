import styles from "./WrongTariffActionButton.module.scss";
import View from "../View/View.tsx";
import Typography from "../Typography/Typography.tsx";
import IncidentIcon from "../icons/IncidentIcon.tsx";

type WrongTariffActionButtonProps = {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  disabledLabel?: string;
}

export default function WrongTariffActionButton(props: WrongTariffActionButtonProps) {
  const {label, onClick, disabled = false, disabledLabel} = props;
  const displayText = disabled && disabledLabel ? disabledLabel : label;
  
  return (
    <View
      className={`${styles.host} ${disabled ? styles.disabled : ''}`}
      onClick={disabled ? undefined : onClick}
    >
      {!disabled && (
        <IncidentIcon width={12} height={12} />
      )}
      <Typography color="white" variant="button__forms12_sup_regular">
        {displayText}
      </Typography>
    </View>
  );
}
