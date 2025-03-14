import { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { SNRItem } from "./SNRItem";

export const SNRList = (props: PropsWithChildren) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-row grow flex-wrap h-[303px] overflow-y-auto border content-start">
      <SNRItem isHeader={true} header={t("profid:24681")} />
      <SNRItem isHeader={true} header={t("profid:24681")} />
      <SNRItem isHeader={true} header={t("profid:24681")} />
      {props.children && props.children}
    </div>
  );
};
