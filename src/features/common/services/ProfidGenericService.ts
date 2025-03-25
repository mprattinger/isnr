import { AxiosError } from "axios";
import i18n from "../../../utils/i18n";
import {
  ApplicationError,
  ApplicationErrorFactory,
} from "bec-react-components";
import { ProfidApiBaseResponseModel } from "../models/ProfidApiBaseResponseModel";
import { profidBaseApi } from "../../core/ProfidBaseApi";
import { Variant } from "../../snr/models/Types";
import { TranslateIBMDate } from "../../../utils/Tools";

export const CheckFeedbackId = async (
  mandant: number,
  feedbackId: string
): Promise<FeedbackIdCheckResponse | ApplicationError> => {
  const url = `profidgen/rmnrcheck?mand=${mandant}&rmnr=${feedbackId}`;
  const t = i18n.t;

  try {
    const resp = await profidBaseApi<
      ProfidApiBaseResponseModel<FeedbackIdCheckResponse>
    >(url);

    if (resp.status !== 200) {
      return ApplicationErrorFactory(
        t("PROFIDGENERIC.FEEDBACKCHECK.SERVER_ERROR"),
        "PROFIDGENERIC.FEEDBACKCHECK.SERVER_ERROR"
      );
    }

    //TODO: Translate errors
    if (resp.data.status !== "OK") {
      return ApplicationErrorFactory(
        t(resp.data.errmsg),
        "PROFIDGENERIC.FEEDBACKCHECK.API_ERROR"
      );
    }

    return resp.data.data;
  } catch (error) {
    let msg = error;

    if (error instanceof AxiosError) {
      msg = error.message;
    }

    return ApplicationErrorFactory(
      `${t("PROFIDGENERIC.FEEDBACKCHECK.SERVER_ERROR")} (${msg})`,
      "PROFIDGENERIC.FEEDBACKCHECK.SERVER_ERROR"
    );
  }
};

export const CheckEmployeeId = async (
  mandant: number,
  employeeId: number
): Promise<EmployeeIdCheckResponse | ApplicationError> => {
  const url = `profidgen/persnrcheck?mand=${mandant}&persnr=${employeeId}`;
  const t = i18n.t;

  try {
    const resp = await profidBaseApi<
      ProfidApiBaseResponseModel<EmployeeIdCheckResponse>
    >(url);

    if (resp.status !== 200) {
      return ApplicationErrorFactory(
        t("PROFIDGENERIC.EMPLOYEEIDCHECK.SERVER_ERROR"),
        "PROFIDGENERIC.EMPLOYEEIDCHECK.SERVER_ERROR"
      );
    }

    //TODO: Translate errors
    if (resp.data.status !== "OK") {
      return ApplicationErrorFactory(
        t(resp.data.errmsg),
        "PROFIDGENERIC.EMPLOYEEIDCHECK.API_ERROR"
      );
    }

    return resp.data.data;
  } catch (error) {
    let msg = error;

    if (error instanceof AxiosError) {
      msg = error.message;
    }

    return ApplicationErrorFactory(
      `${t("PROFIDGENERIC.EMPLOYEEIDCHECK.SERVER_ERROR")} (${msg})`,
      "PROFIDGENERIC.EMPLOYEEIDCHECK.SERVER_ERROR"
    );
  }
};

export const CheckSnr = async (
  mandant: number,
  variant: Variant,
  snr?: string
) => {
  let url = `profidgen/seriennr?mand=${mandant}&variant=${variant}`;
  if (snr && snr !== "") {
    url = `${url}&snr=${snr}`;
  }
  const t = i18n.t;

  try {
    const resp = await profidBaseApi<
      ProfidApiBaseResponseModel<SNRCheckResponse>
    >(url);

    if (resp.status !== 200) {
      return ApplicationErrorFactory(
        t("PROFIDGENERIC.SNRCHECK.SERVER_ERROR"),
        "PROFIDGENERIC.SNRCHECK.SERVER_ERROR"
      );
    }

    //TODO: Translate errors
    if (resp.data.status !== "OK") {
      return ApplicationErrorFactory(
        t(resp.data.errmsg),
        "PROFIDGENERIC.SNRCHECK.API_ERROR"
      );
    }

    let d = resp.data.data;
    d.children = d.children.map((x) => {
      return {
        childSnr: x.childSnr,
        origin: x.origin,
        datetime: x.datetime,
        date: TranslateIBMDate(x.datetime),
      };
    });

    return d;
  } catch (error) {
    let msg = error;

    if (error instanceof AxiosError) {
      msg = error.message;
    }

    return ApplicationErrorFactory(
      `${t("PROFIDGENERIC.SNRCHECK.SERVER_ERROR")} (${msg})`,
      "PROFIDGENERIC.SNRCHECK.SERVER_ERROR"
    );
  }
};

export interface FeedbackIdCheckResponse {
  rmnr: string;
  artnr: string;
  aeaa: string;
  btra: string;
  artdescr1: string;
  artdescr2: string;
  pack: string;
  snrInOrder: string;
  orderId: string;
  aura: string;
  aure: string;
  position: string;
  orderquant: string;
  istZeit: string;
  ruestZeit: string;
  istMenge: string;
}

export interface EmployeeIdCheckResponse {
  company: number;
  employeeId: number;
  firstname: string;
  lastname: string;
}

export interface SNRCheckResponse {
  snr: string;
  snrOrigin: string;
  children: SNRChildren[];
}

export interface SNRChildren {
  childSnr: string;
  origin: string;
  datetime: string;
  date: Date;
}
