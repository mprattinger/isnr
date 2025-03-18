import { Ref, useMemo } from "react";
import Modal, { ModalHandle } from "../../../core/components/Modal";
import {
  BecButton,
  BecButtonRowContainer,
  BecFormInput,
  BecPanel,
  BecPanelContainer,
} from "bec-react-components";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

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

interface IOrderInfoModalProps {
  modalRef: Ref<ModalHandle>;
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

  const formSubmitted = (d: OrderInfoSchema) => {
    //Data is formally ok,
    //Now check the data with the backend

    console.log(d);
  };

  return (
    <Modal ref={props.modalRef}>
      <BecPanelContainer>
        <form onSubmit={handleSubmit(formSubmitted, (e) => console.error(e))}>
          <BecPanel header={t("EnterOrderData")}>
            <BecPanelContainer>
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
                <BecButton variant={"orange"}>
                  {t("profid:900002541")}
                </BecButton>
              </BecButtonRowContainer>
            </BecPanelContainer>
          </BecPanel>
        </form>
      </BecPanelContainer>
    </Modal>
  );
};
