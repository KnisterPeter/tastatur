// tslint:disable:no-unused-expression
import { expect } from 'chai';
import 'core-js';
import { JSDOM } from 'jsdom';

import { Tastatur, KeyMap, Key } from '../lib/index';

interface BrowserAccess {
  window: Window;
  document: Document;
  createKeyboardEvent(type: 'keydown' | 'keyup', code: Key): Event;
}

type Browser = 'standard' | 'ie11';

const isNode = typeof module !== 'undefined' && typeof process.env.NYC_CONFIG !== 'undefined';
const isBrowser = typeof window !== 'undefined';
const isIE11 = isBrowser
  && !!(window as any).MSInputMethodContext
  && !!(document as any).documentMode;

const testSuite: Browser[] = isNode
  ? ['standard', 'ie11']
  : isIE11
    ? ['ie11']
    : ['standard'];

function createDOM(browser: Browser = 'standard'): BrowserAccess {
  // tslint:disable:object-literal-key-quotes
  const IE11Map = {
    'ctrlleft': 'Control',
    'ctrlright': 'Control',
    'shiftleft': 'Shift',
    'shiftright': 'Shift',
    'alt': 'Alt',
    'esc': 'Esc',
    'tab': 'Tab'
  };
  // tslint:enable:object-literal-key-quotes
  if (typeof window === 'undefined') {
    const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
    if (browser === 'ie11') {
      return {
        window: dom.window,
        document: dom.window.document,
        createKeyboardEvent(type: 'keydown' | 'keyup', code: Key): Event {
          return new dom.window.KeyboardEvent(type, {
            key: (IE11Map as any)[code] || code,
            keyCode: code.charCodeAt(0)
          } as any);
        }
      };
    }
    return {
      window: dom.window,
      document: dom.window.document,
      createKeyboardEvent(type: 'keydown' | 'keyup', code: Key): Event {
        return new dom.window.KeyboardEvent(type, {
          code: KeyMap[code]
        });
      }
    };
  }
  if (browser === 'ie11') {
    return {
      window,
      document: window.document,
      createKeyboardEvent(type: 'keydown' | 'keyup', code: Key): Event {
        const evt = document.createEvent('KeyboardEvent');
        evt.initKeyboardEvent(type, true, true, window, (IE11Map as any)[code] || code, 0, '', false, '');
        return evt;
      }
    };
  }
  return {
    window,
    document: window.document,
    createKeyboardEvent(type: 'keydown' | 'keyup', code: Key): Event {
      return new KeyboardEvent(type, {
        code: KeyMap[code]
      });
    }
  };
}

