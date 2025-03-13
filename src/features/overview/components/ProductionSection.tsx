import { BecPanel } from "bec-react-components";
import { ISNRImageButton } from "./ISNRImageButton";
import { useTranslation } from "react-i18next";

interface IProductionSection {
  onImageClicked: (image: string) => void;
}

export const ProductionSection = (props: IProductionSection) => {
  const { t } = useTranslation();
  return (
    <BecPanel header={t("profid:22731")}>
      <div className="flex flex-row flex-wrap gap-5 w-[436px]">
        <ISNRImageButton
          image="packaging"
          label={t("profid:43361")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="toolbuilding"
          label={t("profid:43371")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="checkpackaging"
          label={t("profid:43381")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="workfeedback"
          label={t("profid:35901")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="externalsnr"
          label={t("profid:43401")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="reprintlabel"
          label={t("profid:43331")}
          onImageClicked={props.onImageClicked}
        />
      </div>
    </BecPanel>
  );
};
