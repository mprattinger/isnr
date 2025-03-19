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

  const { data } = useSNRContext();

  return (
    <BecPanel header={t("profid:43461")}>
      <BecPanelRowContainer>
        <BecTextOutput
          id="feedbackId"
          label={t("profid:24031")}
          value={data?.feedback.rmnr}
        />
        <BecKeyedOutput
          id="article"
          label={t("profid:4021")}
          type="Artikel"
          value1={data?.feedback.artnr}
          value2={data?.feedback.aeaa}
          value3={data?.feedback.btra}
        />
        <BecKeyedOutput
          id="order"
          label={t("profid:4601")}
          type="Auftrag mit Position"
          value1={data?.feedback.orderId}
          value2={data?.feedback.aura}
          value3={data?.feedback.aure}
          value4={data?.feedback.position}
        />
      </BecPanelRowContainer>
      <BecPanelRowContainer>
        <BecTextOutput
          id="snr"
          label={t("profid:24722")}
          value={data?.snr.snr}
        />
      </BecPanelRowContainer>
    </BecPanel>
  );
};
