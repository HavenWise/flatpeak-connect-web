import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import SupplierBlock from "../../shared/ui/SupplierBlock/SupplierBlock.tsx";
import Search from "../../shared/ui/Search/Search.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import TouchableOpacity from "../../shared/TouchahbleOpacity/TouchableOpacity.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {useEffect, useState} from "react";
import {submitAction} from "../../features/connect/lib/service.ts";
import {postToHost} from "../../shared/lib/host.ts";
import {ProviderSummary} from "../../features/connect/lib/types.ts";
import AddressCheckBlock from "../../shared/ui/AddressCheckBlock/AddressCheckBlock.tsx";
import {formatPostalAddress} from "../../shared/lib/util.ts";

export const ProviderSelect = () => {
    const {action, proceed} = useConnect<'provider_select'>();
    const {providers, postal_address} = action.data;
    const [keyword, setKeyword] = useState("");
    const [matchedProviders, setMatchedProviders] = useState(providers);

    useEffect(() => {
        setMatchedProviders(providers.filter((p) => p.display_name.toLowerCase().includes(keyword.toLowerCase())))
    }, [providers, keyword])

    const onSelectProvider = (provider: Pick<ProviderSummary, 'id'>) => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                provider: {
                    id: provider.id as string
                }
            }
        }));
    }

    const onMissingProvider = () => {
        // Embedded, the app offers its own tariff list instead of Flatpeak's dead end.
        if (postToHost({action: "not_listed", stage: "provider", fp_cot: action.connect_token})) {
            return;
        }
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "PROVIDER_MISSING"
        }));
    }

    const onChangeAddress = () => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            action: "ADDRESS_CHANGE"
        }));
    }


    return (
        <Layout component={"main"} footer={<FooterActions><ButtonBig label={"My provider is not listed"} variant={'secondary'}  onClick={onMissingProvider}/></FooterActions>}>
            <MainHeading text="Select your provider" />
            <Search
                onInput={(e) => setKeyword((e.target as HTMLInputElement).value)}
                value={keyword}
                autoCapitalize="none"
                autoCorrect={"off"}
            />
            {(action.actions || []).includes("ADDRESS_CHANGE") && postal_address && (
                <Box mt={24}>
                    <AddressCheckBlock
                        address={formatPostalAddress(postal_address)}
                        onClick={onChangeAddress}
                    />
                </Box>
            )}
            <Box mt={24}>
                {matchedProviders.map((provider) => (
                    <TouchableOpacity key={provider.id} onClick={() => onSelectProvider(provider)}>
                        <SupplierBlock
                            src={provider.logo_url}
                            title={provider.display_name}
                        />
                    </TouchableOpacity>
                ))}
            </Box>
        </Layout>
    );
}
