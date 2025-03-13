let isRegistered = false;

export const RegisterRDFCommunication = (
  msgReceived: (action: string, payload: string) => void
) => {
  if (!isRegistered) {
    window.addEventListener("message", (evt) => {
      console.log("Listener registered");

      const internalEvt = evt as unknown as MessageEventDetail;

      if (typeof internalEvt.detail === "undefined") return;

      try {
        msgReceived(
          internalEvt.detail.action,
          JSON.stringify(internalEvt.detail.payload)
        );
      } catch (err) {
        console.error("Error when receiving a message: " + err);
      }
    });
    isRegistered = true;
  }
};

export const UnRegisterRDFCommunication = () => {
  window.removeEventListener("message", () => {
    console.log("Listener deregistered");
  });
};

export const SendRDFCommand = (command: string, payload: string = "") => {
  const contend = {
    action: command,
    payload: payload,
  };

  if (import.meta.env.MODE === "development") {
    console.log("Dev Mode");

    if (command === "getInfo") {
      window.dispatchEvent(
        new CustomEvent("message", {
          bubbles: true,
          detail: {
            action: "getInfo",
            payload: {
              BTRM: 1,
              AUTH: "NOPUI",
              ACCESS: "PROD_1/SHIPM_1/ADMIN_1",
            },
          },
        })
      );
    } else if (command === "fnct") {
      alert(`Would open function ${payload}`);
    }

    return;
  }

  window.parent.postMessage(contend, "*");
};

type MessageDetail = {
  action: string;
  payload: object;
};

type MessageEventDetail = {
  detail: MessageDetail;
};
