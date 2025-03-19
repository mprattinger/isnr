import { CollectedItems } from "./CollectedItems";
import { SNRInput } from "../../common/components/SNRInput";
import { SNRList } from "../../common/components/SNRList";
import { SNRItem } from "../../common/components/SNRItem";
import { SNRListEntry } from "../models/SNRListEntry";

interface ISNRProps {
  snrs: SNRListEntry[];
  onNewSnr: (snr: string) => Promise<void>;
}

export const SNR = (props: ISNRProps) => {
  return (
    <>
      <div className="flex justify-between grow">
        <SNRInput onNewSnr={props.onNewSnr} />
        <CollectedItems snrs={props.snrs} />
      </div>
      <SNRList>
        {props.snrs.map((snr, idx) => (
          <SNRItem key={idx} no={idx + 1} snr={snr} />
        ))}
      </SNRList>
    </>
  );
};
