import { FormEventHandler, useEffect, useState } from "react";
import { useConnect } from "../../features/connect/lib/ConnectProvider";
import { submitAction } from "../../features/connect/lib/service";
import { COUNTRIES } from "../../shared/lib/countries";
import { COUNTRIES_WITH_STATES, STATES_BY_COUNTRY } from "../../shared/lib/states";
import Box from "../../shared/ui/Box/Box";
import ButtonBig from "../../shared/ui/ButtonBig/ButtonBig";
import FooterActions from "../../shared/ui/FooterActions/FooterActions";
import InputText from "../../shared/ui/InputText/InputText";
import Layout from "../../shared/ui/Layout/Layout";
import { LeadingText } from "../../shared/ui/LeadingText/LeadingText";
import MainHeading from "../../shared/ui/MainHeading/MainHeading";
import Select from "../../shared/ui/Select/Select";
import Typography from "../../shared/ui/Typography/Typography";
import styles from "./PostalAddressCapture.module.scss";
import Combobox from "../../shared/ui/Combobox/Combobox";

export const PostalAddressCapture = () => {
  const { proceed, action } = useConnect<"postal_address_capture">();
  const countryCode = (action.data.postal_address.country_code ?? "").toUpperCase();

  const [selectedCountry, setSelectedCountry] = useState(countryCode);

  useEffect(() => {
    setSelectedCountry(countryCode);
  }, [countryCode]);

  const needsStateDropdown = COUNTRIES_WITH_STATES.includes(selectedCountry);

  const handleSubmit: FormEventHandler = (event) => {
    event.preventDefault();
    const form = event.target as unknown as {
      address_line1: { value: string };
      city: { value: string };
      country_code: { value: string };
      post_code: { value: string };
      state?: { value: string };
    };
    const {
      address_line1: { value: address_line1 },
      city: { value: city },
      country_code: { value: country_code },
      post_code: { value: post_code },
    } = form;

    const stateTrimmed = (form.state?.value ?? "").trim();

    proceed(
      submitAction({
        route: action.route,
        type: "submit",
        connect_token: action.connect_token,
        data: {
          postal_address: {
            address_line1,
            city,
            country_code,
            post_code,
            ...(stateTrimmed ? { state: stateTrimmed } : {}),
          },
        },
      })
    );
  };

  return (
    <Layout
      component={"form"}
      footer={
        <FooterActions>
          <ButtonBig label={"Next"} type="submit" />
        </FooterActions>
      }
      onSubmit={handleSubmit}
      noValidate
    >
      <MainHeading text="Add your address" />

      <LeadingText>
        <Typography component={"p"} color="black_a40" variant="leading_string">
          Please enter your address. <br />
          We don't have enough information about your location to list
          electricity providers in your area.
        </Typography>
      </LeadingText>

      <Box rg={12}>
        <Combobox
          options={COUNTRIES}
          name="country_code"
          label="Country"
          defaultValue={selectedCountry}
          hostClassName={styles.selectGray}
          onChange={(value) => setSelectedCountry((value ?? "").toUpperCase())}
        />
        <InputText
          secondaryText="Street address"
          id="address_line1"
          name="address_line1"
          autoComplete="address_line1"
          defaultValue={action.data.postal_address.address_line1}
          autoFocus
        />
        <InputText
          secondaryText="City"
          id="city"
          name="city"
          autoComplete="city"
          defaultValue={action.data.postal_address.city}
        />
        {needsStateDropdown && (
          <Select
            key={selectedCountry}
            name="state"
            label="State"
            autoComplete="address-level1"
            allowEmpty
            defaultValue={action.data.postal_address.state ?? ""}
            options={STATES_BY_COUNTRY[selectedCountry] ?? []}
            hostClassName={styles.selectGray}
          />
        )}
        <InputText
          secondaryText="Postcode / Zip"
          id="post_code"
          name="post_code"
          autoComplete="post_code"
          defaultValue={action.data.postal_address.post_code}
        />
      </Box>
    </Layout>
  );
};
