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
  ModalResult,
} from "../../../../playground/modals/Types";
import { SNRListEntry } from "../../models/SNRListEntry";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { CheckSnr } from "../../services/SNRService";
import { SnrOrigin } from "../../models/Types";
import { useAppData } from "../../../../contexts/AppContext";
import { useSNRContext } from "../../contexts/SNRContext";

const modifySchema = z.object({
  snr: z.string().min(1, { message: "SNR must be at least 1 character long" }),
});
type ModifySchema = z.infer<typeof modifySchema>;

interface IModifySNRModalProps<T>
  extends IBaseModalProps<T, SNRListEntry | undefined> {
  snr: SNRListEntry;
}

export function ModifySNRModal<T>(props: IModifySNRModalProps<T>) {
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
          const evt = d.detail as IModalOpenEventPayload<string>;
          if (evt.payload) {
            setValue("snr", evt.payload);
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

    props.callback(ModalResult.OkWithData(newSnr));
  };

  return (
    <Modal
      ref={props.modalRef}
      callback={() => {
        reset();
        props.callback;
      }}
    >
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
            <BecButton
              variant={"orange"}
              onClick={() => {
                reset();
                props.callback(ModalResult.Cancel());
              }}
            >
              {t("profid:900002541")}
            </BecButton>
          </BecButtonRowContainer>
          {error && error !== "" && <BecError errorMessage={error} />}
        </BecPanel>
      </form>
    </Modal>
  );
}
