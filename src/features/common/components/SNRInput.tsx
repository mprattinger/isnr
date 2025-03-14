import { BecInputContainer, BecLabel } from "bec-react-components";
import { createRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface ISNRInput {
  onSnrEntered: (snr: string) => void;
  processing: boolean;
}

export const SNRInput = (props: ISNRInput) => {
  const { t } = useTranslation();

  const [snrList, setSnrList] = useState<string[]>([]);

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
    setSnrList((prev) => [...prev, inp.value]);
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

  useEffect(() => {
    if (snrList.length == 0) return;

    let current = snrList.shift();
    if (current && current !== "") {
      props.onSnrEntered(current);
    }
  }, [snrList]);

  return (
    <BecInputContainer>
      <BecLabel id="snrInput" label={t("profid:24681")} />
      <input
        id="snrInput"
        autoComplete="off"
        ref={snrRef}
        className="border-b border-b-solid border-b-becgray-200"
      />
      {props.processing && <p className="text-sm">Prüfung....</p>}
    </BecInputContainer>
  );
};
