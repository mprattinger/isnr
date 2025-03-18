import { PropsWithChildren, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";

export type ModalHandle = {
  open: () => void;
  close: () => void;
};

interface IModalProps extends PropsWithChildren {
  defaultOpened?: boolean;
  ref: React.Ref<ModalHandle>;
}

const modalElement = document.getElementById("modal");

const Modal = (props: IModalProps) => {
  const [isOpen, setIsOpen] = useState(props.defaultOpened ?? false);

  useImperativeHandle(
    props.ref,
    () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [close]
  );

  return createPortal(
    isOpen ? (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-becmodal z-50">
        <div className="fixed top-[25%] left-[50%] bg-white z-50 -translate-x-[50%] -translate-y-[25%] rounded shadow-xl">
          <div className="flex flex-col w-96 relative">
            <div
              className="cursor-pointer text-xl hover:font-bold absolute right-3 top-2"
              onClick={() => setIsOpen(false)}
            >
              X
            </div>
            {props.children}
          </div>
        </div>
      </div>
    ) : null,
    modalElement!
  );
};

export default Modal;
