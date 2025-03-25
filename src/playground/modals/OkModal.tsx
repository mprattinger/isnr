import { IBaseModalProps, ModalHandle, ModalResult } from "./Types";
import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
} from "bec-react-components";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { RefObject } from "react";

interface IOkModalProps extends IBaseModalProps {
  message: string;
}

export const OkModal = (props: IOkModalProps) => {
  const { t } = useTranslation();

  const handleOKClicked = () => {
    const ref = props.modalRef as RefObject<ModalHandle>;
    if (ref.current) {
      ref.current.action(ModalResult.Ok());
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <BecPanel header={props.title}>
        <p>{props.message}</p>
        <BecButtonRowContainer>
          <BecButton variant={"orange"} onClick={handleOKClicked}>
            {t("profid:900001402")}
          </BecButton>
        </BecButtonRowContainer>
      </BecPanel>
    </Modal>
  );
};
