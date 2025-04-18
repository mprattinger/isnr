import { cn } from "bec-react-components";
import { SNRListEntry } from "../../snr/models/SNRListEntry";
import { useTranslation } from "react-i18next";
import { SNRListEntryState } from "../../snr/models/Types";
import { ActionType, SNRItemActions } from "./SNRItemActions";
import { useRef, useState } from "react";
import {
  IBaseMessagePayload,
  IBasePayload,
  ModalHandle,
  ModalResult,
} from "../../../playground/modals/Types";
import { YesNoModal } from "../../../playground/modals/YesNoModal";
import { StringFormat } from "../../../utils/Tools";
import {
  IModifySNRPayload,
  ModifySNRModal,
} from "../../snr/components/modals/ModifySNRModal";

interface ISNRPayload {}

interface ISNRItemProps {
  isHeader?: boolean;
  header?: string;
  no?: number;
  snr?: SNRListEntry;
  onSNRModified: (snr: SNRListEntry) => void;
  onSNRDeleted: (snr: SNRListEntry) => void;
}

export const SNRItem = (props: ISNRItemProps) => {
  const { t } = useTranslation();

  const modifyPopup = useRef<ModalHandle<IBasePayload, SNRListEntry>>(null);
  const deletePopup = useRef<ModalHandle>(null);

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
        return "bg-snradded";
      case SNRListEntryState.EXISTING:
        return "bg-snrexisting";
      case SNRListEntryState.DUPLICATE:
        return "bg-snrduplicate";
      case SNRListEntryState.IS_BOX_SNR:
        return "bg-snrduplicate";
      case SNRListEntryState.REMOVED:
        return "";
      case SNRListEntryState.ERROR:
        return "bg-snrerror";
    }

    return "";
  };

  const handleAction = async (action: ActionType) => {
    if (action === "MODIFY") {
      const res = await modifyPopup.current?.open({
        snr: props.snr?.serialnumber,
      } as IModifySNRPayload);
      if (res === undefined || res?.cancelled || res?.data === undefined) {
        return;
      }
      props.onSNRModified(res.data);
    } else {
      const res = await deletePopup.current?.open({
        title: t("DeleteISRNFromListHeader"),
        message: StringFormat(
          t("DeleteISRNFromList"),
          props.snr?.serialnumber ?? ""
        ),
      } as IBaseMessagePayload);
      if (res === undefined || res?.cancelled) {
        return;
      }

      if (props.snr) {
        props.snr.state = SNRListEntryState.REMOVED;

        //Notify parent
        props.onSNRDeleted(props.snr);
      }
    }
  };

  return (
    <>
      <div
        className={cn(
          props.isHeader && "font-bold",
          "flex w-1/3 p-1 self-center"
        )}
      >
        <div
          className={cn("flex grow p-2 rounded", !props.isHeader && getCss())}
        >
          <div className="mr-4">{props.isHeader ? "#" : props.no}</div>
          <div className="flex grow" title={itemTooltip()}>
            {props.isHeader && props.isHeader
              ? props.header
              : props.snr?.serialnumber}
          </div>
          <SNRItemActions
            isHeader={props.isHeader}
            entry={props.snr}
            onAction={handleAction}
          />
        </div>
      </div>
      {props.snr && (
        <>
          <ModifySNRModal modalRef={modifyPopup} snr={props.snr} />
          <YesNoModal modalRef={deletePopup} />
        </>
      )}
    </>
  );
};
