import { Ref } from "react";

export type ModalHandle<T = undefined, U = undefined> = {
  open: (payload?: T) => Promise<ModalResult<U | undefined>>;
  action: (payload: ModalResult<U>) => void;
};

export class ModalResult<T = undefined> {
  cancelled: boolean;
  data?: T;

  private constructor(cancelled: boolean, data?: T) {
    this.cancelled = cancelled;
    this.data = data;
  }

  static Ok(): ModalResult {
    return new ModalResult(false);
  }

  static OkWithData<T>(data: T): ModalResult<T> {
    return new ModalResult(false, data);
  }

  static Cancel(): ModalResult {
    return new ModalResult(true);
  }

  static CancelWithData<T>(data: T): ModalResult<T> {
    return new ModalResult(true, data);
  }
}

export interface IBaseModalProps<T = undefined, U = undefined> {
  modalRef: Ref<ModalHandle<T, U>>;
  title?: string;
}
