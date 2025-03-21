import {
  PropsWithChildren,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ModalHandle, ModalResult } from "./Types";
interface IModalProps<T> extends PropsWithChildren {
  defaultOpened?: boolean;
  ref: React.Ref<ModalHandle<T>>;
  callback: (result: ModalResult<undefined>) => void;
}

export const ModalOpenEventName = "modalOpenEvent";
export const ModalCloseEventName = "modalOpenEvent";
export interface IModalOpenEventPayload<T> {
  payload?: T;
}

const modalElement = document.getElementById("modal");

export function Modal<T>(props: IModalProps<T>) {
  const [isOpen, setIsOpen] = useState(props.defaultOpened ?? false);

  //TODO: Make open possible without parameter
  useImperativeHandle(
    props.ref,
    () => ({
      open: (payload: T) => {
        setIsOpen(true);
        const modalToggleEvent = new CustomEvent<IModalOpenEventPayload<T>>(
          ModalOpenEventName,
          {
            detail: { payload: payload },
          }
        );
        window.dispatchEvent(modalToggleEvent);
      },
      close: () => {
        setIsOpen(false);
        const modalToggleEvent = new Event(ModalCloseEventName);
        window.dispatchEvent(modalToggleEvent);
      },
    }),
    [close]
  );

  return createPortal(
    // <ModalContextProvider isOpen={isOpen}>
    isOpen ? (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-becmodal z-50">
        <div className="fixed top-[25%] left-[50%] bg-white z-50 -translate-x-[50%] -translate-y-[25%] rounded shadow-xl">
          <div className="flex flex-col w-96 relative">
            <div
              className="cursor-pointer text-xl hover:font-bold absolute right-3 top-2"
              onClick={() => props.callback(ModalResult.Cancel())}
            >
              X
            </div>
            {props.children}
          </div>
        </div>
      </div>
    ) : null,
    // </ModalContextProvider>,
    modalElement!
  );
}
