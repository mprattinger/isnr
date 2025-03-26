import {
  IBaseModalProps,
  isBaseMessagePayload,
  ModalHandle,
  ModalResult,
} from "./Types";
import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
} from "bec-react-components";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { RefObject, useEffect, useState } from "react";
import { useModalContext } from "./ModalContextProvider";

export const OkModal = (props: IBaseModalProps) => {
  const { t } = useTranslation();
  const { payload } = useModalContext();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    setTitle(payload?.title ?? "");
    if (payload && isBaseMessagePayload(payload)) {
      setMessage(payload.message ?? "");
    }
  }, [payload]);

  const handleOKClicked = () => {
    const ref = props.modalRef as RefObject<ModalHandle>;
    if (ref.current) {
      ref.current.action(ModalResult.Ok());
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <BecPanel header={title}>
        <p>{message}</p>
        <BecButtonRowContainer>
          <BecButton variant={"orange"} onClick={handleOKClicked}>
            {t("profid:900001402")}
          </BecButton>
        </BecButtonRowContainer>
      </BecPanel>
    </Modal>
  );
};
