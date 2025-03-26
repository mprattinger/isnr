import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
} from "bec-react-components";
import {
  IBaseMessagePayload,
  IBaseModalProps,
  isBaseMessagePayload,
  ModalHandle,
  ModalResult,
} from "./Types";
import { useTranslation } from "react-i18next";
import { IModalOpenEventPayload, Modal, ModalOpenEventName } from "./Modal";
import { RefObject, useEffect, useState } from "react";
import { useModalContext } from "./ModalContextProvider";

// interface IYesNoModalProps extends IBaseModalProps {
//   message: string;
// }

export function YesNoModal(props: IBaseModalProps) {
  const { t } = useTranslation();
  const { payload } = useModalContext();

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   setTitle(payload?.title ?? "");
  //   if (payload && isBaseMessagePayload(payload)) {
  //     setMessage(payload.message ?? "");
  //   }
  // }, [payload]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener(
      ModalOpenEventName,
      (d) => {
        if (d instanceof CustomEvent) {
          const evt = d.detail as IModalOpenEventPayload<IBaseMessagePayload>;
          if (evt.payload) {
            setTitle(evt.payload.title ?? "");
            setMessage(evt.payload.message ?? "");
          }
        }
      },
      { signal }
    );

    return () => {
      controller.abort();
    };
  }, []);

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
      <BecPanel header={title}>
        <p>{message}</p>
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
