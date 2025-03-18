import { Ref, useMemo, useState } from "react";
import Modal, { ModalHandle } from "../../../core/components/Modal";
import {
  ApplicationError,
  BecButton,
  BecButtonRowContainer,
  BecError,
  BecFormInput,
  BecPanel,
  BecPanelContainer,
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

// const orderInfoSchema = z.object({
//   feedbackId: z
//     .string({
//       required_error: "Missing",
//       message: "asdfaf",
//     })
//     .min(1, { message: "dafdasfasf" }),
//   employeeId: z
//     .preprocess((a) => parseInt(z.string().parse(a), 10), z.number())
//     .refine(async (value) => {}),
// });

// .refine(
//   (v) => {
//     if (v === 1234) {
//       throw "asfjkasfj";
//     }
//     if (v !== 5555) {
//       return false;
//     }

//     return true;
//   },
//   { message: "Not 5555" }
// )

export interface OrderInfoResult {
  feedback: FeedbackIdCheckResponse;
  employee: EmployeeIdCheckResponse;
}

interface IOrderInfoModalProps {
  modalRef: Ref<ModalHandle>;
  onModalResult: (data: OrderInfoResult) => void;
  onCancel: () => void;
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

    props.onModalResult({
      feedback: feedbackResult,
      employee: employeeResult,
    } as OrderInfoResult);
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
