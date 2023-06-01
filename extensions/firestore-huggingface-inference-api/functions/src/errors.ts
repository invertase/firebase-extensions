class ExtensionError extends Error {
  code: string;

  constructor(message: string) {
    super(message);
  }
}

export class InvalidArgumentError extends ExtensionError {
  constructor(message: string) {
    super(message);
    this.code = 'invalid-argument';
  }
}
