import { BecTextOutput } from "bec-react-components";
import React from "react";
import { useTranslation } from "react-i18next";

export const CollectedItems = () => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-x-4">
      <BecTextOutput id="collected" label={t("profid:12111")}>
        22 / 500
      </BecTextOutput>
      <BecTextOutput id="collected" label={t("profid:43451")}>
        22 / 500
      </BecTextOutput>
    </div>
  );
};
