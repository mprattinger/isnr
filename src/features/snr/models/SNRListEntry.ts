import { SNRListEntryState, SnrOrigin } from "./Types";

export interface SNRListEntry {
  id: string;
  serialnumber: string;
  state: SNRListEntryState;
  origin: SnrOrigin;
  errorMsg: string;
}
