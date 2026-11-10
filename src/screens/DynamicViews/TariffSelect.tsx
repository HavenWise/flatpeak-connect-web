import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {TariffTemplate} from "../../features/connect/lib/types.ts";
import {useEffect, useState} from "react";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import SupplierBlock from "../../shared/ui/SupplierBlock/SupplierBlock.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import Search from "../../shared/ui/Search/Search.tsx";
import TouchableOpacity from "../../shared/TouchahbleOpacity/TouchableOpacity.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {postToHost} from "../../shared/lib/host.ts";

export const TariffSelect = () => {
    const {action,proceed} = useConnect<'tariff_select'>();
    const {tariffs} = action.data;

    const [keyword, setKeyword] = useState("");
    const [matchedTariffs, setMatchedProviders] = useState(tariffs);

    useEffect(() => {
        setMatchedProviders(tariffs.filter((p) => {
            return p.name.toLowerCase().includes(keyword.toLowerCase())
                || p.description?.toLowerCase().includes(keyword.toLowerCase())
        }))
    }, [tariffs, keyword])

    const onSelectTariff = (tariff: Pick<TariffTemplate, 'id'>) => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                tariff: {
                    id: tariff.id as string
                }
            }
        }));
    }

    const onMissingTariff = () => {
        // Embedded, the app offers its own tariff list instead of Flatpeak's dead end.
        if (postToHost({action: "not_listed", stage: "tariff", fp_cot: action.connect_token})) {
            return;
        }
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "TARIFF_MISSING"
        }));
    }

    return (
        <Layout component={"main"} footer={<FooterActions><ButtonBig label={"My tariff is not listed"} variant={'secondary'}  onClick={onMissingTariff}/></FooterActions>}>
            <MainHeading text="Select your tariff plan" />
            <Search
                onInput={(e) => setKeyword((e.target as HTMLInputElement).value)}
                value={keyword}
                autoCapitalize="none"
                autoCorrect={"off"}
            />
            <Box mt={24}>
                {matchedTariffs.map((tariff) => (
                    <TouchableOpacity key={tariff.id} onClick={() => onSelectTariff(tariff)}>
                        <SupplierBlock
                            title={tariff.name}
                            description={tariff.description}
                        />
                    </TouchableOpacity>
                ))}
            </Box>
        </Layout>
   );
}
