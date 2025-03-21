import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface IModalContextType {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const ModalContext = createContext<IModalContextType>(
  {} as IModalContextType
);

interface IModalContextProviderProps extends PropsWithChildren {
  isOpen: boolean;
}

export const ModalContextProvider = (props: IModalContextProviderProps) => {
  const [isOpen, setIsOpen] = useState(props.isOpen);

  useEffect(() => {
    setIsOpen(props.isOpen);
  }, [props.isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, setIsOpen }}>
      {props.children}
    </ModalContext.Provider>
  );
};

export const useModalCOntext = () => {
  const { isOpen, setIsOpen } = useContext(ModalContext);

  return {
    isOpen,
    setIsOpen,
  };
};
