import { BecInputContainer, BecLabel } from "bec-react-components";
import { createRef, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export const SNRInput = () => {
  const { t } = useTranslation();

  const [processing, setProcessing] = useState(false);

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

    event.preventDefault();
    event.stopPropagation();
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
      <input id="snrInput" autoComplete="off" ref={snrRef} />
      {processing && <p></p>}
    </BecInputContainer>
  );
};
