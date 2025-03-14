import {
  ApplicationError,
  FunctionBoxItem,
  ProgramInfoModel,
} from "bec-react-components";
import {
  createContext,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Factory } from "../features/core/ProfidBaseApi";
import { AccessRightsAnalyzer } from "../features/core/services/AccessRightsAnalyzer";
import { IAccessRight } from "../features/core/models/AccessRight";
import { PrepLogonService } from "../features/common/services/PrepLogonService";

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
  functionCodes: FunctionBoxItem[];
  setFunctionCodes: Dispatch<SetStateAction<FunctionBoxItem[]>>;
  handleInfoPayload: (payload: string) => void;
  error?: ApplicationError;
  setError: Dispatch<SetStateAction<ApplicationError | undefined>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  accessRights: IAccessRight;
  setAccessRights: Dispatch<SetStateAction<IAccessRight>>;
  subscribeToKeyEvent: (listenerInfo: IKeyListener) => void;
  clearKeyListeners: () => void;
};

export const AppContext = createContext<AppContextType>({} as AppContextType);

interface IAppContextProviderProps extends PropsWithChildren {}

interface InfoPayload {
  BTRM: number;
  AUTH: string;
  ACCESS: string;
}

interface IKeyListener {
  forKey: string;
  event: (key: string) => void;
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
  const [functionCodes, setFunctionCodes] = useState<FunctionBoxItem[]>([]);
  const [currentError, setCurrentError] = useState<
    ApplicationError | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [accessRights, setAccessRights] = useState({} as IAccessRight);

  // #region Key Handling
  const [keyListeners, setKeyListeners] = useState([] as IKeyListener[]);
  const keyListenersRef = useRef(keyListeners);

  const subscribeToKeyEvent = (listenerInfo: IKeyListener) => {
    setKeyListeners((prev) => {
      console.log(prev);
      return [...prev, listenerInfo];
    });
  };
  const clearKeyListeners = () => {
    console.log(keyListeners.length);
    setKeyListeners([]);
  };

  const eventHandler = (event: KeyboardEvent) => {
    //Check if key is in list
    const listeners = keyListenersRef.current.filter(
      (x) => x.forKey === event.key
    );
    listeners.forEach((l) => l.event(event.key));

    if (listeners.length > 0) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  useEffect(() => {
    keyListenersRef.current = keyListeners;
  }, [keyListeners]);

  useEffect(() => {
    window.addEventListener("keyup", eventHandler);

    return () => {
      window.removeEventListener("keyup", eventHandler);
    };
  }, []);
  // #endregion

  const handleInfoPayload = async (payload: string) => {
    const payloadData = JSON.parse(payload) as InfoPayload;

    setBtrm(payloadData.BTRM);

    setPuiAuth(payloadData.AUTH);
    Factory(payloadData.AUTH);

    if (payloadData.ACCESS && payloadData.ACCESS !== "") {
      const ar = AccessRightsAnalyzer(payloadData.ACCESS);
      setAccessRights(ar);
    }

    //Firmen laden und aktuelle Fimra setzten
    const companyResult = await PrepLogonService();
    if (companyResult instanceof ApplicationError) {
      setCurrentError(companyResult);
      return;
    }
    const company = companyResult.find(
      (x) => parseInt(x.compid) === payloadData.BTRM
    );
    if (company) {
      setCompanyName(company.compname);
    }

    //TODO: FunctionCodes laden
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
        functionCodes,
        setFunctionCodes,
        handleInfoPayload,
        error: currentError,
        setError: setCurrentError,
        isLoading,
        setIsLoading,
        accessRights,
        setAccessRights,
        subscribeToKeyEvent,
        clearKeyListeners,
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
    functionCodes,
    setFunctionCodes,
    handleInfoPayload,
    error,
    setError,
    isLoading,
    setIsLoading,
    accessRights,
    setAccessRights,
    subscribeToKeyEvent,
    clearKeyListeners,
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
    functionCodes,
    setFunctionCodes,
    handleInfoPayload,
    error,
    setError,
    isLoading,
    setIsLoading,
    accessRights,
    setAccessRights,
    subscribeToKeyEvent,
    clearKeyListeners,
  };
}

// #endregion
