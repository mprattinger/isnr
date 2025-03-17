import { SNRListEntryState, SnrOrigin } from "./Types";

export interface SNRListEntry {
  serialnumber: string;
  state: SNRListEntryState;
  origin: SnrOrigin;
  errorMsg: string;
}
