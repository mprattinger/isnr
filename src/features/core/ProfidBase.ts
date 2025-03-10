import axios, { AxiosInstance } from "axios";
import { GetBaseUrl } from "../../utils/Configuration";

let puiAuth: string = "";

export let profidBaseApi: AxiosInstance;

export const Factory = (auth: string) => {
  puiAuth = auth;

  const instance = axios.create({
    baseURL: GetBaseUrl(),
  });

  instance.interceptors.request.use(
    (cfg) => {
      cfg.url = cfg.url + `&AUTH=${puiAuth}`;
      return cfg;
    },
    (err) => Promise.reject(err)
  );

  profidBaseApi = instance;
};
