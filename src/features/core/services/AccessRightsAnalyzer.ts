import { IAccessRight } from "../models/AccessRight";

export const AccessRightsAnalyzer = (accessRight: string): IAccessRight => {
  const rls = accessRight.split("/");
  const ret: IAccessRight = {} as IAccessRight;

  rls.forEach((rl) => {
    const r = rl.split("_");
    if (r[0] === "PROD" && r[1] === "1") {
      ret.production = true;
    }
    if (r[0] === "SHIPM" && r[1] === "1") {
      ret.shipment = true;
    }
    if (r[0] === "ADMIN" && r[1] === "1") {
      ret.administration = true;
    }
  });

  return ret;
};
