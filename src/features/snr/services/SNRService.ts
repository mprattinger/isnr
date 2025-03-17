import {
  ApplicationError,
  ApplicationErrorFactory,
} from "bec-react-components";
import { SnrOrigin, Variant } from "../models/Types";
import i18n from "../../../utils/i18n";
import { AxiosError } from "axios";
import { profidBaseApi } from "../../core/ProfidBaseApi";
import { ProfidApiBaseResponseModel } from "../../common/models/ProfidApiBaseResponseModel";

export const CheckSnr = async (
  mandant: number,
  snr: string,
  variant: Variant
): Promise<CheckSnrResponse | ApplicationError> => {
  const url = `isnr/seriennr?mand=${mandant}&snr=${snr}&variant=${variant}`;
  const t = i18n.t;

  try {
    const resp = await profidBaseApi<
      ProfidApiBaseResponseModel<CheckSnrResponse>
    >(url);

    if (resp.status !== 200) {
      return ApplicationErrorFactory(
        t("SNR.CHECK.SERVER_ERROR"),
        "SNR.CHECK.SERVER_ERROR"
      );
    }

    if (resp.data.status !== "OK") {
      return ApplicationErrorFactory(
        t(resp.data.errmsg),
        "SNR.CHECK.API_ERROR"
      );
    }

    return resp.data.data;
  } catch (error) {
    let msg = error;

    if (error instanceof AxiosError) {
      msg = error.message;
    }

    return ApplicationErrorFactory(
      `${t("SNR.CHECK.SERVER_ERROR")} (${msg})`,
      "SNR.CHECK.SERVER_ERROR"
    );
  }
};

export interface CheckSnrResponse {
  snrOrigin: SnrOrigin;
}
