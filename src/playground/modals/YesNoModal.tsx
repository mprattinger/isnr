import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
} from "bec-react-components";
import { IBaseModalProps, ModalHandle, ModalResult } from "./Types";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";
import { RefObject } from "react";

interface IYesNoModalProps extends IBaseModalProps {
  message: string;
}

export function YesNoModal(props: IYesNoModalProps) {
  const { t } = useTranslation();

  const handleYesClicked = () => {
    const ref = props.modalRef as RefObject<ModalHandle>;
    if (ref.current) {
      ref.current.action(ModalResult.Ok());
    }
  };

  const handleNoClicked = () => {
    const ref = props.modalRef as RefObject<ModalHandle>;
    if (ref.current) {
      ref.current.action(ModalResult.Cancel());
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <BecPanel header={props.title}>
        <p>{props.message}</p>
        <BecButtonRowContainer>
          <BecButton variant={"orange"} onClick={handleYesClicked}>
            {t("profid:15561")}
          </BecButton>
          <BecButton variant={"orange"} onClick={handleNoClicked}>
            {t("profid:38191")}
          </BecButton>
        </BecButtonRowContainer>
      </BecPanel>
    </Modal>
  );
}
