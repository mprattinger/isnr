import { useEffect, useRef, useState } from "react";
import { useAppData } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { SNRListEntryState, SnrOrigin, Variant } from "../models/Types";
import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
  BecPanelContainer,
  BecPanelRowContainer,
} from "bec-react-components";
import { useTranslation } from "react-i18next";
import { OrderInfo } from "../components/OrderInfo";
import { FeedbackTimer } from "../components/FeedbackTimer";
import { SNRContextProvider, useSNRContext } from "../contexts/SNRContext";
import { SNR } from "../components/SNR";
import { IPrepareDataResult, PrepareData } from "../components/PrepareData";
import { SNRListEntry } from "../models/SNRListEntry";
import { v7 } from "uuid";
import logger from "../../../utils/Logger";

export const SNRMain = () => {
  const { setProgramInfo, btrm, setError } = useAppData();

  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isDiry, setIsDirty] = useState(false);
  const [pageReady, setPageReady] = useState(false); //When all data is loaded, the page is ready for display
  const [canPrint, setCanPrint] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [prepareData, setPrepareData] = useState<IPrepareDataResult>();
  const [variant, setVariant] = useState(Variant.UNKNOWN);
  const [snrList, setSnrList] = useState<SNRListEntry[]>([]);
  const [workCount, setWorkCount] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);

  //Initialization
  useEffect(() => {
    logger.debug("Initializing SRNMain...");
    setProgramInfo((prev) => ({ ...prev, screen: "2" }));

    logger.debug(`The page is called with variant ${location.state}`);
    setVariant(location.state as Variant);

    logger.debug(
      `Checking if the order info and snr data is already loaded...`
    );
    if (typeof prepareData !== "undefined") {
      logger.debug(`Data is already loaded, page can be shown`);
      setPageReady(true);
    }
  }, []);

  useEffect(() => {
    const listModified = snrList.some(
      (x) =>
        x.state === SNRListEntryState.ADDED ||
        x.state === SNRListEntryState.MODIFIED ||
        x.state === SNRListEntryState.DUPLICATE ||
        x.state === SNRListEntryState.IS_BOX_SNR ||
        x.state === SNRListEntryState.ERROR
    );
    setIsDirty(listModified || timerActive);
  }, [snrList, timerActive]);

  //Checking if the Save Button should be shown
  //Its dependend of the dirty state
  useEffect(() => {
    if (isDiry) {
      setCanSave(true);
      return;
    }
    setCanSave(false);
  }, [isDiry]);

  const handleResult = (data: IPrepareDataResult) => {
    setPrepareData(data);

    setSnrList(
      data.snr.children
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((x) => {
          const ret = {} as SNRListEntry;
          ret.id = v7();
          ret.serialnumber = x.childSnr;
          ret.state = SNRListEntryState.EXISTING;
          ret.origin = x.origin as SnrOrigin;
          return ret;
        })
    );
    setPageReady(true);
  };

  const handlePrepareDataCanceled = () => {
    navigate("/");
  };
  const handleCancel = () => {
    navigate("/");
  };

  const handleModifiedWorkCount = (modifier: number) => {
    setWorkCount((prev) => prev + modifier);
  };

  const handleTimerModified = (action: string) => {
    setTimerActive(action === "START");
  };

  return (
    <>
      {pageReady ? (
        <SNRContextProvider variant={variant} data={prepareData}>
          <BecPanelContainer>
            <BecPanelRowContainer>
              <OrderInfo />
              <FeedbackTimer ontimerModified={handleTimerModified} />
            </BecPanelRowContainer>
            <BecPanel header={t("profid:24751")}>
              <SNR
                prevSnrs={snrList}
                boxSNR={prepareData?.snr.snr ?? ""}
                boxSize={parseInt(prepareData?.feedback.pack ?? "0")}
                onModified={handleModifiedWorkCount}
              />
            </BecPanel>
            <BecPanel>
              <BecButtonRowContainer>
                {canPrint && (
                  <BecButton variant={"default"} size={"default"}>
                    {t("profid:900000321")}
                  </BecButton>
                )}
                {canSave && (
                  <BecButton variant={"default"} size={"default"}>
                    {t("profid:900000021")}
                  </BecButton>
                )}
                <BecButton
                  variant={"default"}
                  size={"default"}
                  onClick={handleCancel}
                >
                  {t("profid:900000831")}
                </BecButton>
              </BecButtonRowContainer>
            </BecPanel>
          </BecPanelContainer>
        </SNRContextProvider>
      ) : (
        <PrepareData
          variant={variant}
          onResult={handleResult}
          onCancel={handlePrepareDataCanceled}
        />
      )}
    </>
  );
};
