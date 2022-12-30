import { MenuItem, Select } from "@mui/material";
import React from "react";
import { withTranslation } from "react-i18next";

const SelectCountry = (props) => {
  const { i18n } = props;

  return (
    <>
      <Select
        labelId="select-country"
        id="select-country"
        label="Age"
        value={i18n.language}
        size="small"
        style={{ height: "2.5rem" }}
        onChange={(event) => i18n.changeLanguage(event.target.value)}
      >
        <MenuItem value={"en"}>English</MenuItem>
        <MenuItem value={"vi"}>Vietnamese</MenuItem>
      </Select>
    </>
  );
};

export default withTranslation()(SelectCountry);
