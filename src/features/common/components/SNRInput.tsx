import { BecInputContainer, BecLabel } from "bec-react-components";
import { createRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface ISNRInput {
  onNewSnr: (snr: string) => Promise<void>;
}

export const SNRInput = (props: ISNRInput) => {
  const { t } = useTranslation();

  const queue: string[] = [];

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
    queue.push(inp.value);
    processQueue();
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

  const processQueue = async () => {
    if (queue.length > 0) {
      const current = queue.shift();
      if (current && current !== "") {
        await props.onNewSnr(current);
      }

      await processQueue();
    }
  };

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
