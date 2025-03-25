import {
  PropsWithChildren,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { ModalHandle, ModalResult } from "./Types";

interface IModalProps<T, U> extends PropsWithChildren {
  defaultOpened?: boolean;
  ref: React.Ref<ModalHandle<T, U>>;
}

export const ModalOpenEventName = "modalOpenEvent";
export const ModalCloseEventName = "modalOpenEvent";
export interface IModalOpenEventPayload<T> {
  payload?: T;
}

const modalElement = document.getElementById("modal");

export function Modal<T, U>(props: IModalProps<T, U>) {
  const [isOpen, setIsOpen] = useState(props.defaultOpened ?? false);

  const promiseRef = useRef<(value: ModalResult<U | undefined>) => void>(null);

  useImperativeHandle(
    props.ref,
    () => ({
      open: (payload?: T) => {
        setIsOpen(true);
        const modalToggleEvent = new CustomEvent<IModalOpenEventPayload<T>>(
          ModalOpenEventName,
          {
            detail: { payload: payload },
          }
        );
        window.dispatchEvent(modalToggleEvent);
        return new Promise<ModalResult<U | undefined>>((resolve) => {
          promiseRef.current = resolve;
        });
      },
      action: (payload: ModalResult<U>) => {
        setIsOpen(false);
        if (promiseRef.current) {
          promiseRef.current(payload);
        }
      },
    }),
    [close]
  );

  const handleCancelClick = () => {
    setIsOpen(false);
    if (promiseRef.current) {
      const res = ModalResult.Cancel();
      promiseRef.current(res);
    }
  };

  return createPortal(
    // <ModalContextProvider isOpen={isOpen}>
    isOpen ? (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-becmodal z-50">
        <div className="fixed top-[25%] left-[50%] bg-white z-50 -translate-x-[50%] -translate-y-[25%] rounded shadow-xl">
          <div className="flex flex-col w-96 relative">
            <div
              className="cursor-pointer text-xl hover:font-bold absolute right-3 top-2"
              onClick={handleCancelClick}
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
