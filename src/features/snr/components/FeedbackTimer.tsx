import {
  BecButton,
  BecButtonRowContainer,
  BecPanel,
  BecPanelRowContainer,
  BecTextOutput,
} from "bec-react-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MinDate } from "../../../utils/Tools";
import { datetimeRegex } from "zod";
import DateTime from "../../../utils/DateTime";
import TimeSpan from "../../../utils/TimeSpan";

export const FeedbackTimer = () => {
  const { t } = useTranslation();

  const [startBtnTest, setStartBtnTest] = useState(t("profid:900002481"));
  const [equipBtnTest, setEquipBtnTest] = useState(t("profid:900002491"));
  const [pauseBtnTest, setPauseBtnTest] = useState(t("profid:21851"));

  const [workedHours, setWorkedHours] = useState<TimeSpan>(new TimeSpan(0));
  const [equipedHours, setEquipedHours] = useState<TimeSpan>(new TimeSpan(0));
  const [pausedHours, setPausedHours] = useState<TimeSpan>(new TimeSpan(0));

  const [workingActive, setWorkingActive] = useState(false);
  const [equipActive, setEquipActive] = useState(false);
  const [pauseActive, setPauseActive] = useState(false);

  const [workStarted, setWorkStarted] = useState(new DateTime());
  const [equipStarted, setEquipStarted] = useState(new DateTime());
  const [pauseStarted, setPauseStarted] = useState(new DateTime());

  console.log("Render");

  const handleStart = () => {
    const wasAct = workingActive;

    prepare();

    if (!wasAct) {
      setWorkingActive(true);
      setWorkStarted(DateTime.now);

      //TODO: Start time
      //TODO: Notify other components

      setStartBtnTest(t("profid:26141"));
    }
  };

  //#region Prepare
  const prepare = () => {
    //TODO: Stop timer

    //TODO: Notify other components

    setStartBtnTest(t("profid:900002481"));
    setEquipBtnTest(t("profid:900002491"));
    setPauseBtnTest(t("profid:21851"));

    //Calculation
    if (workingActive) {
      var diff = DateTime.now.diff(workStarted);
      setWorkedHours((prev) => prev.add(diff));

      //TODO: Update data

      setWorkStarted(new DateTime());
    }
    if (equipActive) {
      var diff = DateTime.now.diff(equipStarted);
      setEquipedHours((prev) => prev.add(diff));

      //TODO: Update data

      setEquipStarted(new DateTime());
    }
    if (pauseActive) {
      var diff = DateTime.now.diff(pauseStarted);
      setPausedHours((prev) => prev.add(diff));

      //TODO: Update data

      setPauseStarted(new DateTime());
    }
  };
  //#endregion

  return (
    <BecPanel header={t("profid:35231")}>
      <BecPanelRowContainer>
        <BecTextOutput id="employeeid" label={t("profid:22011")} value="5555" />
        <BecTextOutput
          id="worked"
          label={t("profid:13041")}
          value={workedHours.totalHours.toFixed(2)}
        />
        <BecTextOutput
          id="equiped"
          label={t("profid:24121")}
          value={equipedHours.totalHours.toFixed(2)}
        />
        <BecTextOutput
          id="pause"
          label={t("profid:21851")}
          value={pausedHours.totalHours.toFixed(2)}
        />
      </BecPanelRowContainer>
      <BecButtonRowContainer>
        <BecButton variant={"secondary"} size={"default"} onClick={handleStart}>
          {startBtnTest}
        </BecButton>
        <BecButton variant={"secondary"} size={"default"}>
          {equipBtnTest}
        </BecButton>
        <BecButton variant={"secondary"} size={"default"}>
          {pauseBtnTest}
        </BecButton>
      </BecButtonRowContainer>
    </BecPanel>
  );
};
