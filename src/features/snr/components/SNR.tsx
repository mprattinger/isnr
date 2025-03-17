import { CollectedItems } from "./CollectedItems";
import { SNRInput } from "../../common/components/SNRInput";
import { SNRList } from "../../common/components/SNRList";
import { SNRItem } from "../../common/components/SNRItem";
import { useState } from "react";
import { useSNRContext } from "../contexts/SNRContext";
import { CheckSnr } from "../services/SNRService";
import { useAppData } from "../../../contexts/AppContext";
import {
  ApplicationError,
  ApplicationErrorFactory,
} from "bec-react-components";
import { SNRListEntry } from "../models/SNRListEntry";
import { SNRListEntryState, SnrOrigin, Variant } from "../models/Types";
import { set } from "react-hook-form";
import { useTranslation } from "react-i18next";

// const checkSnr = async (mandant: snr: string): Promise<boolean> => {
//   return new Promise((res) => {
//     await CheckSnr();
//   });
// };

interface ISNRProps {}

export const SNR = (props: ISNRProps) => {
  const [snrList, setSnrList] = useState<SNRListEntry[]>([]);

  const { variant } = useSNRContext();
  const { btrm, setError } = useAppData();
  const { t } = useTranslation();
  // const handleCheck = (snr: string) => {
  //   return snrList.some((x) => x === snr);
  // };

  const handleNewSnr = async (snr: string) => {
    let entry = {} as SNRListEntry;
    entry.serialnumber = snr;

    if (variant !== Variant.FEEDBACK) {
      //TODO: Check if snr is not the parent snr
    }

    let current = [...snrList];
    // current.filter(x => x.state != SNRListEntryState.REMOVED).forEach((x) => tempSet.add(x.serialnumber));
    // if (tempSet.has(snr)) {
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

    //TODO: get package size from loaded data
    const packSize = 0;
    const cnt = current.filter(
      (x) =>
        x.state === SNRListEntryState.ADDED ||
        x.state === SNRListEntryState.EXISTING ||
        x.state === SNRListEntryState.MODIFIED
    ).length;
    if (packSize > 0 && cnt === packSize && variant === Variant.PACKAGING) {
      //TODO: Inform user, that the package size exceeds the max
      return;
    }

    // const checkResult = await checkSnr(snr);
    // if (checkResult) {
    //   setSnrList((prev) => {
    //     const updatedSet = new Set(prev);
    //     updatedSet.add(snr);
    //     return [...updatedSet];
    //   });
    // }
    const result = await CheckSnr(btrm, snr, variant);
    if (result instanceof ApplicationError) {
      entry.state = SNRListEntryState.ERROR;
      entry.errorMsg = result.message;
      setSnrList((prev) => {
        current = [...prev];
        current.push(entry);
        return [...current];
      });
      return;
    }

    if (variant === Variant.EXTSNR && result.snrOrigin != SnrOrigin.EXTERNAL) {
      const error = ApplicationErrorFactory(
        "SNR.SNR_NOT_EXTERN",
        t("SNR_NOT_EXTERN")
      );
      setError(error);
      return;
    }

    entry.state = SNRListEntryState.ADDED;
    entry.origin = result.snrOrigin;
    setSnrList((prev) => {
      current = [...prev];
      current.push(entry);
      return [...current];
    });
  };

  return (
    <>
      <div className="flex justify-between grow">
        <SNRInput onNewSnr={handleNewSnr} />
        <CollectedItems />
      </div>
      <SNRList>
        {snrList.map((snr, idx) => (
          <SNRItem key={idx} no={idx + 1} snr={snr} />
        ))}
      </SNRList>
    </>
  );
};
