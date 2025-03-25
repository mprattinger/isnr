import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
  BecPanelRowContainer,
  BecTextOutput,
} from "bec-react-components";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSNRContext } from "../contexts/SNRContext";

interface IFeedbackTimerProps {
  ontimerModified: (mode: string) => void;
}

export const FeedbackTimer = (props: IFeedbackTimerProps) => {
  const { t } = useTranslation();

  const [startBtnText, setStartBtnText] = useState(t("profid:900002481"));
  const [equipBtnText, setEquipBtnText] = useState(t("profid:900002491"));
  const [pauseBtnText, setPauseBtnText] = useState(t("profid:21851"));

  const [workedMS, setWorkedMS] = useState(0);
  const [equipedMS, setEquipedMS] = useState(0);
  const [pausedMS, setPausedMS] = useState(0);

  const [workingActive, setWorkingActive] = useState(false);
  const [equipActive, setEquipActive] = useState(false);
  const [pauseActive, setPauseActive] = useState(false);

  const [workStarted, setWorkStarted] = useState(new Date(0));
  const [equipStarted, setEquipStarted] = useState(new Date(0));
  const [pauseStarted, setPauseStarted] = useState(new Date(0));

  const [timer, setTimer] = useState(false);

  const {
    data,
    alreadyWorked,
    setAlreadyWorked,
    alreadyEquiped,
    setAlreadyEquiped,
    alreadyPaused,
    setAlreadyPaused,
  } = useSNRContext();

  useEffect(() => {
    if (data === null) return;

    data?.feedback.istZeit;
  }, [data?.feedback]);

  const handleStart = () => {
    const wasAct = workingActive;

    prepare();

    if (!wasAct) {
      setWorkingActive(true);
      setWorkStarted(new Date());

      setTimer(true);
      props.ontimerModified("START");

      setStartBtnText(t("profid:26141"));
    }
  };

  const handleEquip = () => {
    const wasAct = equipActive;

    prepare();

    if (!wasAct) {
      setEquipActive(true);
      setEquipStarted(new Date());

      setTimer(true);
      props.ontimerModified("START");

      setEquipBtnText(t("profid:26141"));
    }
  };

  const handlePause = () => {
    const wasAct = pauseActive;

    prepare();

    if (!wasAct) {
      setPauseActive(true);
      setPauseStarted(new Date());

      setTimer(true);
      props.ontimerModified("START");

      setPauseBtnText(t("profid:26141"));
    }
  };

  //#region Prepare
  const prepare = () => {
    setTimer(false);

    props.ontimerModified("STOP");

    setStartBtnText(t("profid:900002481"));
    setEquipBtnText(t("profid:900002491"));
    setPauseBtnText(t("profid:21851"));

    //Calculation
    if (workingActive) {
      //Update data
      //Die bisherige erfasste Zeit ist im context gespeichert
      const diff = new Date().getTime() - workStarted.getTime();
      const newValue = alreadyWorked + diff;
      setWorkedMS(newValue);
      setAlreadyWorked(newValue);

      setWorkStarted(new Date(0));
    }
    if (equipActive) {
      //Update data
      //Die bisherige erfasste Zeit ist im context gespeichert
      const diff = new Date().getTime() - equipStarted.getTime();
      const newValue = alreadyEquiped + diff;
      setWorkedMS(newValue);
      setAlreadyEquiped(newValue);

      setEquipStarted(new Date(0));
    }
    if (pauseActive) {
      //Update data
      //Die bisherige erfasste Zeit ist im context gespeichert
      const diff = new Date().getTime() - pauseStarted.getTime();
      const newValue = alreadyPaused + diff;
      setPausedMS(newValue);
      setAlreadyPaused(newValue);

      setPauseStarted(new Date(0));
    }

    setWorkingActive(false);
    setEquipActive(false);
    setPauseActive(false);
  };
  //#endregion

  const formatTime = (ms: number): string => {
    if (ms / 1000 <= 59) {
      const t = Math.round(ms / 1000);
      return `${t.toFixed(2)} s`;
    }

    if (ms / 60_000 <= 59) {
      const t = Math.round(ms / 60_000);
      return `${t.toFixed(2)} m`;
    }

    const t = Math.round(ms / 3_600_000);
    return `${t.toFixed(2)} h`;
  };

  useEffect(() => {
    let interval = 0;

    const workStarting = workedMS;
    const equipStarting = equipedMS;
    const pauseStarting = workedMS;

    if (timer) {
      interval = setInterval(() => {
        if (workingActive && workStarted !== new Date(0)) {
          let diff = new Date().getTime() - workStarted.getTime();
          setWorkedMS(workStarting + diff);
        }

        if (equipActive && equipStarted !== new Date(0)) {
          let diff = new Date().getTime() - equipStarted.getTime();
          setEquipedMS(equipStarting + diff);
        }

        if (pauseActive && pauseStarted !== new Date(0)) {
          let diff = new Date().getTime() - pauseStarted.getTime();
          setPausedMS(pauseStarting + diff);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [
    timer,
    workingActive,
    equipActive,
    pauseActive,
    workStarted,
    equipStarted,
    pauseStarted,
  ]);

  return (
    <BecPanel header={t("profid:35231")}>
      <BecPanelRowContainer>
        <BecTextOutput
          id="employeeid"
          label={t("profid:22011")}
          value={data?.employee.employeeId.toString() ?? ""}
        />
        <BecTextOutput
          id="worked"
          label={t("profid:13041")}
          value={formatTime(workedMS)}
        />
        <BecTextOutput
          id="equiped"
          label={t("profid:24121")}
          value={formatTime(equipedMS)}
        />
        <BecTextOutput
          id="pause"
          label={t("profid:21851")}
          value={formatTime(pausedMS)}
        />
      </BecPanelRowContainer>
      <BecButtonRowContainer>
        <BecButton variant={"secondary"} size={"default"} onClick={handleStart}>
          {startBtnText}
        </BecButton>
        <BecButton variant={"secondary"} size={"default"} onClick={handleEquip}>
          {equipBtnText}
        </BecButton>
        <BecButton variant={"secondary"} size={"default"} onClick={handlePause}>
          {pauseBtnText}
        </BecButton>
      </BecButtonRowContainer>
    </BecPanel>
  );
};
