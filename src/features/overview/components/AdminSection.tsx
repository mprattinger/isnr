import { BecPanel } from "bec-react-components";
import { ISNRImageButton } from "./ISNRImageButton";
import { useTranslation } from "react-i18next";

interface IAdminSection {
  onImageClicked: (image: string) => void;
}

export const AdminSectionSection = (props: IAdminSection) => {
  const { t } = useTranslation();
  return (
    <BecPanel header={t("profid:29581")}>
      <div className="flex flex-row flex-wrap gap-5 w-[436px]">
        <ISNRImageButton
          image="nutzenref"
          label={t("profid:43421")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="managesnr"
          label={t("profid:43431")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="printsettings"
          label={t("profid:43441")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="deliveredisnr"
          label={t("profid:37661")}
          onImageClicked={props.onImageClicked}
        />
      </div>
    </BecPanel>
  );
};
