import { CollectedItems } from "./CollectedItems";
import { SNRInput } from "../../common/components/SNRInput";
import { SNRList } from "../../common/components/SNRList";
import { SNRItem } from "../../common/components/SNRItem";
import { useState } from "react";

interface ISNRProps {}

export const SNR = (props: ISNRProps) => {
  const [snrList, setSnrList] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);

  const handleSnrInput = async (snr: string) => {
    const call = () => {
      return new Promise((res) => {
        setTimeout(() => {
          res(undefined);
        }, 2000);
      });
    };

    setProcessing(true);
    await call();
    setSnrList((prev) => [...prev, snr]);
    setProcessing(false);
  };

  return (
    <>
      <div className="flex justify-between grow">
        <SNRInput onSnrEntered={handleSnrInput} processing={processing} />
        <CollectedItems />
      </div>
      <SNRList>
        {snrList.map((snr, idx) => (
          <SNRItem no={idx + 1} snr={snr} />
        ))}
        {/* <SNRItem no={1} snr="1234567898765" /> */}
      </SNRList>
    </>
  );
};
