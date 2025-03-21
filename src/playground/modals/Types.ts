import { Ref } from "react";

export type ModalHandle<T> = {
  open: (payload: T) => void;
  close: () => void;
};

export class ModalResult<T> {
  cancelled: boolean;
  data?: T;

  private constructor(cancelled: boolean, data?: T) {
    this.cancelled = cancelled;
    this.data = data;
  }

  static Ok(): ModalResult<undefined> {
    return new ModalResult(false);
  }

  static OkWithData<T>(data: T): ModalResult<T> {
    return new ModalResult(false, data);
  }

  static Cancel(): ModalResult<undefined> {
    return new ModalResult(true);
  }

  static CancelWithData<T>(data: T): ModalResult<T> {
    return new ModalResult(true, data);
  }
}

export interface IBaseModalProps<T, U> {
  modalRef: Ref<ModalHandle<T>>;
  title?: string;
  callback: (result: ModalResult<U>) => void;
}
