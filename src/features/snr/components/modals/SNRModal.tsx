import { Ref, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import Modal, { ModalHandle } from "../../../core/components/Modal";
import {
  ApplicationError,
  BecButton,
  BecButtonRowContainer,
  BecError,
  BecFormInput,
  BecPanel,
  BecTextOutput,
} from "bec-react-components";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Variant } from "../../models/Types";
import { useAppData } from "../../../../contexts/AppContext";
import {
  CheckSnr,
  SNRCheckResponse,
} from "../../../common/services/ProfidGenericService";

interface ISNRModalProps {
  modalRef: Ref<ModalHandle>;
  variant: Variant;
  onModalResult: (data: SNRCheckResponse) => void;
  onCancel: () => void;
}

export const SNRModal = (props: ISNRModalProps) => {
  const snrSchema = useMemo(
    () =>
      z.object({
        snr: z.string(),
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
  const { btrm } = useAppData();
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [labelText, setLabelText] = useState("");

  useEffect(() => {
    //Title
    switch (props.variant) {
      case Variant.PACKAGING:
        setTitle(t("profid:43471"));
        break;
      case Variant.TOOLBUILDING:
        setTitle(t("profid:45361"));
        break;
      case Variant.EXTSNR:
        setTitle(t("profid:45361"));
        break;
      default:
        break;
    }

    //LabelText
    switch (props.variant) {
      case Variant.PACKAGING:
        setLabelText(t("profid:24722"));
        break;
      case Variant.TOOLBUILDING:
        setLabelText(t("profid:15291"));
        break;
      case Variant.EXTSNR:
        setLabelText(t("profid:15291"));
        break;
      default:
        break;
    }
  }, [props.variant]);

  const formSubmitted = async (d: SNRSchema) => {
    setError("");

    //Data is formally ok,
    //Now check the data with the backend
    const snrCheckResult = await CheckSnr(btrm, props.variant, d.snr);
    if (snrCheckResult instanceof ApplicationError) {
      setError(snrCheckResult.message);
      return;
    }

    props.onModalResult(snrCheckResult);
  };

  return (
    <Modal ref={props.modalRef}>
      <form onSubmit={handleSubmit(formSubmitted, (e) => console.error(e))}>
        <BecPanel header={title}>
          <BecFormInput<SNRSchema>
            id="snr"
            name="snr"
            label={labelText}
            type="text"
            register={register}
            errors={errors}
          />
          {(props.variant === Variant.PACKAGING ||
            props.variant === Variant.TOOLBUILDING) && (
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
          {error && error !== "" && <BecError errorMessage={error} />}
        </BecPanel>
      </form>
    </Modal>
  );
};
