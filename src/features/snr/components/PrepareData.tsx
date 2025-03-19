import { useEffect, useRef, useState } from "react";
import { ModalHandle } from "../../core/components/Modal";
import { Variant } from "../models/Types";
import { OrderInfoModal, OrderInfoResult } from "./modals/OrderInfoModal";
import {
  EmployeeIdCheckResponse,
  FeedbackIdCheckResponse,
  SNRCheckResponse,
} from "../../common/services/ProfidGenericService";
import { SNRModal } from "./modals/SNRModal";

export interface IPrepareDataResult {
  feedback: FeedbackIdCheckResponse;
  employee: EmployeeIdCheckResponse;
  snr: SNRCheckResponse;
}

interface IPrepareDataProps {
  variant: Variant;
  onResult: (data: IPrepareDataResult) => void;
  onCancel: () => void;
}
export const PrepareData = (props: IPrepareDataProps) => {
  const [response, SetResponse] = useState<IPrepareDataResult>(
    {} as IPrepareDataResult
  );

  const orderInfoModal = useRef<ModalHandle>(null);
  const snrModal = useRef<ModalHandle>(null);

  useEffect(() => {
    //Ask User for data
    //1. Order information
    orderInfoModal.current?.open();
  }, []);

  const handleOrderInfoResult = (data: OrderInfoResult) => {
    SetResponse((prev) => ({
      ...prev,
      feedback: data.feedback,
      employee: data.employee,
    }));
    orderInfoModal.current?.close();

    //2. Check SNR or create a new one
    snrModal.current?.open();
  };

  const handleSNRResult = (data: SNRCheckResponse) => {
    const ret = { ...response, snr: data };
    snrModal.current?.close();
    props.onResult(ret);
  };

  const handleOrderInfoCanceled = () => {
    props.onCancel();
  };
  const handleSnrCanceled = () => {
    props.onCancel();
  };

  return (
    <>
      <OrderInfoModal
        modalRef={orderInfoModal}
        variant={props.variant}
        onModalResult={handleOrderInfoResult}
        onCancel={handleOrderInfoCanceled}
      />
      <SNRModal
        modalRef={snrModal}
        variant={props.variant}
        onModalResult={handleSNRResult}
        onCancel={handleSnrCanceled}
      />
    </>
  );
};
