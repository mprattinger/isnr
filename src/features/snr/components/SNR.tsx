import { CollectedItems } from "./CollectedItems";
import { SNRInput } from "../../common/components/SNRInput";
import { SNRList } from "../../common/components/SNRList";
import { SNRItem } from "../../common/components/SNRItem";
import { SNRListEntry } from "../models/SNRListEntry";
import { SNRListEntryState, SnrOrigin, Variant } from "../models/Types";
import { useSNRContext } from "../contexts/SNRContext";
import { useEffect, useRef, useState } from "react";
import { CheckSnr } from "../services/SNRService";
import {
  ApplicationError,
  ApplicationErrorFactory,
} from "bec-react-components";
import { useAppData } from "../../../contexts/AppContext";
import { useTranslation } from "react-i18next";
import { v7 } from "uuid";
import { ReOrgSNRList } from "../utils/Tools";
import { OkModal } from "../../../playground/modals/OkModal";
import { ModalHandle } from "../../../playground/modals/Types";

interface ISNRProps {
  // onNewSnr: (snr: string) => Promise<void>;
  boxSNR: string;
  boxSize: number;
  prevSnrs: SNRListEntry[];
  onModified: (modifier: number) => void;
}

export const SNR = (props: ISNRProps) => {
  const { btrm, setError } = useAppData();
  const { snrList, setSnrList, variant } = useSNRContext();

  const { t } = useTranslation();

  const boxFullModal = useRef<ModalHandle>(null);

  const [boxFullTitle, setBoxFullTitle] = useState("");
  const [boxFullText, setBoxFullText] = useState("");

  useEffect(() => {
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
  }, [variant]);

  useEffect(() => {
    setSnrList(props.prevSnrs);
  }, [props.prevSnrs]);

  const handleNewSNR = async (snr: string) => {
    let entry = {} as SNRListEntry;
    entry.id = v7();
    entry.serialnumber = snr;

    let current = [...snrList];

    if (variant !== Variant.FEEDBACK && snr === props.boxSNR) {
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
    const packageSize = props.boxSize;
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
      //Inform user, that the package size exceeds the max
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

    props.onModified(1);
  };

  const handleModified = (snr: SNRListEntry) => {
    setSnrList((prev) => {
      let list = [...prev];
      const idy = list.findIndex((x) => x.id === snr.id);
      list[idy] = snr;

      //Nun die die Liste überarbeiten
      const newList = ReOrgSNRList(list);

      return [...newList];
    });
  };

  const handleDelete = (snr: SNRListEntry) => {
    setSnrList((prev) => {
      let list = [...prev];
      const idy = list.findIndex((x) => x.id === snr.id);
      list[idy].state = SNRListEntryState.REMOVED;

      //Nun die die Liste überarbeiten
      const newList = ReOrgSNRList(list);

      return [...newList];
    });
    props.onModified(-1);
  };

  const handleBoxFull = () => {};

  return (
    <>
      <div className="flex justify-between grow">
        <SNRInput onNewSnr={handleNewSNR} />
        <CollectedItems snrs={snrList} />
      </div>
      <SNRList>
        {snrList.map((snr, idx) => (
          <SNRItem
            key={idx}
            no={idx + 1}
            snr={snr}
            onSNRModified={handleModified}
            onSNRDeleted={handleDelete}
          />
        ))}
      </SNRList>
      <OkModal
        modalRef={boxFullModal}
        title={boxFullTitle}
        message={boxFullText}
        callback={handleBoxFull}
      />
    </>
  );
};
