import { Button } from "@mui/material";
import React from "react";
import { withTranslation } from "react-i18next";
import Swal from "sweetalert2";
import LanguageIcon from "@mui/icons-material/Language";
const SelectCountry = (props) => {
  const { i18n } = props;

  const handleSelectCountry = async () => {
    const { value } = await Swal.fire({
      title: "Select a Country Language",
      input: "select",
      inputValue: i18n.language,
      inputOptions: {
        en: "English",
        vi: "Vietnamese",
      },
      inputPlaceholder: "Select a language",
      showCancelButton: true,
      inputValidator: (value) => {
        return new Promise((resolve) => {
          resolve();
        });
      },
    });

    i18n.changeLanguage(value);
  };

  return (
    <>
      <Button onClick={handleSelectCountry} type="text" className="p-0 m-0">
        <LanguageIcon />
      </Button>
    </>
  );
};

export default withTranslation()(SelectCountry);
