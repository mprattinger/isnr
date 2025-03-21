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
import { IPrepareDataResult } from "../components/PrepareData";
import { SNRListEntry } from "../models/SNRListEntry";

type SNRContextType = {
  variant: Variant;
  setVariant: Dispatch<SetStateAction<Variant>>;
  data: IPrepareDataResult | undefined;
  setData: Dispatch<SetStateAction<IPrepareDataResult | undefined>>;
  snrList: SNRListEntry[];
  setSnrList: Dispatch<SetStateAction<SNRListEntry[]>>;
};

export const SNRContext = createContext<SNRContextType>({} as SNRContextType);

interface ISNRContextProviderProps extends PropsWithChildren {
  variant: Variant;
  data: IPrepareDataResult | undefined;
}

export const SNRContextProvider = (props: ISNRContextProviderProps) => {
  const [variant, setVariant] = useState(props.variant);
  const [data, setData] = useState(props.data);
  const [snrList, setSnrList] = useState<SNRListEntry[]>([]);

  useEffect(() => {
    setVariant(props.variant);
    setData(props.data);
  }, [props.variant, props.data]);

  return (
    <SNRContext.Provider
      value={{
        variant,
        setVariant,
        data,
        setData,
        snrList,
        setSnrList,
      }}
    >
      {props.children}
    </SNRContext.Provider>
  );
};

export const useSNRContext = () => {
  const { variant, setVariant, data, setData, snrList, setSnrList } =
    useContext(SNRContext);

  return {
    variant,
    setVariant,
    data,
    setData,
    snrList,
    setSnrList,
  };
};
