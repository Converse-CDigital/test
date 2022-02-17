declare interface Promise<T> {
  cancel: (message: string) => void;
}
