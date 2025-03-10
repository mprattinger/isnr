import { ApplicationError, ProgramInfoModel } from "bec-react-components";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Factory } from "../features/core/ProfidBase";

// #region Context

type AppContextType = {
  btrm: number;
  setBtrm: Dispatch<SetStateAction<number>>;
  companyName: string;
  setCompanyName: Dispatch<SetStateAction<string>>;
  puiAuth: string;
  setPuiAuth: Dispatch<SetStateAction<string>>;
  programInfo: ProgramInfoModel;
  setProgramInfo: Dispatch<SetStateAction<ProgramInfoModel>>;
  handleInfoPayload: (payload: string) => void;
  error?: ApplicationError;
  setError: Dispatch<SetStateAction<ApplicationError | undefined>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface IAppContextProviderProps extends PropsWithChildren {}

interface InfoPayload {
  BTRM: number;
  AUTH: string;
}

export const AppContextProvider = (props: IAppContextProviderProps) => {
  const [btrm, setBtrm] = useState(0);
  const [companyName, setCompanyName] = useState("N/A");
  const [puiAuth, setPuiAuth] = useState("NOAUTH");
  const [programInfo, setProgramInfo] = useState({
    creationYear: "",
    developer: "",
    screen: "",
    program: "",
  });
  const [currentError, setCurrentError] = useState<
    ApplicationError | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const handleInfoPayload = (payload: string) => {
    const payloadData = JSON.parse(payload) as InfoPayload;
    setBtrm(payloadData.BTRM);
    setPuiAuth(payloadData.AUTH);
    Factory(payloadData.AUTH);
  };

  return (
    <AppContext.Provider
      value={{
        btrm,
        setBtrm,
        companyName,
        setCompanyName,
        puiAuth,
        setPuiAuth,
        programInfo,
        setProgramInfo,
        handleInfoPayload,
        error: currentError,
        setError: setCurrentError,
        isLoading,
        setIsLoading,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

// #endregion

// #region ContextHook

export function useAppData() {
  const {
    btrm,
    setBtrm,
    companyName,
    setCompanyName,
    puiAuth,
    setPuiAuth,
    programInfo,
    setProgramInfo,
    handleInfoPayload,
    error,
    setError,
    isLoading,
    setIsLoading,
  } = useContext(AppContext);

  return {
    btrm,
    setBtrm,
    companyName,
    setCompanyName,
    puiAuth,
    setPuiAuth,
    programInfo,
    setProgramInfo,
    handleInfoPayload,
    error,
    setError,
    isLoading,
    setIsLoading,
  };
}

// #endregion
