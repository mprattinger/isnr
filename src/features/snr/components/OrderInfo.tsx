import {
  BecKeyedOutput,
  BecPanel,
  BecPanelRowContainer,
  BecTextOutput,
} from "bec-react-components";
import { useTranslation } from "react-i18next";
import { useSNRContext } from "../contexts/SNRContext";

export const OrderInfo = () => {
  const { t } = useTranslation();

  return (
    <BecPanel header={t("profid:43461")}>
      <BecPanelRowContainer>
        <BecTextOutput
          id="feedbackId"
          label={t("profid:24031")}
          value="4565150"
        />
        <BecKeyedOutput
          id="article"
          label={t("profid:4021")}
          type="Artikel"
          value1="EI79945---"
          value2="0"
          value3="1"
        />
        <BecKeyedOutput
          id="order"
          label={t("profid:4601")}
          type="Auftrag mit Position"
          value1="8745478"
          value2="0"
          value3="0"
          value4="1"
        />
      </BecPanelRowContainer>
      <BecPanelRowContainer>
        <BecTextOutput
          id="snr"
          label={t("profid:24722")}
          value="1982538207106"
        />
      </BecPanelRowContainer>
    </BecPanel>
  );
};
