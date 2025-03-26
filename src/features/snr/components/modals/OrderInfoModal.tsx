import { RefObject, useMemo, useState } from "react";
import {
  ApplicationError,
  BecButton,
  BecButtonRowContainer,
  BecError,
  BecFormInput,
  BecPanel,
} from "bec-react-components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  CheckEmployeeId,
  CheckFeedbackId,
  EmployeeIdCheckResponse,
  FeedbackIdCheckResponse,
} from "../../../common/services/ProfidGenericService";
import { useAppData } from "../../../../contexts/AppContext";
import { Variant } from "../../models/Types";
import {
  IBaseModalProps,
  IBasePayload,
  ModalHandle,
  ModalResult,
} from "../../../../playground/modals/Types";
import { Modal } from "../../../../playground/modals/Modal";

export interface OrderInfoResult {
  feedback: FeedbackIdCheckResponse;
  employee: EmployeeIdCheckResponse;
}

interface IOrderInfoModalProps
  extends IBaseModalProps<IBasePayload, OrderInfoResult> {
  variant: Variant;
}

export const OrderInfoModal = (props: IOrderInfoModalProps) => {
  const orderInfoSchema = useMemo(
    () =>
      z.object({
        feedbackId: z
          .string({
            required_error: "Missing",
            message: "asdfaf",
          })
          .min(1, { message: "dafdasfasf" }),
        employeeId: z.preprocess(
          (a) => (a === "" ? 0 : parseInt(z.string().parse(a), 10)),
          z.number().gte(1)
        ),
      }),
    []
  );
  type OrderInfoSchema = z.infer<typeof orderInfoSchema>;

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<OrderInfoSchema>({
    resolver: zodResolver(orderInfoSchema),
  });

  const { t } = useTranslation();

  const { btrm } = useAppData();

  const [error, setError] = useState("");

  const formSubmitted = async (d: OrderInfoSchema) => {
    setError("");

    //Data is formally ok,
    //Now check the data with the backend
    const feedbackResult = await CheckFeedbackId(btrm, d.feedbackId);
    if (feedbackResult instanceof ApplicationError) {
      setError(feedbackResult.message);
      return;
    }

    const employeeResult = await CheckEmployeeId(btrm, d.employeeId);
    if (employeeResult instanceof ApplicationError) {
      setError(employeeResult.message);
      return;
    }

    const ref = props.modalRef as RefObject<
      ModalHandle<IBasePayload, OrderInfoResult>
    >;
    if (ref.current) {
      ref.current.action(
        ModalResult.OkWithData({
          feedback: feedbackResult,
          employee: employeeResult,
        } as OrderInfoResult)
      );
    }
  };

  const handleCancelClicked = () => {
    const ref = props.modalRef as RefObject<
      ModalHandle<IBasePayload, OrderInfoResult | undefined>
    >;
    if (ref.current) {
      ref.current.action(ModalResult.Cancel());
    }
  };

  return (
    <Modal ref={props.modalRef}>
      <form onSubmit={handleSubmit(formSubmitted, (e) => console.error(e))}>
        <BecPanel header={t("EnterOrderData")}>
          <BecFormInput<OrderInfoSchema>
            id="feedbackId"
            name="feedbackId"
            label={t("profid:24031")}
            type="text"
            register={register}
            errors={errors}
          />
          <BecFormInput<OrderInfoSchema>
            id="employeeId"
            name="employeeId"
            label={t("profid:43481")}
            type="number"
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
};
