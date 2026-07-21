import styles from "./TariffBadges.module.scss";
import View from "../View/View.tsx";
import TariffDirectionBadge from "./TariffDirectionBadge.tsx";
import TariffStructureBadge from "./TariffStructureBadge.tsx";
import WrongTariffActionButton from "./WrongTariffActionButton.tsx";
import {TariffStructureType} from "../../../features/connect/lib/types.ts";
import {ContractDirection} from "../../../features/connect/lib/types.ts";

type TariffBadges = {
    contract_type: ContractDirection;
    structure_type: TariffStructureType;
    onReportProblem?: () => void;
    isReportProblemDisabled?: boolean;
}
export default function TariffBadges(props: TariffBadges) {
  const {contract_type, structure_type, onReportProblem, isReportProblemDisabled = false} = props;
  
  const handleReportProblem = () => {
    if (onReportProblem) {
      onReportProblem();
    } else {
      console.log("Report a problem clicked!");
    }
  };
  
  return (
    <View className={styles.host}>
      <TariffStructureBadge value={structure_type} />
      <TariffDirectionBadge value={contract_type} />
      <WrongTariffActionButton 
        label="Report a problem" 
        onClick={handleReportProblem}
        disabled={isReportProblemDisabled}
        disabledLabel="Problem reported"
      />
    </View>
  );
}
