import {useConnect} from "../../features/connect/lib/ConnectProvider.tsx";
import {FormEventHandler} from "react";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig.tsx";
import Layout from "../../shared/ui/Layout/Layout.tsx";
import MainHeading from "../../shared/ui/MainHeading/MainHeading.tsx";
import Typography from "../../shared/ui/Typography/Typography.tsx";
import Box from "../../shared/ui/Box/Box.tsx";
import FooterActions from "../../shared/ui/FooterActions/FooterActions.tsx";
import {LeadingText} from "../../shared/ui/LeadingText/LeadingText.tsx";
import {submitAction} from "../../features/connect/lib/service.ts";
import RegionPicker from "../../shared/ui/RegionPicker/RegionPicker.tsx";

export const RegionSelect = () => {
    const {action, proceed} = useConnect<"region_select">();

    const handleSubmit: FormEventHandler = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget as HTMLFormElement);
        const region = formData.get('region') as string;

        proceed(submitAction({
            route: action.route,
            type: "submit",
            connect_token: action.connect_token,
            data: {
                region: region
            }
        }));
    }

    return (
      <Layout
        component={'form'}
        footer={
          <FooterActions>
            <ButtonBig label={'Next'} type="submit" />
          </FooterActions>
        }
        onSubmit={handleSubmit}
        noValidate
      >
        <MainHeading text="Select your region" />
        <LeadingText>
          <Typography color="black_a40" variant="leading_string">
            We couldn’t detect your tariff region.
            Please select it from the list below.
          </Typography>
        </LeadingText>
        {Boolean(action.data.regions?.length) && (
          <Box mt={32}>
            <RegionPicker 
              name={'region'} 
              defaultValue={action.data.region || ''} 
              placeholder="Choose your region"
              options={action.data.regions || []} 
            />
          </Box>
        )}
      </Layout>
    )
}
