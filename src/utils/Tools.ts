export function isEqual(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function numberAsPercent(value: number): string {
  if (typeof value !== "number") {
    throw new Error("Input must be a number");
  }

  const percentValue = value * 100;

  const formattedValue = percentValue.toFixed(2).replace(".", ",");

  return `${formattedValue} %`;
}

export function numberAsCurrency(
  value: number,
  currencySymbol: string
): string {
  if (typeof value !== "number") {
    throw new Error("Input must be a number");
  }

  const formattedValue = value.toFixed(2).replace(".", ",");

  return `${currencySymbol} ${formattedValue}`;
}

export function formatPercentageValue(value: number): string {
  if (typeof value !== "number") {
    throw new Error("Input must be a number");
  }

  const percentValue = value;

  const formattedValue = percentValue.toFixed(2).replace(".", ",");

  return `${formattedValue} %`;
}

export function MinDate() {
  return new Date("1970-01-01Z00:00:00:000");
}

export function TranslateIBMDate(ibmDate: string): Date {
  //We must translate the IBM Date into a JS Date
  //IBM -> 17122024_101100
  //IBM -> DMMYYYY_HHMMSS
  //IBM -> DDMMYYYY_HHMMSS

  const items = ibmDate.split("_");
  if (items.length !== 2) {
    throw new Error("Invalid IBM Date format");
  }

  const date = items[0];
  const time = items[1];

  let day = 0;
  let month = 0;
  let year = 0;
  if (date.length === 7) {
    day = parseInt(date.substring(0, 1));
    const monthStr = date.substring(1, 2);
    month = parseInt(monthStr);
    month = month - 1;
    year = parseInt(date.substring(3, 4));
  } else {
    day = parseInt(date.substring(0, 2));
    const monthStr = date.substring(2, 4);
    month = parseInt(monthStr);
    month = month - 1;
    year = parseInt(date.substring(4, 8));
  }

  const hour = parseInt(time.substring(0, 2));
  const minute = parseInt(time.substring(2, 4));
  const second = parseInt(time.substring(4, 8));

  const jsDate = new Date(year, month, day, hour, minute, second);

  return jsDate;
}

export const StringFormat = (template: string, ...values: string[]) => {
  return template.replace(/{(\w+)}/g, (match, key) => values[key] || "");
};
