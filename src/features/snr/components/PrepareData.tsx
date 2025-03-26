import { useEffect, useRef } from "react";
import { Variant } from "../models/Types";
import { OrderInfoModal, OrderInfoResult } from "./modals/OrderInfoModal";
import {
  EmployeeIdCheckResponse,
  FeedbackIdCheckResponse,
  SNRCheckResponse,
} from "../../common/services/ProfidGenericService";
import { SNRModal } from "./modals/SNRModal";
import { IBasePayload, ModalHandle } from "../../../playground/modals/Types";

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
  const orderInfoModal =
    useRef<ModalHandle<IBasePayload, OrderInfoResult>>(null);
  const snrModal = useRef<ModalHandle<IBasePayload, SNRCheckResponse>>(null);

  useEffect(() => {
    let data = {} as IPrepareDataResult;
    //Ask User for data
    //1. Order information
    const askUser = async () => {
      const info = await orderInfoModal.current?.open();
      if (info === undefined || info?.cancelled || info?.data === undefined) {
        props.onCancel();
      }

      data = {
        ...data,
        feedback: info!.data!.feedback,
        employee: info!.data!.employee,
      };

      //2. Check SNR or create a new one
      const snr = await snrModal.current?.open();
      if (snr === undefined || snr?.cancelled || snr?.data === undefined) {
        props.onCancel();
      }

      data = { ...data, snr: snr!.data! };
      props.onResult(data);
    };

    askUser();
  }, []);

  return (
    <>
      <OrderInfoModal modalRef={orderInfoModal} variant={props.variant} />
      <SNRModal modalRef={snrModal} variant={props.variant} />
    </>
  );
};
