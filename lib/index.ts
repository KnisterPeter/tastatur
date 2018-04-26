interface Registration {
  binding: string;
  keys: (string | string[])[];
  fn(e: KeyboardEvent): void;
}

export class Tastatur {
  private registrations: Registration[] = [];
  private pressed: { [button: string]: boolean } = {};

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

  public bind(binding: string, fn: (e: KeyboardEvent) => void): void {
    const keys = binding.split('+').map(button => this.mapKey(button));
    this.registrations.push({ binding, keys, fn });
  }

  public unbind(binding: string): void {
    const index = this.registrations
      .findIndex(registration => registration.binding === binding);
    if (index > -1) {
      this.registrations.splice(index, 1);
    }
  }

  private mapKey(key: string): string | string[] {
    // tslint:disable-next-line:cyclomatic-complexity
    switch (key.toLowerCase()) {
      case 'ctrlleft':
        return 'ControlLeft';
      case 'ctrlright':
        return 'ControlRight';
      case 'ctrl':
        return ['ControlLeft', 'ControlRight'];
      case 'shiftleft':
      case 'shiftright':
        return key;
      case 'shift':
        return ['ShiftLeft', 'ShiftRight'];
      case 'alt':
        return 'AltLeft';
      case 'altgr':
        return 'AltRight';
    }
    return `Key${key.toUpperCase()}`;
  }

  public handleKey(e: KeyboardEvent): void {
    if (e.type === 'keydown') {
      this.pressed[e.code] = true;
    } else if (e.type === 'keyup') {
      this.pressed[e.code] = false;
    }
    const registration = this.registrations.find(registration => {
      const required = this.areRequiredKeysPressed(registration);
      const keys = this.requiredKeys(registration);
      const pressed = Object.keys(this.pressed).filter(key => this.pressed[key]);
      const others = pressed.every(key => keys.indexOf(key) > -1);
      return required && others;
    });
    if (registration) {
      registration.fn(e);
    }
  }

  private requiredKeys(registration: Registration): string[] {
    return registration.keys.reduce((keys: string[], key) => {
      if (Array.isArray(key)) {
        return [...keys, ...key];
      } else {
        return [...keys, key];
      }
    }, []);
  }

  private areRequiredKeysPressed(registration: Registration): boolean {
    return registration.keys.reduce((result, key) => {
      if (Array.isArray(key)) {
        return result && key.some(key => this.pressed[key]);
      } else {
        return result && this.pressed[key];
      }
    }, true);
  }
}
