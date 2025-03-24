import { SNRListEntry } from "../models/SNRListEntry";
import { SNRListEntryState } from "../models/Types";

export const ReOrgSNRList = (currentList: SNRListEntry[]): SNRListEntry[] => {
  const ret: SNRListEntry[] = [];

  for (let index = 0; index < currentList.length; index++) {
    const itm = currentList[index];

    if (itm.state === SNRListEntryState.REMOVED) {
      continue;
    }

    if (itm.state === SNRListEntryState.EXISTING) {
      ret.push(itm);
      continue;
    }

    if (ret.some((x) => x.serialnumber === itm.serialnumber)) {
      itm.state = SNRListEntryState.DUPLICATE;
      ret.push(itm);
      continue;
    }

    if (itm.state === SNRListEntryState.DUPLICATE) {
      itm.state = SNRListEntryState.ADDED;
      ret.push(itm);
      continue;
    }

    ret.push(itm);
  }

  return ret;
};
