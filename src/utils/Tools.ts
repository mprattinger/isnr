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
