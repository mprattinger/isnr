import { useEffect, useRef, useState } from "react";
import { useAppData } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import {
  SaveMode,
  SNRListEntryState,
  SnrOrigin,
  Variant,
} from "../models/Types";
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
import { SNRContextProvider } from "../contexts/SNRContext";
import { SNR } from "../components/SNR";
import { IPrepareDataResult, PrepareData } from "../components/PrepareData";
import { SNRListEntry } from "../models/SNRListEntry";
import { v7 } from "uuid";
import logger from "../../../utils/Logger";
import { OkModal } from "../../../playground/modals/OkModal";
import {
  IBaseMessagePayload,
  ModalHandle,
} from "../../../playground/modals/Types";
import { SaveDialog } from "../components/modals/SaveDialog";

export const SNRMain = () => {
  const { setProgramInfo, btrm, setError } = useAppData();

  const location = useLocation();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isDirty, setIsDirty] = useState(false);
  const [pageReady, setPageReady] = useState(false); //When all data is loaded, the page is ready for display
  const [canPrint, setCanPrint] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [prepareData, setPrepareData] = useState<IPrepareDataResult>();
  const [variant, setVariant] = useState(Variant.UNKNOWN);
  const [snrList, setSnrList] = useState<SNRListEntry[]>([]);
  const [workCount, setWorkCount] = useState<number>(0);
  const [timerActive, setTimerActive] = useState(false);
  // const [okModalText, setOkModalText] = useState("");
  // const [okModalTitle, setOkModalTitle] = useState("");
  // const [saveModalText, setSaveModalText] = useState("");
  // const [saveModalTitle, setSaveModalTitle] = useState("");

  const okModalRef = useRef<ModalHandle<IBaseMessagePayload, undefined>>(null);
  const saveModalRef = useRef<ModalHandle<IBaseMessagePayload, SaveMode>>(null);

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
  //Checking if the Print Button should be shown
  //Its dependend of the dirty state
  useEffect(() => {
    if (isDirty) {
      setCanSave(true);
      return;
    }
    setCanSave(false);

    if (variant === Variant.FEEDBACK || variant === Variant.EXTSNR) {
      setCanPrint(false);
      return;
    }

    if (
      !isDirty &&
      snrList.some((x) => x.state !== SNRListEntryState.REMOVED)
    ) {
      setCanPrint(true);
    }
  }, [isDirty, variant, snrList]);

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

  const handleSave = async () => {
    try {
      setError(undefined);

      logger.debug(`Check if save is possible...`);
      if (
        snrList.some(
          (x) =>
            x.state === SNRListEntryState.DUPLICATE ||
            x.state === SNRListEntryState.IS_BOX_SNR ||
            x.state === SNRListEntryState.ERROR
        )
      ) {
        logger.debug(
          `There are items with bad state in the list, so save is not possible!`
        );
        // setOkModalText(t("INVALID_ENTRIES_NO_SAVE"));
        // setOkModalTitle(t("INVALID_ENTRIES_NO_SAVE_TITLE"));
        await okModalRef.current?.open({
          title: t("INVALID_ENTRIES_NO_SAVE_TITLE"),
          message: t("INVALID_ENTRIES_NO_SAVE"),
        } as IBaseMessagePayload);
        return;
      }

      logger.debug("Saving is possible! Ask for save mode...");
    } catch (error) {}
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
                  <BecButton
                    variant={"default"}
                    size={"default"}
                    onClick={handleSave}
                  >
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
      <OkModal modalRef={okModalRef} />
      <SaveDialog modalRef={saveModalRef} variant={variant} />
    </>
  );
};
