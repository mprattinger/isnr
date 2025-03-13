import {
  BecAppContainer,
  BecError,
  BecTopbar,
  FunctionBoxItem,
} from "bec-react-components";
import { useAppData } from "./contexts/AppContext";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RegisterRDFCommunication,
  SendRDFCommand,
  UnRegisterRDFCommunication,
} from "./features/core/services/RDFCommunicationService";
import { GetProgramInfo } from "./features/core/services/ProgramInfoService";
import { Route, Routes } from "react-router-dom";
import { OverviewPage } from "./features/overview/pages/OverviewPage";
import { SNRMain } from "./features/snr/pages/SNRMain";

export function App() {
  const [functionCodes] = useState<FunctionBoxItem[]>([]);
  const { t } = useTranslation();
  const {
    companyName,
    setCompanyName,
    setProgramInfo,
    programInfo,
    handleInfoPayload,
    error,
    setError,
  } = useAppData();

  useEffect(() => {
    setCompanyName("Becom Electronics GmbH");
    setProgramInfo(GetProgramInfo());
    RegisterRDFCommunication((action: string, payload: string) => {
      if (action === "getInfo") {
        handleInfoPayload(payload);
      }
    });
    SendRDFCommand("getInfo");

    return () => {
      UnRegisterRDFCommunication();
    };
  }, []);

  const functionCodeSelected = (code: string) => {
    console.log(`Should jump to ${code}`);
  };

  return (
    <BecAppContainer>
      <BecTopbar
        programName={t("profid:47091")}
        functionLabel={t("profid:13591")}
        companyLabel={t("profid:13211")}
        functionCodes={functionCodes}
        companyName={companyName}
        functionSelected={functionCodeSelected}
        info={programInfo}
      />
      <Routes>
        <Route
          path="/"
          element={
            <OverviewPage onFunctionCodeSelected={functionCodeSelected} />
          }
        />
        <Route path="/snr" element={<SNRMain />} />
      </Routes>
      {error && (
        <BecError
          errorMessage={error.message}
          clearError={() => setError(undefined)}
        />
      )}
    </BecAppContainer>
  );
}
