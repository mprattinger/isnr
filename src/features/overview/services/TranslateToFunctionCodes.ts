export const TranslateToFunctionCodes = (image: string): string => {
  switch (image) {
    case "nutzenref":
      return "KORN";
    case "managesnr":
      return "ISNV";
    case "printsettings":
      return "DRUP";
    case "deliveredisnr":
      return "GEIA";
    case "checkpackaging":
      return "BOX";
    case "reprintlabel":
      return "LANA";
    case "printdeliverylabel":
      return "VERL";
    default:
      return image;
  }
};
