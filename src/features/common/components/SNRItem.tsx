import { cn } from "bec-react-components";
import { SNRListEntry } from "../../snr/models/SNRListEntry";
import { useTranslation } from "react-i18next";
import { SNRListEntryState } from "../../snr/models/Types";

interface ISNRItemProps {
  isHeader?: boolean;
  header?: string;
  no?: number;
  snr?: SNRListEntry;
}

export const SNRItem = (props: ISNRItemProps) => {
  const { t } = useTranslation();

  const itemTooltip = (): string => {
    if (props.isHeader) return "";

    if (!props.snr) return "";

    switch (props.snr.state) {
      case SNRListEntryState.ADDED:
        return t("LISTSTATE_ADDED");
      case SNRListEntryState.EXISTING:
        return t("LISTSTATE_EXISTING");
      case SNRListEntryState.MODIFIED:
        return t("LISTSTATE_MODIFIED");
      case SNRListEntryState.REMOVED:
        return t("");
      case SNRListEntryState.DUPLICATE:
        return t("LISTSTATE_DUPLICATE");
      case SNRListEntryState.IS_BOX_SNR:
        return props.snr.errorMsg;
      case SNRListEntryState.ERROR:
        return props.snr.errorMsg;
    }

    return "";
  };

  const getCss = (): string => {
    if (props.isHeader) return "";

    if (!props.snr) return "";

    switch (props.snr.state) {
      case SNRListEntryState.ADDED:
        return "snradded";
      case SNRListEntryState.EXISTING:
        return "snrexisting";
      case SNRListEntryState.DUPLICATE:
        return "snrduplicate";
      case SNRListEntryState.IS_BOX_SNR:
        return "snrduplicate";
      case SNRListEntryState.REMOVED:
        return "";
      case SNRListEntryState.ERROR:
        return "bg-snrerror";
    }

    return "";
  };

  return (
    <div
      className={cn(
        props.isHeader && "font-bold",
        "flex w-1/3 p-1 self-center"
      )}
    >
      <div className={cn("flex grow p-2 rounded", !props.isHeader && getCss())}>
        <div className="mr-4">{props.isHeader ? "#" : props.no}</div>
        <div className="flex grow" title={itemTooltip()}>
          {props.isHeader && props.isHeader
            ? props.header
            : props.snr?.serialnumber}
        </div>
        <div></div>
      </div>
    </div>
  );
};
