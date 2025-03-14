import { BecInputContainer, BecLabel } from "bec-react-components";
import { createRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ISNRInput {
  onNewSnr: (snr: string) => void;
}

export const SNRInput = (props: ISNRInput) => {
  const { t } = useTranslation();

  const snrRef = createRef<HTMLInputElement>();

  const handlePressedDown = (event: KeyboardEvent) => {
    if (event.key !== "Tab" && event.key !== "Enter") return;

    event.preventDefault();
    event.stopPropagation();
    return false;
  };

  const handlePressedUp = (event: KeyboardEvent) => {
    if (event.key !== "Tab" && event.key !== "Enter") return;

    //Eingabe verarbeiten
    let inp = event.currentTarget as HTMLInputElement;
    if (inp.value !== "") {
      props.onNewSnr(inp.value);
    }
    event.preventDefault();
    event.stopPropagation();
    inp.value = "";
  };

  useEffect(() => {
    snrRef.current?.addEventListener("keyup", handlePressedUp);
    snrRef.current?.addEventListener("keydown", handlePressedDown);

    return () => {
      snrRef.current?.removeEventListener("keyup", handlePressedUp);
      snrRef.current?.removeEventListener("keydown", handlePressedDown);
    };
  }, []);

  return (
    <BecInputContainer>
      <BecLabel id="snrInput" label={t("profid:24681")} />
      <input
        id="snrInput"
        autoComplete="off"
        ref={snrRef}
        className="border-b border-b-solid border-b-becgray-200"
      />
    </BecInputContainer>
  );
};
