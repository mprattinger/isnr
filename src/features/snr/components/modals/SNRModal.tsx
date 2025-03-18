import { Ref, useMemo, useState } from "react";
import { z } from "zod";
import Modal, { ModalHandle } from "../../../core/components/Modal";
import {
  BecButton,
  BecButtonRowContainer,
  BecError,
  BecFormInput,
  BecPanel,
  BecPanelContainer,
  BecTextOutput,
} from "bec-react-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSNRContext } from "../../contexts/SNRContext";
import { Variant } from "../../models/Types";
import { useAppData } from "../../../../contexts/AppContext";

interface ISNRModalProps {
  modalRef: Ref<ModalHandle>;
  // onModalResult: (data: OrderInfoResult) => void;
  onCancel: () => void;
}

export const SNRModal = (props: ISNRModalProps) => {
  const snrSchema = useMemo(
    () =>
      z.object({
        snr: z.string().min(1),
      }),
    []
  );
  type SNRSchema = z.infer<typeof snrSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SNRSchema>({
    resolver: zodResolver(snrSchema),
  });

  const { t } = useTranslation();
  const { variant } = useSNRContext();
  const { btrm } = useAppData();
  const [error, setError] = useState("");

  const formSubmitted = async (d: SNRSchema) => {
    setError("");
  };

  const getTitle = () => {
    switch (variant) {
      case Variant.PACKAGING:
        return t("profid:43471");
      case Variant.TOOLBUILDING:
        return t("profid:45361");
      case Variant.EXTSNR:
        return t("profid:45361");
      default:
        return "";
    }
  };

  const getLabelText = () => {
    switch (variant) {
      case Variant.PACKAGING:
        return t("profid:24722");
      case Variant.TOOLBUILDING:
        return t("profid:15291");
      case Variant.EXTSNR:
        return t("profid:15291");
      default:
        return "";
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <form onSubmit={handleSubmit(formSubmitted, (e) => console.error(e))}>
        <BecPanel header={getTitle()}>
          <BecFormInput<SNRSchema>
            id="snr"
            name="snr"
            label={getLabelText()}
            type="text"
            register={register}
            errors={errors}
          />
          {(variant === Variant.PACKAGING ||
            variant === Variant.TOOLBUILDING) && (
            <BecTextOutput id="snrInfo">
              {t("PackagingDataEmptyCreatesNew")}
            </BecTextOutput>
          )}
          <BecButtonRowContainer>
            <BecButton type="submit" variant={"orange"}>
              {t("profid:900001402")}
            </BecButton>
            <BecButton variant={"orange"} onClick={props.onCancel}>
              {t("profid:900002541")}
            </BecButton>
          </BecButtonRowContainer>
          {error && error !== "" && (
            // <div className="flex w-full bg-red-500 text-white px-2">
            //   {error}
            // </div>
            <BecError errorMessage={error} />
          )}
        </BecPanel>
      </form>
    </Modal>
  );
};
