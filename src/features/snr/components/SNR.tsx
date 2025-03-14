import { CollectedItems } from "./CollectedItems";
import { SNRInput } from "../../common/components/SNRInput";
import { SNRList } from "../../common/components/SNRList";
import { SNRItem } from "../../common/components/SNRItem";
import { useState } from "react";

const checkSnr = async (snr: string): Promise<boolean> => {
  return new Promise((res) => {
    //Simulate web service call
    //TODO: Implement api call
    setTimeout(() => {
      res(true);
    }, 2000);
  });
};

interface ISNRProps {}

export const SNR = (props: ISNRProps) => {
  const [snrList, setSnrList] = useState<string[]>([]);

  const handleCheck = (snr: string) => {
    return snrList.some((x) => x === snr);
  };

  const handleNewSnr = async (snr: string) => {
    const tempSet = new Set(snrList);
    if (tempSet.has(snr)) {
      //SNR already in the list
      //TODO: Handle SNR already in the list case
      return;
    }

    const checkResult = await checkSnr(snr);
    if (checkResult) {
      setSnrList((prev) => {
        const updatedSet = new Set(prev);
        updatedSet.add(snr);
        return [...updatedSet];
      });
    }
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
