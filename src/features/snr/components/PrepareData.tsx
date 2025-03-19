import { useEffect, useRef, useState } from "react";
import { Variant } from "../models/Types";
import { OrderInfoModal, OrderInfoResult } from "./modals/OrderInfoModal";
import {
  EmployeeIdCheckResponse,
  FeedbackIdCheckResponse,
  SNRCheckResponse,
} from "../../common/services/ProfidGenericService";
import { SNRModal } from "./modals/SNRModal";
import { ModalHandle, ModalResult } from "../../../playground/modals/Types";

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

  // const handleSNRResult = (data: SNRCheckResponse) => {
  //   const ret = { ...response, snr: data };
  //   snrModal.current?.close();
  //   props.onResult(ret);
  // };

  // const handleOrderInfoCanceled = () => {
  //   props.onCancel();
  // };
  // const handleSnrCanceled = () => {
  //   props.onCancel();
  // };

  const orderInfoCallback = (
    result: ModalResult<OrderInfoResult | undefined>
  ) => {
    orderInfoModal.current?.close();

    if (result.cancelled || result.data === undefined) {
      props.onCancel();
      return;
    }

    SetResponse((prev) => ({
      ...prev,
      feedback: result.data!.feedback,
      employee: result.data!.employee,
    }));

    //2. Check SNR or create a new one
    snrModal.current?.open();
  };

  const snrCallback = (result: ModalResult<SNRCheckResponse | undefined>) => {
    snrModal.current?.close();

    if (result.cancelled || result.data === undefined) {
      props.onCancel();
      return;
    }

    const ret = { ...response, snr: result.data! };
    props.onResult(ret);
  };

  return (
    <>
      <OrderInfoModal
        modalRef={orderInfoModal}
        variant={props.variant}
        callback={orderInfoCallback}
      />
      <SNRModal
        modalRef={snrModal}
        variant={props.variant}
        callback={snrCallback}
      />
    </>
  );
};
