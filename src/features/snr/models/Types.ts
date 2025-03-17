export enum Variant {
  UNKNOWN = "",
  PACKAGING = "P",
  TOOLBUILDING = "T",
  FEEDBACK = "F",
  EXTSNR = "E",
  SHIPMENT = "S",
}

export enum SnrOrigin {
  UNKNOWN = "",
  GENERATED = "G",
  INTERNAL = "I",
  EXTERNAL = "E",
}

export enum SNRListEntryState {
  ADDED,
  EXISTING,
  MODIFIED,
  MODIFIED_EXISTING,
  REMOVED,
  REMOVED_EXISTING,
  DUPLICATE,
  IS_BOX_SNR,
  ERROR,
}
