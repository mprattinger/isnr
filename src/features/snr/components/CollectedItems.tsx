import { BecTextOutput } from "bec-react-components";
import { useTranslation } from "react-i18next";
import { useSNRContext } from "../contexts/SNRContext";
import { Variant } from "../models/Types";

export const CollectedItems = () => {
  const { t } = useTranslation();

  const { variant } = useSNRContext();

  return (
    <div className="flex gap-x-4">
      {variant === Variant.PACKAGING && (
        <>
          <BecTextOutput id="collected" label={t("profid:12111")}>
            22 / 500
          </BecTextOutput>
          <BecTextOutput id="collected" label={t("profid:43451")}>
            22 / 500
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
