import { ProgramInfoModel } from "bec-components";

const GetProgrammInfo = (screen: number): ProgramInfoModel => {
    let ret: ProgramInfoModel =
    {
        program: "BEC177",
        programLabel: "Programm",
        developer: "Michael Prattinger",
        developerLabel: "Entwickler",
        screen: `BEC177 / ${screen}`,
        screenLabel: "Bildschirm",
        creationYear: "2022",
        creationYearLabel: "Jahr"
    };

    //Übersetzte Parameter

    return ret;
}

export { GetProgrammInfo };