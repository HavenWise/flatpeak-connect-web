import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler, useRef} from "react";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import BlockHeading from "../../shared/ui/BlockHeading/BlockHeading.tsx";
import InputRate, {InputRateHandle} from "../../shared/ui/InputRate/InputRate.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import FixedSurchargesIcon from "../../shared/ui/icons/FixedSurchargesIcon.tsx";
import PercentageIcon from "../../shared/ui/icons/PercentageIcon.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import {getCurrencySymbol} from "../../shared/lib/util.ts";
import { convertCurrencyToMinorUnits, convertCurrencyToMajorUnits } from '../../shared/lib/currencyUtils.ts';

export const MarketSurchargeCapture = () => {
    const {action, proceed} = useConnect<"surcharge_capture">();
    const fixedCostInputRef = useRef<InputRateHandle>(null);
    const percentCostInputRef = useRef<InputRateHandle>(null);

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const {
            fixed: {value: fixed},
            percentage: {value: percentage},
        } = event.target as unknown as {[PostalAddressKey: string]: {value: string}};

        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                surcharge: {
                    fixed: Number(convertCurrencyToMajorUnits(action.data.currency_code, Number(fixed.trim().replace(",", '.')))) || 0,
                    percentage: Number(percentage.trim().replace(",", '.')) || 0
                },
            }
        }));
    }

    const handleSkip = () => {
        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                surcharge: {
                    fixed: 0,
                    percentage: 0
                },
            }
        }));
    }


    return (
      <Layout
        component={'form'}
        footer={
          <FooterActions>
            <ButtonBig label={'Next'} type="submit" />
            <ButtonBig label={'Or skip this step'} type="button" variant={'text'}  onClick={handleSkip} />
          </FooterActions>
        }
        onSubmit={handleSubmit}
        noValidate
      >
        <MainHeading text="Surcharges" />
        <LeadingText>
          <Typography color="black_a40" variant="leading_string">Add any extra charges if they are included in your tariff. <br/><br/>
          We apply surcharges in this order: Fixed fee first, then Percentage on top.
          </Typography>
        </LeadingText>
        <Box rg={16}>
          <BlockHeading
            text={`Fixed (${getCurrencySymbol(action.data.currency_code)}/kWh)`}
            icon={<FixedSurchargesIcon width={26} height={26} />}
        />
          <InputRate 
            ref={fixedCostInputRef}
            name="fixed"
            defaultValue={convertCurrencyToMinorUnits(action.data.currency_code, action.data.surcharge.fixed)}
            autoFocus={true}
            suffix={false}
            prefixPosition="end"
          />
          <BlockHeading text="Percentage (%/kWh)" icon={<PercentageIcon width={26} height={26} />} />
          <InputRate
            ref={percentCostInputRef}
            name="percentage"
            defaultValue={action.data.surcharge.percentage}
            autoFocus={false}
            suffix={false}
            prefixPosition="end"
            showDecimals={false}
          />
        </Box>
      </Layout>
    )
}
