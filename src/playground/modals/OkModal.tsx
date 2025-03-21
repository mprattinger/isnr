import { IBaseModalProps, ModalResult } from "./Types";
import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
} from "bec-react-components";
import { useTranslation } from "react-i18next";
import { Modal } from "./Modal";

interface IOkModalProps extends IBaseModalProps<undefined, undefined> {
  message: string;
}

export const OkModal = (props: IOkModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal ref={props.modalRef} callback={props.callback}>
      <BecPanel header={props.title}>
        <p>{props.message}</p>
        <BecButtonRowContainer>
          <BecButton
            variant={"orange"}
            onClick={() => props.callback(ModalResult.Ok())}
          >
            {t("profid:900001402")}
          </BecButton>
        </BecButtonRowContainer>
      </BecPanel>
    </Modal>
  );
};
