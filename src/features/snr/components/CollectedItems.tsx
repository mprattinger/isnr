import { BecTextOutput } from "bec-react-components";
import { useTranslation } from "react-i18next";
import { useSNRContext } from "../contexts/SNRContext";
import { Variant } from "../models/Types";
import { SNRListEntry } from "../models/SNRListEntry";

interface ICollectedItemsProps {
  snrs: SNRListEntry[];
}

export const CollectedItems = (props: ICollectedItemsProps) => {
  const { t } = useTranslation();

  const { variant, data } = useSNRContext();

  return (
    <div className="flex gap-x-4">
      {variant === Variant.PACKAGING && (
        <>
          <BecTextOutput id="collected" label={t("profid:12111")}>
            {props.snrs.length} / {parseInt(data?.feedback.pack ?? "0")}
          </BecTextOutput>
          <BecTextOutput id="collected" label={t("profid:43451")}>
            {props.snrs.length} / {parseInt(data?.feedback.orderquant ?? "0")}
          </BecTextOutput>
        </>
      )}
      {variant === Variant.FEEDBACK ||
        (variant === Variant.EXTSNR && (
          <>
            <BecTextOutput id="added" label={t("profid:47321")}>
              WorkCount
            </BecTextOutput>
          </>
        ))}
    </div>
  );
};
