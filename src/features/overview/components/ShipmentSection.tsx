import { BecPanel } from "bec-react-components";
import { ISNRImageButton } from "./ISNRImageButton";
import { useTranslation } from "react-i18next";

interface IShipmentSection {
  onImageClicked: (image: string) => void;
}

export const ShipmentSection = (props: IShipmentSection) => {
  const { t } = useTranslation();
  return (
    <BecPanel header={t("profid:29181")}>
      <div className="flex flex-row flex-wrap gap-5 w-[436px]">
        <ISNRImageButton
          image="packaging"
          label={t("profid:43361")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="printdeliverylabel"
          label={t("profid:29251")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="checkpackaging"
          label={t("profid:43381")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="shipping"
          label={t("profid:43411")}
          onImageClicked={props.onImageClicked}
        />
        <ISNRImageButton
          image="checkpackaging"
          label={t("profid:43381")}
          onImageClicked={props.onImageClicked}
        />
      </div>
    </BecPanel>
  );
};
