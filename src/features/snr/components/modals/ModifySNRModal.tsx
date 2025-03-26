import {
  ApplicationError,
  BecButton,
  BecButtonRowContainer,
  BecError,
  BecFormInput,
  BecPanel,
} from "bec-react-components";
import {
  Modal,
  IModalOpenEventPayload,
  ModalOpenEventName,
} from "../../../../playground/modals/Modal";
import {
  IBaseModalProps,
  IBasePayload,
  ModalHandle,
  ModalResult,
} from "../../../../playground/modals/Types";
import { SNRListEntry } from "../../models/SNRListEntry";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RefObject, useEffect, useState } from "react";
import { CheckSnr } from "../../services/SNRService";
import { SnrOrigin } from "../../models/Types";
import { useAppData } from "../../../../contexts/AppContext";
import { useSNRContext } from "../../contexts/SNRContext";

export interface IModifySNRPayload extends IBasePayload {
  snr: string;
}

const modifySchema = z.object({
  snr: z.string().min(1, { message: "SNR must be at least 1 character long" }),
});
type ModifySchema = z.infer<typeof modifySchema>;

interface IModifySNRModalProps
  extends IBaseModalProps<IBasePayload, SNRListEntry> {
  snr: SNRListEntry;
}

export function ModifySNRModal(props: IModifySNRModalProps) {
  const { t } = useTranslation();
  const { btrm } = useAppData();
  const { variant } = useSNRContext();

  const [error, setError] = useState("");

  const {
    reset,
    setValue,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ModifySchema>({
    resolver: zodResolver(modifySchema),
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    window.addEventListener(
      ModalOpenEventName,
      (d) => {
        if (d instanceof CustomEvent) {
          const evt = d.detail as IModalOpenEventPayload<IModifySNRPayload>;
          if (evt.payload) {
            setValue("snr", evt.payload.snr);
          }
        }
      },
      { signal }
    );

    return () => {
      controller.abort();
    };
  }, []);

  const formSubmitted = async (d: ModifySchema) => {
    setError("");

    const checkResult = await CheckSnr(btrm, d.snr, variant);
    if (checkResult instanceof ApplicationError) {
      setError(checkResult.message);
      return;
    }

    const newSnr = { ...props.snr };
    newSnr.serialnumber = d.snr;
    newSnr.origin = checkResult.snrOrigin ?? SnrOrigin.UNKNOWN;

    const ref = props.modalRef as RefObject<
      ModalHandle<IBasePayload, SNRListEntry>
    >;
    if (ref.current) {
      ref.current.action(ModalResult.OkWithData(newSnr));
    }
  };

  const handleCancelClicked = () => {
    const ref = props.modalRef as RefObject<
      ModalHandle<string, SNRListEntry | undefined>
    >;
    reset();

    if (ref.current) {
      ref.current.action(ModalResult.Cancel());
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <form onSubmit={handleSubmit(formSubmitted, (e) => console.error(e))}>
        <BecPanel header={t("profid:43471")}>
          <BecFormInput<ModifySchema>
            id="snr"
            name="snr"
            label={t("profid:24681")}
            type="text"
            register={register}
            errors={errors}
          />
          <BecButtonRowContainer>
            <BecButton type="submit" variant={"orange"}>
              {t("profid:900001402")}
            </BecButton>
            <BecButton variant={"orange"} onClick={handleCancelClicked}>
              {t("profid:900002541")}
            </BecButton>
          </BecButtonRowContainer>
          {error && error !== "" && <BecError errorMessage={error} />}
        </BecPanel>
      </form>
    </Modal>
  );
}
