import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
  BecPanelContainer,
  BecPanelRowContainer,
} from "bec-react-components";
import { IBasePageProps } from "../../core/models/IPageBaseProps";
import { useAppData } from "../../../contexts/AppContext";
import { ProductionSection } from "../components/ProductionSection";
import { ShipmentSection } from "../components/ShipmentSection";
import { AdminSectionSection } from "../components/AdminSection";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { TranslateToFunctionCodes } from "../services/TranslateToFunctionCodes";
import { useNavigate } from "react-router-dom";
import { Variant } from "../../snr/models/Types";

interface IOverviewPageProps extends IBasePageProps {}

export const OverviewPage = (props: IOverviewPageProps) => {
  const { accessRights, subscribeToKeyEvent, clearKeyListeners } = useAppData();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleImageClicked = (image: string) => {
    //Translate image name to functionCode

    switch (image) {
      case "workfeedback":
        return;
      case "externalsnr":
        return;
      case "packaging":
        navigate("/snr", { state: Variant.PACKAGING.toString() });
        return;
      case "toolbuilding":
        return;
      case "shipping":
        return;
      default:
        break;
    }

    var target = TranslateToFunctionCodes(image);
    props.onFunctionCodeSelected(target);
  };

  useEffect(() => {
    subscribeToKeyEvent({
      forKey: "F7",
      event: () => {
        console.log("Should close");
      },
    });

    return () => {
      clearKeyListeners();
    };
  }, []);

  return (
    <>
      <BecPanelContainer>
        <BecPanelRowContainer className="w-[1280px] overflow-hidden">
          {accessRights.production && (
            <ProductionSection onImageClicked={handleImageClicked} />
          )}
          {accessRights.shipment && (
            <ShipmentSection onImageClicked={handleImageClicked} />
          )}
          {accessRights.administration && (
            <AdminSectionSection onImageClicked={handleImageClicked} />
          )}
        </BecPanelRowContainer>
        <BecPanel>
          <BecButtonRowContainer>
            <BecButton variant={"default"} size={"default"}>
              {t("profid:900000421")}
            </BecButton>
            {/* <BecButton Style="ButtonStyle.PRIMARY" Text="@loc["900000421"]" KeyboardKey="F7" OnClickCallback="endClicked" /> */}
          </BecButtonRowContainer>
        </BecPanel>
      </BecPanelContainer>
    </>
  );
};
