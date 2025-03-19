import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
} from "bec-react-components";
import Modal from "./Modal";
import { IBaseModalProps, ModalResult } from "./Types";
import { useTranslation } from "react-i18next";

interface IYesNoModalProps extends IBaseModalProps<undefined> {
  message: string;
}

export const YesNoModal = (props: IYesNoModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal ref={props.modalRef}>
      <BecPanel header={props.title}>
        <p>{props.message}</p>
        <BecButtonRowContainer>
          <BecButton
            variant={"orange"}
            onClick={() => props.callback(ModalResult.Ok())}
          >
            {t("profid:15561")}
          </BecButton>
          <BecButton
            variant={"orange"}
            onClick={() => props.callback(ModalResult.Cancel())}
          >
            {t("profid:38191")}
          </BecButton>
        </BecButtonRowContainer>
      </BecPanel>
    </Modal>
  );
};