describe('Tastatur', () => {
  let tastatur!: Tastatur;

  beforeEach(() => {
    tastatur = new Tastatur();
  });

  it('should throw for unknown key mappings', () => {
    expect(
      () => tastatur.bind('abc', () => {
        //
      }))
      .to.throw("Unsupported key 'abc'");
  });

  describe('with keyboard mapping', () => {
    let dom!: BrowserAccess;

    beforeEach(() => {
      dom = createDOM(isIE11 ? 'ie11' : 'standard');
    });

    it('should setup keymapping z -> y (e.g. en -> de)', () => {
      let reactedToKey = false;

      tastatur = new Tastatur(Object.assign({}, KeyMap, {z: 'KeyY'}));
      tastatur.install(dom.document);
      tastatur.bind('z', () => {
        reactedToKey = true;
      });
      dom.document.dispatchEvent(
        dom.createKeyboardEvent('keydown', 'y')
      );

      expect(reactedToKey).to.be.true;
    });
  });

  testSuite.forEach(browser => {
    describe(`when installed (${browser})`, () => {
      let dom!: BrowserAccess;

      beforeEach(() => {
        dom = createDOM(browser as any);
        tastatur.install(dom.document);
      });

      afterEach(() => {
        tastatur.uninstall(dom.document);
      });

      function testKey(binding: string, code: Key): void {
        try {
          let reactedToKey = false;

          tastatur.bind(binding, () => {
            reactedToKey = true;
          });
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', code)
          );

          expect(reactedToKey, `Failed to handle ${binding} -> ${code}`).to.be.true;
        } finally {
          tastatur.unbind(binding);
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keyup', code)
          );
        }
      }

      it('should respond to bound keys', () => {
        testKey('a', 'a');
      });

      it('should not respond to unbound keys', () => {
        let reactedToKey = 0;

        tastatur.bind('a', () => {
          reactedToKey++;
        });
        dom.document.dispatchEvent(
          dom.createKeyboardEvent('keydown', 'a')
        );
        tastatur.unbind('a');
        dom.document.dispatchEvent(
          dom.createKeyboardEvent('keydown', 'a')
        );

        expect(reactedToKey).to.be.eq(1);
      });

      it('should ignore unbound keys', () => {
        let reactedToKey = false;

        tastatur.bind('a', () => {
          reactedToKey = true;
        });
        dom.document.dispatchEvent(
          dom.createKeyboardEvent('keydown', 'b')
        );

        expect(reactedToKey).to.be.false;
      });

      it('should respond to special keys', () => {
        testKey('CtrlLeft', 'ctrlleft');
        if (browser !== 'ie11') {
          testKey('CtrlRight', 'ctrlright');
        }
        testKey('Ctrl', 'ctrlright');
        testKey('Ctrl', 'ctrlleft');

        testKey('ShiftLeft', 'shiftleft');
        if (browser !== 'ie11') {
          testKey('ShiftRight', 'shiftright');
        }
        testKey('Shift', 'shiftright');
        testKey('Shift', 'shiftleft');

        testKey('Alt', 'alt');
        if (browser !== 'ie11') {
          testKey('AltGr', 'altgr');
        }

        testKey('Esc', 'esc');
        if (browser !== 'ie11') {
          testKey('CapsLock', 'capslock');
        }
        testKey('Tab', 'tab');
        testKey('Backquote', 'backquote');
        testKey('Minus', 'minus');
        testKey('Equal', 'equal');
        testKey('BracketLeft', 'bracketleft');
        testKey('BracketRigth', 'bracketrigth');
        testKey('Semicolon', 'semicolon');
        testKey('Quote', 'quote');
        testKey('Backslash', 'backslash');
        testKey('Comma', 'comma');
        testKey('Period', 'period');
        testKey('Slash', 'slash');
        testKey('IntlBackslash', 'intlbackslash');
        testKey('ScrollLock', 'scrolllock');
        testKey('Pause', 'pause');
        testKey('Insert', 'insert');
        testKey('Home', 'home');
        testKey('PageUp', 'pageup');
        testKey('Delete', 'delete');
        testKey('End', 'end');
        testKey('PageDown', 'pagedown');
        testKey('ArrowLeft', 'arrowleft');
        testKey('ArrowUp', 'arrowup');
        testKey('ArrowRight', 'arrowright');
        testKey('ArrowDown', 'arrowdown');
        testKey('BrowserBack', 'browserback');
        testKey('BrowserForward', 'browserforward');
        testKey('BrowserFavorites', 'browserfavorites');
        testKey('NumLock', 'numlock');
        testKey('NumpadDivide', 'numpaddivide');
        testKey('NumpadMultiply', 'numpadmultiply');
        testKey('NumpadSubtract', 'numpadsubtract');
        testKey('NumpadAdd', 'numpadadd');
        testKey('NumpadEnter', 'numpadenter');
        testKey('NumpadDecimal', 'numpaddecimal');

        testKey('F1', 'f1');
        testKey('F2', 'f2');
        testKey('F3', 'f3');
        testKey('F4', 'f4');
        testKey('F5', 'f5');
        testKey('F6', 'f6');
        testKey('F7', 'f7');
        testKey('F8', 'f8');
        testKey('F9', 'f9');
        testKey('F10', 'f10');
        testKey('F11', 'f11');
        testKey('F12', 'f12');
        testKey('F13', 'f13');
        testKey('F14', 'f14');
        testKey('F15', 'f15');
        testKey('F16', 'f16');
        testKey('F17', 'f17');
        testKey('F18', 'f18');
        testKey('F19', 'f19');
        testKey('F20', 'f20');

        testKey('Digit1', 'digit1');
        testKey('Digit2', 'digit2');
        testKey('Digit3', 'digit3');
        testKey('Digit4', 'digit4');
        testKey('Digit5', 'digit5');
        testKey('Digit6', 'digit6');
        testKey('Digit7', 'digit7');
        testKey('Digit8', 'digit8');
        testKey('Digit9', 'digit9');
        testKey('Digit0', 'digit0');
        testKey('Numpad1', 'numpad1');
        testKey('Numpad2', 'numpad2');
        testKey('Numpad3', 'numpad3');
        testKey('Numpad4', 'numpad4');
        testKey('Numpad5', 'numpad5');
        testKey('Numpad6', 'numpad6');
        testKey('Numpad7', 'numpad7');
        testKey('Numpad8', 'numpad8');
        testKey('Numpad9', 'numpad9');
        testKey('Numpad0', 'numpad0');

        testKey('1', 'digit1');
        testKey('2', 'digit2');
        testKey('3', 'digit3');
        testKey('4', 'digit4');
        testKey('5', 'digit5');
        testKey('6', 'digit6');
        testKey('7', 'digit7');
        testKey('8', 'digit8');
        testKey('9', 'digit9');
        testKey('0', 'digit0');
        testKey('1', 'numpad1');
        testKey('2', 'numpad2');
        testKey('3', 'numpad3');
        testKey('4', 'numpad4');
        testKey('5', 'numpad5');
        testKey('6', 'numpad6');
        testKey('7', 'numpad7');
        testKey('8', 'numpad8');
        testKey('9', 'numpad9');
        testKey('0', 'numpad0');
      });

      describe('and bind combinations', () => {
        it('should respond to it', () => {
          let reactedToKey = false;

          tastatur.bind('a+b', () => {
            reactedToKey = true;
          });
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', 'a')
          );
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', 'b')
          );

          expect(reactedToKey).to.be.true;
        });

        it('should respond matching one', () => {
          let reactedToB = false;
          let reactedToAB = false;

          tastatur.bind('b', () => {
            reactedToB = true;
          });
          tastatur.bind('a+b', () => {
            reactedToAB = true;
          });
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', 'a')
          );
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', 'b')
          );

          expect(reactedToB).to.be.false;
          expect(reactedToAB).to.be.true;
        });

        it('should handle keyup state', () => {
          let reactedToKey = false;

          tastatur.bind('a+b', () => {
            reactedToKey = true;
          });
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', 'a')
          );
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keyup', 'a')
          );
          dom.document.dispatchEvent(
            dom.createKeyboardEvent('keydown', 'b')
          );

          expect(reactedToKey).to.be.false;
        });
      });
    });
  });

  describe('when uninstalled', () => {
    it('should not respond to bound keys', () => {
      let reactedToKey = false;
      tastatur.bind('a', () => {
        reactedToKey = true;
      });

      expect(reactedToKey).to.be.false;
    });
  });
});
