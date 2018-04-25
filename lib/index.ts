interface Registration {
  keys: string[];
  fn(e: KeyboardEvent): void;
}

export class Tastatur {
  private registrations: Registration[] = [];
  private pressed: {[button: string]: boolean} = {};

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
    const buttons = keys.split('+').map(button => `Key${button.toUpperCase()}`);
    this.registrations.push({ keys: buttons, fn });
  }

  public handleKey(e: KeyboardEvent): void {
    if (e.type === 'keydown') {
      this.pressed[e.code] = true;
    } else if (e.type === 'keyup') {
      this.pressed[e.code] = false;
    }
    const registration = this.registrations.find(registration =>
      registration.keys.every(key => this.pressed[key])
    );
    if (registration) {
      registration.fn(e);
    }
  }
}
