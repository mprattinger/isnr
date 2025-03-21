import { SNRListEntry } from "../../snr/models/SNRListEntry";
import { SNRListEntryState } from "../../snr/models/Types";
import { Pencil } from "../svgs/Pencil";
import { TrashCan } from "../svgs/TrashCan";

export declare type ActionType = "MODIFY" | "REMOVE";

interface ISNRItemActionsProps {
  isHeader?: boolean;
  entry?: SNRListEntry;
  onAction: (type: ActionType) => void;
}
export const SNRItemActions = (props: ISNRItemActionsProps) => {
  if (props.isHeader) return null;
  if (!props.entry) return null;
  if (props.entry.state === SNRListEntryState.EXISTING) return null;

  return (
    <div className="flex gap-x-4 pt-1">
      <Pencil onClick={() => props.onAction("MODIFY")} />
      <TrashCan onClick={() => props.onAction("REMOVE")} />
    </div>
  );
};
