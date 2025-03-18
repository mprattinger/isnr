import { useEffect, useRef, useState } from "react";
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
import { SNRContextProvider } from "../contexts/SNRContext";
import { SNR } from "../components/SNR";
import {
  OrderInfoModal,
  OrderInfoResult,
} from "../components/modals/OrderInfoModal";
import { ModalHandle } from "../../core/components/Modal";
import { SNRModal } from "../components/modals/SNRModal";

export const SNRMain = () => {
  const { setProgramInfo } = useAppData();
  const location = useLocation();
  const { t } = useTranslation();
  const [variant, setVariant] = useState(Variant.UNKNOWN);

  const orderInfoModal = useRef<ModalHandle>(null);
  const snrModal = useRef<ModalHandle>(null);

  const [pageReady, setPageReady] = useState(false); //When all data is loaded, the page is ready for display
  const [canPrint, setCanPrint] = useState(false);
  const [canSave, setCanSave] = useState(false);

  useEffect(() => {
    setProgramInfo((prev) => ({ ...prev, screen: "2" }));
    setVariant(location.state as Variant);

    //Ask User for data
    //1.Order information
    orderInfoModal.current?.open();
  }, []);

  const handleOrderInfoResult = (data: OrderInfoResult) => {
    orderInfoModal.current?.close();
    snrModal.current?.open();
  };

  const handleOrderInfoCanceled = () => {};
  const handleSnrCanceled = () => {};

  return pageReady ? (
    <SNRContextProvider variant={variant}>
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
            <BecButton variant={"default"} size={"default"}>
              {t("profid:900000831")}
            </BecButton>
          </BecButtonRowContainer>
        </BecPanel>
      </BecPanelContainer>
    </SNRContextProvider>
  ) : (
    <div>
      <OrderInfoModal
        modalRef={orderInfoModal}
        onModalResult={handleOrderInfoResult}
        onCancel={handleOrderInfoCanceled}
      />
      <SNRModal modalRef={snrModal} onCancel={handleSnrCanceled} />
    </div>
  );
};
