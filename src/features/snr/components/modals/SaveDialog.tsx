import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
  BecTextOutput,
} from "bec-react-components";
import { Modal } from "../../../../playground/modals/Modal";
import {
  IBaseModalProps,
  IBasePayload,
  ModalHandle,
  ModalResult,
  isBaseMessagePayload,
} from "../../../../playground/modals/Types";
import { SaveMode, Variant } from "../../models/Types";
import { useTranslation } from "react-i18next";
import { RefObject, useEffect, useState } from "react";
import { useModalContext } from "../../../../playground/modals/ModalContextProvider";

interface ISaveDialogProps extends IBaseModalProps<IBasePayload, SaveMode> {
  variant: Variant;
}

export const SaveDialog = (props: ISaveDialogProps) => {
  const { t } = useTranslation();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [newBtnText, setNewBtnText] = useState("");
  const [showNewBtn, setShowNewBtn] = useState(false);

  const { payload } = useModalContext();

  useEffect(() => {
    switch (props.variant) {
      case Variant.PACKAGING:
        setNewBtnText(t("profid:900002571"));
        setShowNewBtn(true);
        break;
      case Variant.TOOLBUILDING:
        setNewBtnText(t("profid:900002601"));
        setShowNewBtn(true);
        break;
      case Variant.EXTSNR:
        setNewBtnText(t("profid:900002601"));
        setShowNewBtn(true);
        break;
      default:
        setNewBtnText("");
        setShowNewBtn(false);
        break;
    }

    setTitle(payload?.title ?? "");
    if (payload && isBaseMessagePayload(payload)) {
      setMessage(payload.message ?? "");
    }
  }, [props.variant, payload]);

  const handleNewClicked = () => {
    const ref = props.modalRef as RefObject<
      ModalHandle<IBasePayload, SaveMode | undefined>
    >;

    if (ref.current) {
      ref.current.action(ModalResult.OkWithData(SaveMode.NEW));
    }
  };

  const handleReportClicked = () => {
    const ref = props.modalRef as RefObject<
      ModalHandle<IBasePayload, SaveMode | undefined>
    >;

    if (ref.current) {
      ref.current.action(ModalResult.OkWithData(SaveMode.REPORT));
    }
  };

  const handleSaveClicked = () => {
    const ref = props.modalRef as RefObject<
      ModalHandle<IBasePayload, SaveMode | undefined>
    >;

    if (ref.current) {
      ref.current.action(ModalResult.OkWithData(SaveMode.SAVE));
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <BecPanel header={title}>
        <BecTextOutput id="sdmessage" value={message} />
        <BecButtonRowContainer>
          {showNewBtn && (
            <BecButton variant={"orange"} onClick={handleNewClicked}>
              {newBtnText}
            </BecButton>
          )}
          <BecButton variant={"orange"} onClick={handleReportClicked}>
            {t("profid:900002581")}
          </BecButton>
          <BecButton variant={"orange"} onClick={handleSaveClicked}>
            {t("profid:900000021")}
          </BecButton>
        </BecButtonRowContainer>
      </BecPanel>
    </Modal>
  );
};
