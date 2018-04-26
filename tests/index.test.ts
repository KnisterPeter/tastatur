// tslint:disable:no-unused-expression
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import { Tastatur } from '../lib/index';

describe('Tastatur', () => {
  let tastatur!: Tastatur;

  beforeEach(() => {
    tastatur = new Tastatur();
  });

  describe('when installed', () => {
    let dom!: JSDOM;
    let document!: Document;

    function testKey(binding: string, code: string): void {
      try {
        let reactedToKey = false;

        tastatur.bind(binding, () => {
          reactedToKey = true;
        });
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code
          })
        );

        expect(reactedToKey, `Failed to handle ${binding} -> ${code}`).to.be.true;
      } finally {
        tastatur.unbind(binding);
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keyup', {
            code
          })
        );
      }
    }

    beforeEach(() => {
      dom = new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>');
      document = dom.window.document;
      tastatur.install(document);
    });

    afterEach(() => {
      tastatur.uninstall(document);
    });

    it('should respond to bound keys', () => {
      testKey('a', 'KeyA');
    });

    it('should not respond to unbound keys', () => {
      let reactedToKey = 0;

      tastatur.bind('a', () => {
        reactedToKey++;
      });
      document.dispatchEvent(
        new dom.window.KeyboardEvent('keydown', {
          code: 'KeyA'
        })
      );
      tastatur.unbind('a');
      document.dispatchEvent(
        new dom.window.KeyboardEvent('keydown', {
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
      document.dispatchEvent(
        new dom.window.KeyboardEvent('keydown', {
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
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
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
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
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
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keyup', {
            code: 'KeyA'
          })
        );
        document.dispatchEvent(
          new dom.window.KeyboardEvent('keydown', {
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
      tastatur.bind('a', e => {
        console.log(e);
        reactedToKey = true;
      });

      expect(reactedToKey).to.be.false;
    });
  });
});
