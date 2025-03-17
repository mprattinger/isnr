import { AxiosError } from "axios";
import {
  ApplicationError,
  ApplicationErrorFactory,
  FunctionBoxItem,
} from "bec-react-components";
import i18n from "../../../utils/i18n";
import { profidBaseApi } from "../../core/ProfidBaseApi";

export const LoadFunctions = async (
  mandant: number
): Promise<FunctionBoxItem[] | ApplicationError> => {
  const url = `functions?mand=${mandant}`;
  const t = i18n.t;

  try {
    const resp = await profidBaseApi<FunctionsResult>(url);

    if (resp.status !== 200) {
      return ApplicationErrorFactory(
        t("FUNCTIONS.SERVER_ERROR"),
        "FUNCTIONS.SERVER_ERROR"
      );
    }

    return resp.data.data;
  } catch (error) {
    let msg = error;

    if (error instanceof AxiosError) {
      msg = error.message;
    }

    return ApplicationErrorFactory(
      `${t("FUNCTIONS.SERVER_ERROR")} (${msg})`,
      "FUNCTIONS.SERVER_ERROR"
    );
  }
};

export interface FunctionsResult {
  sqlstm: string;
  data: FunctionBoxItem[];
}
