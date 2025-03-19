import { useEffect, useRef, useState } from "react";
import { useAppData } from "../../../contexts/AppContext";
import { useLocation, useNavigate } from "react-router-dom";
import { SNRListEntryState, SnrOrigin, Variant } from "../models/Types";
import {
  ApplicationError,
  ApplicationErrorFactory,
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
import { ModalHandle } from "../../../playground/modals/Types";
import { OkModal } from "../../../playground/modals/OkModal";
import { CheckSnr } from "../services/SNRService";

export const SNRMain = () => {
  const { setProgramInfo, btrm, setError } = useAppData();
  const location = useLocation();
  const { t } = useTranslation();
  const [variant, setVariant] = useState(Variant.UNKNOWN);
  const navigate = useNavigate();
  const boxFullModal = useRef<ModalHandle>(null);
  const [boxFullTitle, setBoxFullTitle] = useState("");
  const [boxFullText, setBoxFullText] = useState("");

  const [pageReady, setPageReady] = useState(false); //When all data is loaded, the page is ready for display
  const [canPrint, setCanPrint] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [prepareData, setPrepareData] = useState<IPrepareDataResult>();
  const [snrList, setSnrList] = useState<SNRListEntry[]>([]);

  useEffect(() => {
    setProgramInfo((prev) => ({ ...prev, screen: "2" }));
    setVariant(location.state as Variant);

    if (typeof prepareData !== "undefined") {
      setPageReady(true);
    }

    switch (variant) {
      case Variant.PACKAGING:
        setBoxFullText(t("MaxPackaging"));
        setBoxFullTitle(t("MaxPackagingHeader"));
        break;
      case Variant.TOOLBUILDING:
        setBoxFullText(t("MaxTool"));
        setBoxFullTitle(t("MaxToolHeader"));
        break;
      default:
        break;
    }
  }, []);

  const handleNewSNR = async (snr: string) => {
    let entry = {} as SNRListEntry;
    entry.serialnumber = snr;

    let current = [...snrList];
    if (variant !== Variant.FEEDBACK && snr === prepareData?.snr.snr) {
      entry.state = SNRListEntryState.IS_BOX_SNR;
      setSnrList((prev) => {
        current = [...prev];
        current.push(entry);
        return [...current];
      });
    }

    if (
      current
        .filter((x) => x.state !== SNRListEntryState.REMOVED)
        .some((x) => x.serialnumber === snr)
    ) {
      //SNR already in the list
      entry.state = SNRListEntryState.DUPLICATE;
      setSnrList((prev) => {
        current = [...prev];
        current.push(entry);
        return [...current];
      });

      return;
    }

    const packageSize = parseInt(prepareData?.feedback?.pack ?? "0");
    const cnt = current.filter(
      (x) =>
        x.state === SNRListEntryState.ADDED ||
        x.state === SNRListEntryState.EXISTING ||
        x.state === SNRListEntryState.MODIFIED
    ).length;
    if (
      packageSize > 0 &&
      cnt === packageSize &&
      variant === Variant.PACKAGING
    ) {
      //TInform user, that the package size exceeds the max
      boxFullModal.current?.open();
      return;
    }

    //Check Serial number
    const checkResult = await CheckSnr(btrm, snr, variant);
    if (checkResult instanceof ApplicationError) {
      entry.state = SNRListEntryState.ERROR;
      entry.errorMsg = checkResult.message;
      setSnrList((prev) => {
        current = [...prev];
        current.push(entry);
        return [...current];
      });
      return;
    }

    if (
      variant === Variant.EXTSNR &&
      checkResult.snrOrigin !== SnrOrigin.EXTERNAL
    ) {
      const error = ApplicationErrorFactory(
        "SNR.SNR_NOT_EXTERN",
        t("SNR_NOT_EXTERN")
      );
      setError(error);
      return;
    }

    entry.state = SNRListEntryState.ADDED;
    entry.origin = checkResult.snrOrigin;
    setSnrList((prev) => {
      current = [...prev];
      current.push(entry);
      return [...current];
    });
  };

  const handleResult = (data: IPrepareDataResult) => {
    setPrepareData(data);
    //TODO: Sorting is missing
    setSnrList(
      data.snr.children.map((x) => {
        const ret = {} as SNRListEntry;
        ret.serialnumber = x.childSnr;
        ret.state = SNRListEntryState.EXISTING;
        ret.origin = x.origin as SnrOrigin;
        return ret;
      })
    );
    setPageReady(true);
  };

  const handleBoxFull = () => {};
  const handlePrepareDataCanceled = () => {
    navigate("/");
  };
  const handleCancel = () => {
    navigate("/");
  };

  return (
    <>
      {pageReady ? (
        <SNRContextProvider variant={variant} data={prepareData}>
          <BecPanelContainer>
            <BecPanelRowContainer>
              <OrderInfo />
              <FeedbackTimer />
            </BecPanelRowContainer>
            <BecPanel header={t("profid:24751")}>
              <SNR snrs={snrList} onNewSnr={handleNewSNR} />
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
      <OkModal
        modalRef={boxFullModal}
        title={boxFullTitle}
        message={boxFullText}
        callback={handleBoxFull}
      />
    </>
  );
};
