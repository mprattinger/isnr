import { createContext, useState } from "react";

interface IAppContext {
    btrm: number,
    updateBtrm: (newBtrm: number) => void,
    puiAuth: string,
    updatePuiAuth: (newPuiAuth: string) => void,
    companyName: string,
    updateCompanyName: (newCompanyName: string) => void,
}

interface Props {
    children: React.ReactNode
}

export const AppContext = createContext<IAppContext | null>(null);

export const AppContextProvider: React.FC<Props> = (props: Props) => {

    const [btrm, setBtrm] = useState(0);
    const [puiAuth, setPuiAuth] = useState("NOAUTH");
    const [companyName, setCompanyName] = useState("N/A");

    const updateBtrm = (newBtrm: number) => {
        setBtrm(newBtrm);
    }

    const updatePuiAuth = (newPuiAuth: string) => {
        setPuiAuth(newPuiAuth);
    }

    const updateCompanyName = (newCompanyName: string) => {
        setCompanyName(newCompanyName);
    }

    return (
        <AppContext.Provider value={{ btrm, updateBtrm, puiAuth, updatePuiAuth, companyName, updateCompanyName}}>
            {props.children}
        </AppContext.Provider>
    )
}