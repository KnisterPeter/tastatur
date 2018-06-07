interface Registration {
  binding: string;
  keys: (string | string[])[];
  fn(e: KeyboardEvent): void;
}

/**
 * Maps key binding names to keycodes.
 */
// tslint:disable:object-literal-key-quotes
export const KeyMap = {
  'ctrlleft': 'ControlLeft',
  'ctrlright': 'ControlRight',
  'shiftleft': 'ShiftLeft',
  'shiftright': 'ShiftRight',
  'alt': 'AltLeft',
  'altgr': 'AltRight',
  'esc': 'Escape',
  'capslock': 'CapsLock',
  'tab': 'Tab',
  'backquote': 'Backquote',
  'minus': 'Minus',
  'equal': 'Equal',
  'bracketleft': 'BracketLeft',
  'bracketrigth': 'BracketRigth',
  'semicolon': 'Semicolon',
  'quote': 'Quote',
  'backslash': 'Backslash',
  'comma': 'Comma',
  'period': 'Period',
  'slash': 'Slash',
  'intlbackslash': 'IntlBackslash',
  'scrolllock': 'ScrollLock',
  'pause': 'Pause',
  'insert': 'Insert',
  'home': 'Home',
  'pageup': 'PageUp',
  'delete': 'Delete',
  'end': 'End',
  'pagedown': 'PageDown',
  'arrowleft': 'ArrowLeft',
  'arrowup': 'ArrowUp',
  'arrowright': 'ArrowRight',
  'arrowdown': 'ArrowDown',
  'browserback': 'BrowserBack',
  'browserforward': 'BrowserForward',
  'browserfavorites': 'BrowserFavorites',
  'numlock': 'NumLock',
  'numpaddivide': 'NumpadDivide',
  'numpadmultiply': 'NumpadMultiply',
  'numpadsubtract': 'NumpadSubtract',
  'numpadadd': 'NumpadAdd',
  'numpadenter': 'NumpadEnter',
  'numpaddecimal': 'NumpadDecimal',
  'f1': 'F1',
  'f2': 'F2',
  'f3': 'F3',
  'f4': 'F4',
  'f5': 'F5',
  'f6': 'F6',
  'f7': 'F7',
  'f8': 'F8',
  'f9': 'F9',
  'f10': 'F10',
  'f11': 'F11',
  'f12': 'F12',
  'f13': 'F13',
  'f14': 'F14',
  'f15': 'F15',
  'f16': 'F16',
  'f17': 'F17',
  'f18': 'F18',
  'f19': 'F19',
  'f20': 'F20',
  'digit1': 'Digit1',
  'digit2': 'Digit2',
  'digit3': 'Digit3',
  'digit4': 'Digit4',
  'digit5': 'Digit5',
  'digit6': 'Digit6',
  'digit7': 'Digit7',
  'digit8': 'Digit8',
  'digit9': 'Digit9',
  'digit0': 'Digit0',
  'numpad1': 'Numpad1',
  'numpad2': 'Numpad2',
  'numpad3': 'Numpad3',
  'numpad4': 'Numpad4',
  'numpad5': 'Numpad5',
  'numpad6': 'Numpad6',
  'numpad7': 'Numpad7',
  'numpad8': 'Numpad8',
  'numpad9': 'Numpad9',
  'numpad0': 'Numpad0',
  'a': 'KeyA',
  'b': 'KeyB',
  'c': 'KeyC',
  'd': 'KeyD',
  'e': 'KeyE',
  'f': 'KeyF',
  'g': 'KeyG',
  'h': 'KeyH',
  'i': 'KeyI',
  'j': 'KeyJ',
  'k': 'KeyK',
  'l': 'KeyL',
  'm': 'KeyM',
  'n': 'KeyN',
  'o': 'KeyO',
  'p': 'KeyP',
  'q': 'KeyQ',
  'r': 'KeyR',
  's': 'KeyS',
  't': 'KeyT',
  'u': 'KeyU',
  'v': 'KeyV',
  'w': 'KeyW',
  'x': 'KeyX',
  'y': 'KeyY',
  'z': 'KeyZ'
};
// tslint:enable:object-literal-key-quotes

export class Tastatur {
  private readonly registrations: Registration[] = [];
  private readonly pressed: { [key: string]: boolean } = {};
  private readonly keymap: typeof KeyMap;

  constructor(keymap = KeyMap) {
    this.keymap = keymap;

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
    const keys = binding.split('+').map(button => this.mapKeyBinding(button));
    this.registrations.push({ binding, keys, fn });
  }

  public unbind(binding: string): void {
    const index = this.registrations
      .findIndex(registration => registration.binding === binding);
    if (index > -1) {
      this.registrations.splice(index, 1);
    }
  }

  private mapKeyBinding(key: string): string | string[] {
    if (key.toLowerCase() in this.keymap) {
      return this.keymap[key.toLowerCase() as keyof typeof KeyMap];
    }
    // tslint:disable-next-line:cyclomatic-complexity
    switch (key.toLowerCase()) {
      case 'ctrl':
        return [this.keymap.ctrlleft, this.keymap.ctrlright];
      case 'shift':
        return [this.keymap.shiftleft, this.keymap.shiftright];
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
      case '0':
        return [`Digit${key}`, `Numpad${key}`];
      }
    throw new Error(`Unsupported key '${key}'`);
  }

  // private mapKey(key: string): string {
  //   return this.keymap ? this.keymap[key] || key : key;
  // }

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
