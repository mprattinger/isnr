import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Variant } from "../models/Types";

type SNRContextType = {
  variant: Variant;
  setVariant: Dispatch<SetStateAction<Variant>>;
};

export const SNRContext = createContext<SNRContextType>({} as SNRContextType);

interface ISNRContextProviderProps extends PropsWithChildren {
  variant: Variant;
}

export const SNRContextProvider = (props: ISNRContextProviderProps) => {
  const [variant, setVariant] = useState(props.variant);

  useEffect(() => {
    setVariant(props.variant);
  }, [props.variant]);

  return (
    <SNRContext.Provider
      value={{
        variant,
        setVariant,
      }}
    >
      {props.children}
    </SNRContext.Provider>
  );
};

export const useSNRContext = () => {
  const { variant, setVariant } = useContext(SNRContext);

  return {
    variant,
    setVariant,
  };
};
