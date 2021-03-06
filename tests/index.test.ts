// tslint:disable:no-unused-expression no-implicit-dependencies
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import { Tastatur, KeyMap } from '../lib/index';

interface BrowserAccess {
  window: Window;
  document: Document;
  KeyboardEvent: { new (typeArg: string, eventInitDict?: KeyboardEventInit): KeyboardEvent };
}

function createDOM(): BrowserAccess {
  if (typeof window === 'undefined') {
    const dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
    return {
      window: dom.window,
      document: dom.window.document,
      KeyboardEvent: dom.window.KeyboardEvent
    };
  }
  return {
    window,
    document: window.document,
    KeyboardEvent
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
      dom = createDOM();
    });

    it('should setup keymapping z -> y (e.g. en -> de)', () => {
      let reactedToKey = false;

      tastatur = new Tastatur(Object.assign({}, KeyMap, {z: 'KeyY'}));
      tastatur.install(dom.document);
      tastatur.bind('z', () => {
        reactedToKey = true;
      });
      dom.document.dispatchEvent(
        new dom.KeyboardEvent('keydown', {
          code: 'KeyY'
        })
      );

      expect(reactedToKey).to.be.true;
    });
  });

  describe('when installed', () => {
    let dom!: BrowserAccess;

    beforeEach(() => {
      dom = createDOM();
      tastatur.install(dom.document);
    });

    afterEach(() => {
      tastatur.uninstall(dom.document);
    });

    function testKey(binding: string, code: string): void {
      try {
        let reactedToKey = false;

        tastatur.bind(binding, () => {
          reactedToKey = true;
        });
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keydown', {
            code
          })
        );

        expect(reactedToKey, `Failed to handle ${binding} -> ${code}`).to.be.true;
      } finally {
        tastatur.unbind(binding);
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keyup', {
            code
          })
        );
      }
    }

    it('should respond to bound keys', () => {
      testKey('a', 'KeyA');
    });

    it('should not respond to unbound keys', () => {
      let reactedToKey = 0;

      tastatur.bind('a', () => {
        reactedToKey++;
      });
      dom.document.dispatchEvent(
        new dom.KeyboardEvent('keydown', {
          code: 'KeyA'
        })
      );
      tastatur.unbind('a');
      dom.document.dispatchEvent(
        new dom.KeyboardEvent('keydown', {
          code: 'KeyA'
        })
      );

      expect(reactedToKey).to.be.eq(1);
    });

    it('should ignore unbound keys', () => {
      let reactedToKey = false;

      tastatur.bind('a', () => {
        reactedToKey = true;
      });
      dom.document.dispatchEvent(
        new dom.KeyboardEvent('keydown', {
          code: 'KeyB'
        })
      );

      expect(reactedToKey).to.be.false;
    });

    it('should respond to special keys', () => {
      testKey('CtrlLeft', 'ControlLeft');
      testKey('CtrlRight', 'ControlRight');
      testKey('Ctrl', 'ControlRight');
      testKey('Ctrl', 'ControlLeft');

      testKey('ShiftLeft', 'ShiftLeft');
      testKey('ShiftRight', 'ShiftRight');
      testKey('Shift', 'ShiftRight');
      testKey('Shift', 'ShiftLeft');

      testKey('Alt', 'AltLeft');
      testKey('AltGr', 'AltRight');

      testKey('Esc', 'Escape');
      testKey('CapsLock', 'CapsLock');
      testKey('Tab', 'Tab');
      testKey('Backquote', 'Backquote');
      testKey('Minus', 'Minus');
      testKey('Equal', 'Equal');
      testKey('BracketLeft', 'BracketLeft');
      testKey('BracketRigth', 'BracketRigth');
      testKey('Semicolon', 'Semicolon');
      testKey('Quote', 'Quote');
      testKey('Backslash', 'Backslash');
      testKey('Comma', 'Comma');
      testKey('Period', 'Period');
      testKey('Slash', 'Slash');
      testKey('IntlBackslash', 'IntlBackslash');
      testKey('ScrollLock', 'ScrollLock');
      testKey('Pause', 'Pause');
      testKey('Insert', 'Insert');
      testKey('Home', 'Home');
      testKey('PageUp', 'PageUp');
      testKey('Delete', 'Delete');
      testKey('End', 'End');
      testKey('PageDown', 'PageDown');
      testKey('ArrowLeft', 'ArrowLeft');
      testKey('ArrowUp', 'ArrowUp');
      testKey('ArrowRight', 'ArrowRight');
      testKey('ArrowDown', 'ArrowDown');
      testKey('BrowserBack', 'BrowserBack');
      testKey('BrowserForward', 'BrowserForward');
      testKey('BrowserFavorites', 'BrowserFavorites');
      testKey('NumLock', 'NumLock');
      testKey('NumpadDivide', 'NumpadDivide');
      testKey('NumpadMultiply', 'NumpadMultiply');
      testKey('NumpadSubtract', 'NumpadSubtract');
      testKey('NumpadAdd', 'NumpadAdd');
      testKey('NumpadEnter', 'NumpadEnter');
      testKey('NumpadDecimal', 'NumpadDecimal');

      testKey('F1', 'F1');
      testKey('F2', 'F2');
      testKey('F3', 'F3');
      testKey('F4', 'F4');
      testKey('F5', 'F5');
      testKey('F6', 'F6');
      testKey('F7', 'F7');
      testKey('F8', 'F8');
      testKey('F9', 'F9');
      testKey('F10', 'F10');
      testKey('F11', 'F11');
      testKey('F12', 'F12');
      testKey('F13', 'F13');
      testKey('F14', 'F14');
      testKey('F15', 'F15');
      testKey('F16', 'F16');
      testKey('F17', 'F17');
      testKey('F18', 'F18');
      testKey('F19', 'F19');
      testKey('F20', 'F20');

      testKey('Digit1', 'Digit1');
      testKey('Digit2', 'Digit2');
      testKey('Digit3', 'Digit3');
      testKey('Digit4', 'Digit4');
      testKey('Digit5', 'Digit5');
      testKey('Digit6', 'Digit6');
      testKey('Digit7', 'Digit7');
      testKey('Digit8', 'Digit8');
      testKey('Digit9', 'Digit9');
      testKey('Digit0', 'Digit0');
      testKey('Numpad1', 'Numpad1');
      testKey('Numpad2', 'Numpad2');
      testKey('Numpad3', 'Numpad3');
      testKey('Numpad4', 'Numpad4');
      testKey('Numpad5', 'Numpad5');
      testKey('Numpad6', 'Numpad6');
      testKey('Numpad7', 'Numpad7');
      testKey('Numpad8', 'Numpad8');
      testKey('Numpad9', 'Numpad9');
      testKey('Numpad0', 'Numpad0');

      testKey('1', 'Digit1');
      testKey('2', 'Digit2');
      testKey('3', 'Digit3');
      testKey('4', 'Digit4');
      testKey('5', 'Digit5');
      testKey('6', 'Digit6');
      testKey('7', 'Digit7');
      testKey('8', 'Digit8');
      testKey('9', 'Digit9');
      testKey('0', 'Digit0');
      testKey('1', 'Numpad1');
      testKey('2', 'Numpad2');
      testKey('3', 'Numpad3');
      testKey('4', 'Numpad4');
      testKey('5', 'Numpad5');
      testKey('6', 'Numpad6');
      testKey('7', 'Numpad7');
      testKey('8', 'Numpad8');
      testKey('9', 'Numpad9');
      testKey('0', 'Numpad0');
    });

    describe('and bind combinations', () => {
      it('should respond to it', () => {
        let reactedToKey = false;

        tastatur.bind('a+b', () => {
          reactedToKey = true;
        });
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keydown', {
            code: 'KeyB'
          })
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
          new dom.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keydown', {
            code: 'KeyB'
          })
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
          new dom.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keyup', {
            code: 'KeyA'
          })
        );
        dom.document.dispatchEvent(
          new dom.KeyboardEvent('keydown', {
            code: 'KeyB'
          })
        );

        expect(reactedToKey).to.be.false;
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
