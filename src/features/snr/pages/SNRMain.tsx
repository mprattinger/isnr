import { useEffect, useRef, useState } from "react";
import { useAppData } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
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
import { SNRContextProvider } from "../contexts/SNRContext";
import { SNR } from "../components/SNR";
import { IPrepareDataResult, PrepareData } from "../components/PrepareData";

export const SNRMain = () => {
  const { setProgramInfo } = useAppData();
  const location = useLocation();
  const { t } = useTranslation();
  const [variant, setVariant] = useState(Variant.UNKNOWN);
  const navigate = useNavigate();

  const [pageReady, setPageReady] = useState(false); //When all data is loaded, the page is ready for display
  const [canPrint, setCanPrint] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [prepareData, setPrepareData] = useState<IPrepareDataResult>();

  useEffect(() => {
    setProgramInfo((prev) => ({ ...prev, screen: "2" }));
    setVariant(location.state as Variant);

    if (typeof prepareData !== "undefined") {
      setPageReady(true);
    }
  }, []);

  const handleResult = (data: IPrepareDataResult) => {
    setPrepareData(data);
    setPageReady(true);
  };

  const handlePrepareDataCanceled = () => {
    navigate("/");
  };
  const handleCancel = () => {
    navigate("/");
  };

  return pageReady ? (
    <SNRContextProvider variant={variant} data={prepareData}>
      <BecPanelContainer>
        <BecPanelRowContainer>
          <OrderInfo />
          <FeedbackTimer />
        </BecPanelRowContainer>
        <BecPanel header={t("profid:24751")}>
          <SNR />
        </BecPanel>
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
            <BecButton
              variant={"default"}
              size={"default"}
              onClick={handleCancel}
            >
              {t("profid:900000831")}
            </BecButton>
          </BecButtonRowContainer>
        </BecPanel>
      </BecPanelContainer>
    </SNRContextProvider>
  ) : (
    <PrepareData
      variant={variant}
      onResult={handleResult}
      onCancel={handlePrepareDataCanceled}
    />
  );
};
