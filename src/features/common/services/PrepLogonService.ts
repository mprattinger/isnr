import { AxiosError } from "axios";
import {
  ApplicationError,
  ApplicationErrorFactory,
} from "bec-react-components";
import i18n from "../../../utils/i18n";
import { profidBaseApi } from "../../core/ProfidBaseApi";

export const PrepLogonService = async (): Promise<
  Company[] | ApplicationError
> => {
  const url = `preplogon/comp`;
  const t = i18n.t;

  try {
    const resp = await profidBaseApi<CompanyResponse>(url);

    if (resp.status !== 200) {
      return ApplicationErrorFactory(
        t("PREPLOGON.SERVER_ERROR"),
        "PREPLOGON.SERVER_ERROR"
      );
    }

    return resp.data.companies;
  } catch (error) {
    let msg = error;

    if (error instanceof AxiosError) {
      msg = error.message;
    }

    return ApplicationErrorFactory(
      `${t("PREPLOGON.SERVER_ERROR")} (${msg})`,
      "PREPLOGON.SERVER_ERROR"
    );
  }
};

export interface CompanyResponse {
  companies: Company[];
  info: string;
}

export interface Company {
  compid: string;
  compname: string;
}
