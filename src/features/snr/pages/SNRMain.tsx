import { useEffect, useState } from "react";
import { useAppData } from "../../../contexts/AppContext";
import { useLocation } from "react-router-dom";
import { Variant } from "../models/Types";
import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
  BecPanelContainer,
  BecPanelRowContainer,
} from "bec-react-components";
import { useTranslation } from "react-i18next";
import { OrderInfo } from "../components/OrderInfo";
import { FeedbackTimer } from "../components/FeedbackTimer";
import { SNRContextProvider, useSNRContext } from "../contexts/SNRContext";

export const SNRMain = () => {
  const { setProgramInfo } = useAppData();
  const location = useLocation();
  const { t } = useTranslation();
  const [variant, setVariant] = useState(Variant.UNKNOWN);

  const [canPrint, setCanPrint] = useState(false);
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    setProgramInfo((prev) => ({ ...prev, screen: "2" }));
    setVariant(location.state as Variant);
  }, []);

  return (
    <SNRContextProvider variant={variant}>
      <BecPanelContainer>
        <BecPanelRowContainer>
          <OrderInfo />
          <FeedbackTimer />
        </BecPanelRowContainer>
        <BecPanel>{variant}</BecPanel>
        <BecPanel>
          <BecButtonRowContainer>
            {canPrint && (
              <BecButton variant={"default"} size={"default"}>
                {t("profid:900000321")}
              </BecButton>
            )}
            {canSave && (
              <BecButton variant={"default"} size={"default"}>
                {t("profid:900000021")}
              </BecButton>
            )}
            <BecButton variant={"default"} size={"default"}>
              {t("profid:900000831")}
            </BecButton>
          </BecButtonRowContainer>
        </BecPanel>
      </BecPanelContainer>
    </SNRContextProvider>
  );
};
