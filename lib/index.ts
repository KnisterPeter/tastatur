interface Registration {
  keys: string;
  fn(e: KeyboardEvent): void;
}

export class Tastatur {
  private registrations: Registration[] = [];

  constructor() {
    this.handleKey = this.handleKey.bind(this);
  }

  public install(el = document): void {
    el.addEventListener('keydown', this.handleKey);
    el.addEventListener('keypress', this.handleKey);
    el.addEventListener('keyup', this.handleKey);
  }

  public uninstall(el = document): void {
    el.removeEventListener('keydown', this.handleKey);
    el.removeEventListener('keypress', this.handleKey);
    el.removeEventListener('keyup', this.handleKey);
  }

  public bind(keys: string, fn: (e: KeyboardEvent) => void): void {
    this.registrations.push({ keys: `Key${keys.toUpperCase()}`, fn });
  }

  public handleKey(e: KeyboardEvent): void {
    const registration = this.registrations.find(
      registration => registration.keys === e.code
    );
    if (registration) {
      registration.fn(e);
    }
  }
}
