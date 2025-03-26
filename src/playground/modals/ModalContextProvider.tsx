import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { IBaseMessagePayload, IBasePayload } from "./Types";

type ModalContextType = {
  payload: IBasePayload | undefined;
  setPayload: Dispatch<SetStateAction<IBaseMessagePayload | undefined>>;
};

export const ModalContext = createContext<ModalContextType>(
  {} as ModalContextType
);

interface IModalContextProps extends PropsWithChildren {
  payload?: IBasePayload;
}

export const ModalContextProvider = (props: IModalContextProps) => {
  const [payload, setPayload] = useState<IBasePayload | undefined>(
    props.payload
  );

  return (
    <ModalContext.Provider
      value={{
        payload,
        setPayload,
      }}
    >
      {props.children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const { payload, setPayload } = useContext(ModalContext);

  return {
    payload,
    setPayload,
  };
};
