import { ProgramInfoModel } from "bec-react-components";

export const GetProgramInfo = (): ProgramInfoModel => {
  const ret = {
    creationYear: "2023",
    developer: "MPR",
    screen: "0",
    program: "ISNR",
  } as ProgramInfoModel;

  return ret;
};
